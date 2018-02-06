import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { StorageServiceProvider } from '../storage-service/storage-service';
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
  statusLog:string;

 sync_time:any[]=[];
  dataSyncProcessRunning  : boolean = false;

  isPsngDataSyncIncomplete : boolean = false;
  isVacantBerthDataSyncIncomplete : boolean = false;
  isEFTMasterDataSyncIncomplete : boolean = false;


  //Sync Stats
  dirtyPsngCount : number;
  dirtyPsngSyncSuccessCount : number;
  dirtyPsngSyncFailureCount : number;
  differentialPsngDownloadedCount : number;
  
  //dirty Vacant Berth
  dirtyVacBerthCount: number;
  dirtyVacBerthSyncSuccessCount: number;
  dirtyVacSyncFailureCount : number;
  differentialVacDownloadedCount : number;
  
  //dirty EFT Berth
  dirtyEFTCount: number;
  dirtyEFTSyncSuccessCount: number;
  dirtyEFTSyncFailureCount : number;
  differentialEFTDownloadedCount : number;

  constructor(
   // public storage: StorageProvider,
    public storage:StorageServiceProvider,
     public backend : BackendProvider,
     public util : UtilProvider) {
    //this.logLocal('Hello DataSyncProvider Provider');
    /* this.storage.getTrainAssignment().then(data=>{
      this.trainAssignment = data;
    }); */
    console.log(this);
    
  }

  syncData(trainAssignmentObj){
    if(!this.dataSyncProcessRunning){
      let syncDataPromise= new Promise(resolve=>{
        this.dataSyncProcessRunning =true;
        this.trainAssignment = trainAssignmentObj;
        this.dirtyPsngCount =0;
        this.dirtyPsngSyncSuccessCount=0;
        this.dirtyPsngSyncFailureCount =0;
        this.differentialPsngDownloadedCount =0;
        this.logArray=new Array<string>();
        this.logLocal("SYNC started!!");
    
        this.clientTimeAtProcessStart=new Date().getTime();
        this.backend.getCurrentTime().then((res:any)=>{
          this.logLocal("got ServerTimeAtProcessStart at :"+this.getTimeInMili()/1000+" sec");
          if(res.CODE==200){
            this.serverTimeAtProcessStart = res.data.resultSet[0].TIME;
            this.logLocal("ServerTimeAtProcessStart ==>"+this.serverTimeAtProcessStart);
    
            ///Syncing Passenger
            this.syncPassenger().then(res=>{
              this.logLocal("completed syncPassenger at :"+this.getTimeInMili()/1000+" sec");
              this.sync_time.push(this.getTimeInMili()/1000+" sec");              
              this.updateLoadTime().then(res=>{
                if(res)resolve(true);
              });
              if(res){
                //this.isPsngDataSyncIncomplete = false;
                /* this.updateLoadTime().then(res=>{
                  if(res)resolve(true);
                }); */
              }else{
                alert("Passenger data Sync failed!!");
              }
            }).catch((e)=>{
              this.isPsngDataSyncIncomplete = false;
                this.updateLoadTime().then(res=>{
                  if(res)resolve(true);
                });
              alert("Passenger data Sync failed!! \n ERROR : "+JSON.stringify(e));
            });
    
            //Syncing Vacant Berth
            this.syncVacantberth().then(res=>{
              this.logLocal("completed syncVacantberth at :"+this.getTimeInMili()/1000+" sec");
                            this.sync_time.push(this.getTimeInMili()/1000+" sec");              

              //if(res){
                this.isVacantBerthDataSyncIncomplete = false;
                this.updateLoadTime().then(res=>{
                  if(res)resolve(true);
                });
              //}
            });
    
            //Syncing EFT 
            this.syncEFTMaster().then(res=>{
              this.logLocal("completed EFTMaster at :"+this.getTimeInMili()/1000+" sec");
                            this.sync_time.push(this.getTimeInMili()/1000+" sec");              

              //if(res){
                this.isEFTMasterDataSyncIncomplete = false;
                this.updateLoadTime().then(res=>{
                  if(res)resolve(true);
                });
              //}
            });
    
          }else{
            alert('UNHANDLED EXCEPTION ' + JSON.stringify(res));
            this.dataSyncProcessRunning = false;
          }
        });
      });
      syncDataPromise.then(()=>{this.dataSyncProcessRunning =false});
      return syncDataPromise;
    }else{
      return Promise.reject("Previous sync process running...");
    }
  }

  syncPassenger(){
    //alert('syncPassenger');
    return new Promise(resolve=>{
      this.isPsngDataSyncIncomplete = true;
      this.storage.getAllDirtyDocuments(this.storage.collectionName.PASSENGER_TABLE).then((dirtyPsgn:any)=>{
        this.logLocal("got ["+dirtyPsgn.length+"] dirty psng in getDirtyRecords at :"+this.getTimeInMili()/1000+" sec");
        this.dirtyPsngCount = dirtyPsgn.length;
        
        //alert("getAllDirtyDocuments=>"+JSON.stringify(dirtyPsgn));

        let isDirtyPsngDataSyncComplete = false;
        let isFetchAndSaveNewDifferentialPsngComplete = false;
        if(dirtyPsgn.length>0){
          this.postDirtyPassenger(dirtyPsgn).then(res=>{
            isDirtyPsngDataSyncComplete = true;
            this.isPsngDataSyncIncomplete = !(isFetchAndSaveNewDifferentialPsngComplete 
            && isDirtyPsngDataSyncComplete);
            if(!this.isPsngDataSyncIncomplete)resolve(res);
          });
        }else{
          isDirtyPsngDataSyncComplete = true;
        }
        //debugger;
        this.fetchAndSaveNewDifferentialPsng().then(res=>{
          isFetchAndSaveNewDifferentialPsngComplete = true;
          this.isPsngDataSyncIncomplete = !(isFetchAndSaveNewDifferentialPsngComplete 
          && isDirtyPsngDataSyncComplete);
          //debugger;
          if(!this.isPsngDataSyncIncomplete)resolve(res);
        });
      });
    });
  }

  postDirtyPassenger(data){
    //alert('postDirtyPassenger');
    return new Promise(resolve=>{
      this.backend.postPassengerData(data).then((response:any)=>{
        console.log(response);
        
        if(response.CODE==200){
          this.dirtyPsngSyncFailureCount=response.data.failedToSavedIds.length;
          this.dirtyPsngSyncSuccessCount=response.data.successfullSavedIds.length;
          //alert("before markClean=>"+JSON.stringify(data));
          this.storage.markClean('passenger',data).then(res=>{
                resolve(res);
          });
          resolve(true);
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  fetchAndSaveNewDifferentialPsng(){
    //alert('getDifferentialPassengers'+JSON.stringify(this.trainAssignment));
    return new Promise(resolve=>{
      this.backend.getDifferentialPassenger(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME,
      this.serverTimeAtProcessStart).then((response:any)=>{
        if(response.CODE==200){
          //let data = this.util.convertIntoJson(response.TEXT);
          console.log("getDifferentialPassenger");
          console.log(response);
          this.logLocal("got ["+response.data.resultSet.length+"]"+
           " DifferentialPassenger in fetchAndSaveNewDifferentialPsng at :"+this.getTimeInMili()/1000+" sec");
          this.differentialPsngDownloadedCount=response.data.resultSet.length;
          //debugger;
          this.storage.addOrReplace(this.storage.collectionName.PASSENGER_TABLE,
            response.data.resultSet,["PNR_NO","REL_POS"],true).then(res=>{
            console.log(res);
            resolve(res);
          });
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncVacantberth(){
    return new Promise(resolve=>{
      this.isVacantBerthDataSyncIncomplete = true;
      this.storage.getAllDirtyDocuments(this.storage.collectionName.VACANT_BERTH_TABLE).then((dirtyBerth:any)=>{
        console.log(dirtyBerth);
        this.dirtyVacBerthCount=dirtyBerth.length;
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
        this.logLocal("response vacantberth =>"+response.TEXT+" at :"+this.getTimeInMili()/1000+" sec");
        console.log(JSON.stringify(response));
        if(response.CODE==200){
          try {
             this.dirtyVacSyncFailureCount=response.data.failedToSavedIds.length;
             this.dirtyVacBerthSyncSuccessCount=response.data.successfullSavedIds.length;
            this.storage.markClean('vacantberth',data).then(res=>{
              if(res){
                this.getDifferentialBerth().then(res=>{
                  resolve(res);
                });
              }else{
                resolve(false);
              }
            });
          } catch (error) {
            alert('UNHANDLED EXCEPTION ' + JSON.stringify(error));
          }
          resolve(true);
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
        console.log(JSON.stringify(response));
        if(response.CODE==200){
          //let data = this.util.convertIntoJson(response.TEXT);
          this.storage.addOrReplace(this.storage.collectionName.VACANT_BERTH_TABLE,
            response.data.resultSet,["PNR_NO","REL_POS"],true).then(res=>{
            resolve(res);
          });
        }else{
          alert('UNHANDLED EXCEPTION ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncEFTMaster(){
    return new Promise(resolve=>{
      this.isEFTMasterDataSyncIncomplete = true;
      this.storage.getAllDirtyDocuments(this.storage.collectionName.EFT_MASTER_TABLE
      ).then((dirtyEft:any)=>{
         this.dirtyEFTCount=dirtyEft.length;

        this.logLocal("got ["+dirtyEft.length+"] dirtyEFT in syncEFTMaster at :"+this.getTimeInMili()/1000+" sec");
        if(dirtyEft.length>0){
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
        this.logLocal("response eft =>"+response.TEXT+" at :"+this.getTimeInMili()/1000+" sec");
        console.log(JSON.stringify(response));
        if(response.CODE==200){
          this.dirtyEFTSyncFailureCount=response.data.failedToSavedIds.length;
             this.dirtyEFTSyncSuccessCount=response.data.successfullSavedIds.length;
          this.storage.markClean('eftMaster',data).then(res=>{
            resolve(res);
          });
          resolve(true);
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
        this.trainAssignment.LAST_SYNCED = this.serverTimeAtProcessStart;
        let dbObj=[];
        dbObj["json"]=this.trainAssignment;
        dbObj["_id"]=1;
        this.storage.replace(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE,
          dbObj,true).then(res=>{
          console.log(this.trainAssignment);
          //resolve(res);
          if(!res)alert('Failed to update trainAssignment.LOAD_TIME');
          
          //added by Neeraj to update chart load info  
          this.backend.getChartLoadInfo(this.trainAssignment.TRAIN_ID).then((res:any)=>{
            this.storage.addOrReplace(this.storage.collectionName.CHART_LOAD_INFO,res.TEXT,['REMOTE_LOC']);
          });

          resolve(true);
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
  this.statusLog=msg;
  let currentDate = '[' + new Date().toLocaleString("en-US",{hour12:false}) + '] ';
  this.logArray.push(currentDate+msg);
  console.log(msg);
}
  //// getter & setters

  get isDataSyncComplete(){
    return !this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && !this.isVacantBerthDataSyncIncomplete;
  }

}
