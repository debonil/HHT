import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
/*
  Generated class for the DataSyncProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataSyncProvider {
  logArray: Array<string>=new Array<string>();
  serverTimeAtProcessStart : string;
  clientTimeAtProcessStart : number;
  trainAssignment : any;
  status:string;

  isPsngDataSyncIncomplete : boolean = false;
  isVacantBerthDataSyncIncomplete : boolean = false;
  isEFTMasterDataSyncIncomplete : boolean = false;

  constructor(public storage: StorageProvider, public backend : BackendProvider,public util : UtilProvider) {
    //this.logLocal('Hello DataSyncProvider Provider');
    this.storage.getTrainAssignment().then(data=>{
      this.trainAssignment = data;
      /* if(data){
        this.trainAssignment = JSON.parse(JSON.stringify(data));
        this.logLocal('-------------' + JSON.stringify(this.trainAssignment));
        this.logLocal(this.trainAssignment.TRAIN_ID );
      } */
    });
  }

  syncData(){
    return new Promise(resolve=>{
    this.logArray=new Array<string>();
    this.logLocal("SYNC started!!");

    this.clientTimeAtProcessStart=new Date().getTime();
    this.backend.getCurrentTime().then((res:any)=>{
      this.logLocal("got ServerTimeAtProcessStart at :"+this.getTimeInMili()/1000+" sec");
      if(res.CODE==200){
        this.isPsngDataSyncIncomplete = true;
        this.isVacantBerthDataSyncIncomplete = true;
        this.isEFTMasterDataSyncIncomplete = true;
        //this.isSecondaryCoachTime = true;

        //let data = this.util.convertIntoJson(res.TEXT);
        this.serverTimeAtProcessStart = res.data.resultSet[0].TIME;
        this.logLocal("ServerTimeAtProcessStart ==>"+this.serverTimeAtProcessStart);
        this.syncPassenger().then(res=>{
          this.logLocal("completed syncPassenger at :"+this.getTimeInMili()/1000+" sec");
          if(res){
            this.isPsngDataSyncIncomplete = false;
            this.updateLoadTime().then(res=>{
              if(res)resolve(true);
            });
          }
        });

        this.syncVacantberth().then(res=>{
          this.logLocal("completed syncVacantberth at :"+this.getTimeInMili()/1000+" sec");
          if(res){
            this.isVacantBerthDataSyncIncomplete = false;
            this.updateLoadTime().then(res=>{
              if(res)resolve(true);
            });
          }
        });

        this.syncEFTMaster().then(res=>{
          this.logLocal("completed syncVacantberth at :"+this.getTimeInMili()/1000+" sec");
          
          if(res){
            this.isEFTMasterDataSyncIncomplete = false;
            this.updateLoadTime().then(res=>{
              if(res)resolve(true);
            });
          }
        });

        /* this.syncCoachTime().then(res=>{
          this.isSecondaryCoachTime = false;
          this.updateLoadTime();
        }); */
      }else if(res.CODE==500){
        this.syncData();
      }else{
        alert('UNHANDLED EXCEPTION ' + JSON.stringify(res));
      }
    });
  });
  }

  syncPassenger(){
    //alert('syncPassenger');
    return new Promise(resolve=>{
      this.storage.getDirtyRecords('passenger').then((dirtyPsgn:any)=>{
        this.logLocal("got ["+dirtyPsgn.length+"] dirty psng in getDirtyRecords at :"+this.getTimeInMili()/1000+" sec");
        if(dirtyPsgn.length>0){
          this.postDirtyPassenger(dirtyPsgn).then(res=>{
            resolve(res);
          });
        }else{
          this.getDifferentialPassengers().then(res=>{
            resolve(res);
          });
        }
      });
    });
  }

  postDirtyPassenger(data){
    //alert('postDirtyPassenger');
    return new Promise(resolve=>{
      this.backend.postPassengerData(data).then((response:any)=>{
        if(response.CODE==200){
          this.storage.markClean('passenger',data).then(res=>{
            if(res){
              this.getDifferentialPassengers().then(res=>{
                resolve(res);
              });
            }else{
              resolve(false);
            }
          });
        }else if(response.CODE==500){
          this.postDirtyPassenger(data);
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  getDifferentialPassengers(){
    //alert('getDifferentialPassengers'+JSON.stringify(this.trainAssignment));
    return new Promise(resolve=>{
      this.backend.getDifferentialPassenger(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME,
      this.serverTimeAtProcessStart).then((response:any)=>{
        if(response.CODE==200){
          //let data = this.util.convertIntoJson(response.TEXT);
          console.log("getDifferentialPassenger");
          console.log(response);
          
          this.storage.addPassengers(response.data.resultSet).then(res=>{
            resolve(res);
          });
        }else if(response.CODE==500){
          this.getDifferentialPassengers();
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncVacantberth(){
    return new Promise(resolve=>{
      this.storage.getDirtyRecords('vacantberth').then((dirtyBerth:any)=>{
        console.log(dirtyBerth);
        
        this.logLocal("got ["+dirtyBerth.length+"] dirtyBerth in getDirtyRecords at :"+this.getTimeInMili()/1000+" sec");
        if(dirtyBerth.length>0){
          this.postDirtyBerth(dirtyBerth).then(res=>{
            resolve(res);
          });
        }else{
          this.getDifferentialBerth().then(res=>{
            resolve(res);
          });
        }
      });
    });
  }

  postDirtyBerth(data){
    //alert('post dirty berth ' + JSON.stringify(data));
    return new Promise(resolve=>{
      this.backend.postVacantberthData(data).then((response:any)=>{
        if(response.CODE==200){
          this.storage.markClean('vacantberth',data).then(res=>{
            if(res){
              this.getDifferentialBerth().then(res=>{
                resolve(res);
              });
            }else{
              resolve(false);
            }
          });
        }else if(response.CODE==500){
          this.postDirtyBerth(data);
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  getDifferentialBerth(){
    return new Promise(resolve=>{
      this.backend.getDifferentialVacantberth(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME,
      this.serverTimeAtProcessStart).then((response:any)=>{
        if(response.CODE==200){
          //let data = this.util.convertIntoJson(response.TEXT);
          this.storage.addVacantBerth(response.data.resultSet).then(res=>{
            resolve(res);
          });
        }else if(response.CODE==500){
          this.getDifferentialBerth();
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncEFTMaster(){
    return new Promise(resolve=>{
      this.storage.getDirtyRecords('eftMaster').then((dirtyEft:any)=>{
        if(dirtyEft>0){
          this.postDirtyEFT(dirtyEft).then(res=>{
            resolve(res);
          });
        }else{
          resolve(true);
        }
      });
    });
  }

  postDirtyEFT(data){
    return new Promise(resolve=>{
      this.backend.postEftmasterdata(data).then((response:any)=>{
        if(response.CODE==200){
          this.storage.markClean('eftMaster',data).then(res=>{
            resolve(res);
          });
        }else if(response.CODE==500){
          this.postDirtyEFT(data);
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  updateLoadTime(){
    return new Promise(resolve=>{
      if(this.isDataSyncComplete){
        this.logLocal("All complete at : "+this.getTimeInMili()/1000+" sec");
        this.trainAssignment.LOAD_TIME = this.serverTimeAtProcessStart;
        this.storage.replaceTrainAssignment(this.trainAssignment).then(res=>{
          resolve(res);
        });
      }else{
        resolve(false);
      }
    });
  }

getTimeInMili(){
  return new Date().getTime()-this.clientTimeAtProcessStart;
}
  
logLocal(msg:string){
  this.status=msg;
  this.logArray.push(msg);
  console.log(msg);
}
  //// getter & setters

  get isDataSyncComplete(){
    return !this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && !this.isVacantBerthDataSyncIncomplete;
  }

}
