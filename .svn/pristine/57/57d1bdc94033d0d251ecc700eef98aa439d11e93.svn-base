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
  currentTime : string;
  trainAssignment : any;

  isSecondaryPassenger : boolean = false;
  isSecondaryVacantberth : boolean = false;
  isSecondaryEFTMaster : boolean = false;
  isSecondaryCoachTime : boolean = false;

  constructor(public storage: StorageProvider, public backend : BackendProvider,public util : UtilProvider) {
    console.log('Hello DataSyncProvider Provider');
    this.storage.getTrainAssignment().then(data=>{
      if(data){
        this.trainAssignment = JSON.parse(JSON.stringify(data));
        console.log('-------------' + JSON.stringify(this.trainAssignment));
        console.log(this.trainAssignment.TRAIN_ID );
      }
    });
  }

  syncData(){
    this.backend.getCurrentTime().then((res:any)=>{
      if(res.CODE==200){
        this.isSecondaryPassenger = true;
        this.isSecondaryVacantberth = true;
        this.isSecondaryEFTMaster = true;
        this.isSecondaryCoachTime = true;

        let data = this.util.convertIntoJson(res.TEXT);
        this.currentTime = data.resultSet[0].TIME;

        this.syncPassenger().then(res=>{
          if(res){
            this.isSecondaryPassenger = false;
            this.updateLoadTime();
          }
        });

        this.syncVacantberth().then(res=>{
          if(res){
            this.isSecondaryVacantberth = false;
            this.updateLoadTime();
          }
        });

        this.syncEFTMaster().then(res=>{
          if(res){
            this.isSecondaryEFTMaster = false;
            this.updateLoadTime();
          }
        });

        this.syncCoachTime().then(res=>{
          this.isSecondaryCoachTime = false;
          this.updateLoadTime();
        });
      }else if(res.CODE==500){
        this.syncData();
      }else{
        alert('UNHANDLED EXCEPTION ' + JSON.stringify(res));
      }
    });
  }

  syncPassenger(){
    //alert('syncPassenger');
    return new Promise(resolve=>{
      this.storage.getDirtyRecords('passenger').then((dirtyPsgn:any)=>{
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
      this.currentTime).then((response:any)=>{
        if(response.CODE==200){
          let data = this.util.convertIntoJson(response.TEXT);
          this.storage.addPassengers(data.resultSet).then(res=>{
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
      this.currentTime).then((response:any)=>{
        if(response.CODE==200){
          let data = this.util.convertIntoJson(response.TEXT);
          this.storage.addVacantBerth(data.resultSet).then(res=>{
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

  syncCoachTime(){
    return new Promise(resolve=>{
      this.storage.getDirtyRecords('coachTime').then((dirtyCoachTime)=>{
        if(dirtyCoachTime>0){
          this.postDirtyCoachTime(dirtyCoachTime).then(res=>{
            resolve(true);
          });
        }else{
          resolve(true);
        }
      });
    });
  } 
  
  postDirtyCoachTime(data){
    return new Promise(resolve=>{
      this.backend.postCoachtimedata(data).then((response:any)=>{
        if(response.CODE==200){
          this.storage.markClean('coachTime',data).then(res=>{
            resolve(res);
          });
        }else if(response.CODE==500){
          this.postDirtyCoachTime(data);
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  updateLoadTime(){
    return new Promise(resolve=>{
      if(!this.isSecondaryCoachTime && !this.isSecondaryEFTMaster && !this.isSecondaryPassenger && !this.isSecondaryVacantberth){
        this.trainAssignment.LOAD_TIME = this.currentTime;
        this.storage.replaceTrainAssignment(this.trainAssignment).then(res=>{
          resolve(res);
        });
      }else{
        resolve(false);
      }
    });
  }

}
