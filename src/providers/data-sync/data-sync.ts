import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { StorageServiceProvider } from '../storage-service/storage-service';
import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";

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
  syncMaster = {
    PSGN_SYNCED : true,
    BERTH_SYNCED : true,
    EFT_SYNCED : true,
    FARE_SYNCED : true,
    DIFFERENTIAL_WL_SYNCED : true,
    FOREIGN_WL_SYNCED : true,
  };

  isPsngDataSyncIncomplete : boolean = false;
  isVacantBerthDataSyncIncomplete : boolean = false;
  isEFTMasterDataSyncIncomplete : boolean = false;
  isDynamicFarerDataSyncIncomplete : boolean = false;
  isForeignWaitlistDataSyncIncomplete : boolean = false;
  isDifferentialWaitlistDataSyncIncomplete : boolean = false;

  //Sync Stats
  dirtyPsngCount : number;
  dirtyPsngSyncSuccessCount : number;
  dirtyPsngSyncFailureCount : number;
  differentialPsngDownloadedCount : number;
  
  //dirty Vacant Berth
  dirtyVacBerthCount: number;
  dirtyVacBerthSyncSuccessCount: number;
  dirtyVacBerthSyncFailureCount : number;
  differentialVacBerthDownloadedCount : number;
  
  //dirty EFT Berth
  dirtyEFTCount: number;
  dirtyEFTSyncSuccessCount: number;
  dirtyEFTSyncFailureCount : number;
  differentialEFTDownloadedCount : number;

  constructor(
    public pdsp:PsngDataServiceProvider,
    public storage:StorageServiceProvider,
    public backend : BackendProvider,
    public util : UtilProvider) {
    
  }

  syncData(trainAssignmentObj){
    if(!this.dataSyncProcessRunning){
      let syncDataPromise = new Promise(resolve=>{
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
              if(res){
                this.logLocal("completed syncPassenger at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
                /* if(!this.trainAssignment.TS_FLAG){
                  this.SyncForeignWaitlist().then(resWL=>{
                    if(resWL){
                      this.updateLoadTime().then(res=>{if(res)resolve(true);});
                    }else{
                      this.isForeignWaitlistDataSyncIncomplete = false;
                      this.updateLoadTime().then(res=>{if(res)resolve(true);});
                      alert("Foreign waitlist Sync failed!!" + JSON.stringify(resWL));
                    }
                  });
                }else{
                  this.updateLoadTime().then(res=>{if(res)resolve(true);});
                } */
              }else{
                this.isPsngDataSyncIncomplete = false;
                /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("Passenger data Sync failed!!"+JSON.stringify(res));
              }
            }).catch((e)=>{
              this.isPsngDataSyncIncomplete = false;
              /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("Passenger data Sync failed!! \n ERROR : "+JSON.stringify(e));
            });
    
            //Syncing Vacant Berth
            this.syncVacantberth().then(res=>{
              if(res){
                this.logLocal("completed syncVacantberth at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
              }else{
                this.isVacantBerthDataSyncIncomplete = false;
                /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("Vacantberth data Sync failed!!"+JSON.stringify(res));
              }
            }).catch(e=>{
               //this.dataSyncProcessRunning = false;
              this.isVacantBerthDataSyncIncomplete = false;
              /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("Vacantberth Sync failed!! \n ERROR : "+JSON.stringify(e));
            });
    
            //Syncing EFT 
            this.syncEFTMaster().then(res=>{
              if(res){
                this.logLocal("completed EFTMaster at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
              }else{
                this.isEFTMasterDataSyncIncomplete = false;
                /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("EFT Master Sync failed!! \n ERROR : "+JSON.stringify(res));
              }
            }).catch(e=>{
              //this.dataSyncProcessRunning = false;
              this.isEFTMasterDataSyncIncomplete = false;
              /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("EFT Master Sync failed!! \n ERROR : "+JSON.stringify(e));
            });

            //Syncing Fare 
            this.syncDynamicFare().then(res=>{
              if(res){
                this.logLocal("completed Dynamic_Fare at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
              }else{
                this.isDynamicFarerDataSyncIncomplete = false;
                /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("DynamicFare Sync failed!! \n ERROR : "+JSON.stringify(res));
              }
            }).catch(e=>{
              //this.dataSyncProcessRunning = false;
              this.isDynamicFarerDataSyncIncomplete = false;
              /* this.updateLoadTime().then(res=>{if(res)resolve(true);}); */
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("Dynamic Fare data Sync failed!! \n ERROR : "+JSON.stringify(e));
            });

            this.syncDifferentialWaitlist().then(res=>{
              if(res){
                this.logLocal("completed Differential Waitlist at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
              }else{
                this.isDifferentialWaitlistDataSyncIncomplete = false;
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("Differential Waitlist data Sync failed!! \n ERROR : "+JSON.stringify(res));
              }
            }).catch(e=>{
              this.isDifferentialWaitlistDataSyncIncomplete = false;
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("Differential Waitlist data Sync failed!! \n ERROR : "+JSON.stringify(e));
            });

            this.SyncForeignWaitlist().then(res=>{
              if(res){
                this.logLocal("completed Foreign Waitlist at :"+this.getTimeInMili()/1000+" sec");
                this.sync_time.push(this.getTimeInMili()/1000+" sec");
                this.updateLoadTime().then(res=>{if(res)resolve(true);});
              }else{
                this.isForeignWaitlistDataSyncIncomplete = false;
                this.syncMaster.FOREIGN_WL_SYNCED = false;
                this.updateLoadTime().then(res=>{if(res)resolve(false);});
                alert("Foreign Waitlist data Sync failed!! \n ERROR : "+JSON.stringify(res));
              }
            }).catch(e=>{
              this.isForeignWaitlistDataSyncIncomplete = false;
              this.updateLoadTime().then(res=>{if(res)resolve(false);});
              alert("Foreign Waitlist data Sync failed!! \n ERROR : "+JSON.stringify(e));
            });

          }else{
            alert('SYNC_EXCEPTION BACKEND.GET_CURRENTTIME ' + JSON.stringify(res));
            this.dataSyncProcessRunning = false;
          }
        });
      });
      syncDataPromise.then(()=>{
        this.dataSyncProcessRunning = false;
      });
      return syncDataPromise;
    }else{
      return Promise.reject("Previous sync process running...");
    }
  }

  syncPassenger(){
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
    try{
      return new Promise(resolve=>{
        this.backend.postPassengerData(data).then((response:any)=>{
      //    console.log(response);
          
          if(response.CODE==200){
            this.dirtyPsngSyncFailureCount=response.data.failedToSavedIds.length;
            this.dirtyPsngSyncSuccessCount=response.data.successfullSavedIds.length;
         //   alert("Id is :: "+response.data.successfullSavedIds);
            var clearData = [];
            response.data.successfullSavedIds.forEach(id => {
              data.find((element)=>{
                if(element._id==id){
                  clearData.push(element);
                }
              });
            });
            //alert("before markClean=>"+JSON.stringify(data));
            /* this.storage.markClean('passenger',data).then(res=>{ */
            this.storage.markClean('passenger',clearData).then(res=>{
              resolve(res);
            });
            resolve(true);
          }else{
            alert('UNEXCEPTED_EXCEPTION postDirtyPassenger : ' + JSON.stringify(response));
            resolve(false);
          }
        });
      });
    }catch(e){
      alert('sync_exception_caught postDirtyPassenger : ' + e);
    }
  }

  /* fetchAndSaveNewDifferentialPsng(){
    //alert('getDifferentialPassengers'+JSON.stringify(this.trainAssignment));
    return new Promise(resolve=>{
      let coachList = this.trainAssignment.TS_FLAG?this.trainAssignment.TOTAL_COACH : this.trainAssignment.ASSIGNED_COACHES
      coachList.push("W/L");
      this.backend.getDifferentialPassenger(this.trainAssignment.TRAIN_ID, coachList, 
        this.trainAssignment.LOAD_TIME, this.serverTimeAtProcessStart).then((response:any)=>{
        alert("DIFF PSGN RESPONSE " + JSON.stringify(response));
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
        //      alert("DIFF PSGN ADD REPLACE RESPONSE"+JSON.stringify(res));
            console.log(res);
            resolve(res);
          });
        }else{
          alert('UNEXCEPTED_EXCEPTION fetchAndSaveNewDifferentialPsng : ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  } */

  fetchAndSaveNewDifferentialPsng(){
    //alert('getDifferentialPassengers'+JSON.stringify(this.trainAssignment));
    return new Promise(resolve=>{ 
      let coachList = this.trainAssignment.TS_FLAG?this.trainAssignment.TOTAL_COACHES : this.trainAssignment.ASSIGNED_COACHES;
      coachList.push("W/L");
      //alert(JSON.stringify(coachList));
      this.backend.getDifferentialPassenger(this.trainAssignment.TRAIN_ID, coachList, 
        this.trainAssignment.LOAD_TIME, this.serverTimeAtProcessStart).then((response:any)=>{
        
        if(response.status==200){
          //let data = this.util.convertIntoJson(response.TEXT);
          //alert('FETCH DIFF PSGN BKEND RESPONSE ' + JSON.stringify(response.responseJSON));
         /*  console.log("getDifferentialPassenger");
          console.log(response); */
          this.logLocal("got ["+response.responseJSON.length+"]"+
           " DifferentialPassenger in fetchAndSaveNewDifferentialPsng at :"+this.getTimeInMili()/1000+" sec");
          this.differentialPsngDownloadedCount=response.responseJSON.length;
          //debugger;
          this.storage.addOrReplace(this.storage.collectionName.PASSENGER_TABLE,
            response.responseJSON,["PNR_NO","REL_POS"],true).then(res=>{
        //      alert("DIFF PSGN ADD REPLACE RESPONSE"+JSON.stringify(res));
            console.log(res);
            resolve(res);
          });
        }else{
          alert('UNEXCEPTED_EXCEPTION fetchAndSaveNewDifferentialPsng : ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncVacantberth(){
    return new Promise(resolve=>{
      this.isVacantBerthDataSyncIncomplete = true;
      this.storage.getAllDirtyDocuments(this.storage.collectionName.VACANT_BERTH_TABLE).then((dirtyBerth:any)=>{
        this.logLocal("got ["+dirtyBerth.length+"] dirtyBerth in getDirtyRecords at :"+this.getTimeInMili()/1000+" sec");
        this.dirtyVacBerthCount = dirtyBerth.length;
        
        let isDirtyVacantberthDataSyncComplete = false;
        let isFetchAndSaveNewDifferentialVacantberthComplete = false;

        if(dirtyBerth.length>0){
          this.postDirtyBerth(dirtyBerth).then(res=>{
            isDirtyVacantberthDataSyncComplete = true;
            this.isVacantBerthDataSyncIncomplete = !(isDirtyVacantberthDataSyncComplete && isFetchAndSaveNewDifferentialVacantberthComplete);
            if(!this.isVacantBerthDataSyncIncomplete)resolve(res);
          });
        }else{
          isDirtyVacantberthDataSyncComplete = true;
        }

        this.fetchAndSaveNewDifferentialVacantberth().then(res=>{
          isFetchAndSaveNewDifferentialVacantberthComplete = true;
          this.isVacantBerthDataSyncIncomplete = !(isDirtyVacantberthDataSyncComplete && isFetchAndSaveNewDifferentialVacantberthComplete);
          if(!this.isVacantBerthDataSyncIncomplete)resolve(res);
        });
      });
    });
  }

  postDirtyBerth(data){
    return new Promise(resolve=>{
      this.backend.postVacantberthData(data).then((response:any)=>{
        if(response.CODE==200){
          this.dirtyVacBerthSyncFailureCount = response.data.failedToSavedIds.length;
          this.dirtyVacBerthSyncSuccessCount = response.data.successfullSavedIds.length;
       //   alert("Id is :: "+response.data.successfullSavedIds);

          var clearData = [];
            response.data.successfullSavedIds.forEach(id => {
              data.find((element)=>{
                if(element._id==id){
                  clearData.push(element);
                }
              });
            });
          this.storage.markClean('vacantberth',data).then(res=>{
            resolve(res);
          });
        }else{
          alert('UNEXPECTED_EXCEPTION postDirtyBerth : ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  fetchAndSaveNewDifferentialVacantberth(){
    return new Promise(resolve=>{
      this.backend.getDifferentialVacantberth(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME,
        this.serverTimeAtProcessStart).then((response:any)=>{
          if(response.CODE==200){
            this.logLocal("got ["+response.data.resultSet.length+"]"+
            " DifferentialVacantberth in fetchAndSaveNewDifferentialVacantberth at :"+this.getTimeInMili()/1000+" sec");
            this.differentialVacBerthDownloadedCount = response.data.resultSet.length;
            this.storage.addOrReplace(this.storage.collectionName.VACANT_BERTH_TABLE,
              response.data.resultSet,["COACH_ID","BERTH_INDEX","SRC","DEST"],true).then(res=>{
              console.log(res);
              resolve(res);
            });
          }else{
            alert('UNEXCEPTED_EXCEPTION fetchAndSaveNewDifferentialVacantberth : ' + JSON.stringify(response));
            resolve(false);
          }
        });
    });
  }

  syncEFTMaster(){
    return new Promise(resolve=>{
      this.isEFTMasterDataSyncIncomplete = true;
      this.storage.getAllDirtyDocuments(this.storage.collectionName.EFT_MASTER_TABLE).then((dirtyEFT:any)=>{
        this.logLocal("got ["+dirtyEFT.length+"] dirty eft in getDirtyRecords at :"+this.getTimeInMili()/1000+" sec");
        this.dirtyEFTCount = dirtyEFT.length;

        let isDirtyEftDataSyncComplete = false;
        if(dirtyEFT.length>0){
          this.postDirtyEFT(dirtyEFT).then(res=>{
            this.isEFTMasterDataSyncIncomplete = false;
            resolve(true);
          });
        }else{
          this.isEFTMasterDataSyncIncomplete = false;
          resolve(true);
        }
      });
    });
  }

  postDirtyEFT(data){
    return new Promise(resolve=>{
      this.backend.postEftmasterdata(data).then((response:any)=>{
        if(response.CODE==200){
          this.dirtyEFTSyncFailureCount = response.data.failedToSavedIds.length;
          this.dirtyEFTSyncSuccessCount = response.data.successfullSavedIds.length;
          //alert("Id is :: "+response.data.successfullSavedIds);

          var clearData = [];
            response.data.successfullSavedIds.forEach(id => {
              data.find((element)=>{
                if(element._id==id){
                  clearData.push(element);
                }
              });
            });
          this.storage.markClean('eftMaster',data).then(res=>{
            resolve(res);
          });
          resolve(true);
        }else{
          alert('UNEXCEPTED_EXCEPTION postDirtyEFT : ' + JSON.stringify(response));
          resolve(false);
        }
      });
    });
  }

  syncDynamicFare(){
    return new Promise(resolve=>{
      this.isDynamicFarerDataSyncIncomplete = true;
      this.backend.getDifferentialDynamicFare(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME,
        this.serverTimeAtProcessStart).then((response:any)=>{
          if(response.status==200){
            this.storage.addOrReplace(this.storage.collectionName.DYNAMIC_FARE_TABLE,response.responseJSON.resultSet,
              ["FROM_STN","TO_STN"],true).then(response=>{
                if(response)this.isDynamicFarerDataSyncIncomplete = false;
                resolve(response);
              });
          }else if(response.status==0 || response.status==-1){
            alert("BACKEND_ERROR (SYNC_DYNAMIC_FARE) : " + response.errorMsg);
            resolve(false);
          }else{
            alert('UNEXPECTED_ERROR (SYNC_DYNAMIC_FARE) : ' + JSON.stringify(response));
            resolve(false);
          }
        });
    });
  }

  syncDifferentialWaitlist(){
    return new Promise(resolve=>{
      this.isDifferentialWaitlistDataSyncIncomplete = true;
      this.backend.getDifferentialWaitList(this.trainAssignment.TRAIN_ID, 
        this.trainAssignment.LOAD_TIME, this.serverTimeAtProcessStart).then((response:any)=>{
          /* alert(' syncDifferentialWaitlist BKEND12 ' + JSON.stringify(response));
          alert(' syncDifferentialWaitlist BKEND ' + JSON.stringify(response.responseJSON.resultSet)); */
          if(response.status==200){
            this.storage.addOrReplace(this.storage.collectionName.PASSENGER_TABLE,
              response.responseJSON.resultSet,["PNR_NO","REL_POS"],true).then(res=>{
                /* alert('syncDifferentialWaitlist add replace : ' + res); */
                if(response)this.isDifferentialWaitlistDataSyncIncomplete = false;
                resolve(response);
              });
          }else if(response.status==0 || response.status==-1){
            alert("WARNING : SYNC_DIFFERENTIAL_WL_BACKEND_ERROR : " + response.errorMsg);
            resolve(false);
          }else{
            alert('WARNING : UNEXPECTED_SYNC_DIFFERENTIAL_WL_ERROR : '+ JSON.stringify(response));
            resolve(false);
          }
        });
    });
  }

  SyncForeignWaitlist(){
    return new Promise(resolve=>{
      this.isForeignWaitlistDataSyncIncomplete = true;
      this.backend.getDifferentialForeignWaitList(this.trainAssignment.TRAIN_ID, 
        this.trainAssignment.FOREIGN_COACHES, this.trainAssignment.LOAD_TIME, this.serverTimeAtProcessStart)
      .then((response:any)=>{
        //alert('SyncForeignWaitlist' + JSON.stringify(response.responseJSON));
        if(response.status==200){
          this.storage.addOrReplace(this.storage.collectionName.PASSENGER_TABLE, response.responseJSON,
            ["PNR_NO","REL_POS"], true).then(response=>{
              if(response)this.isForeignWaitlistDataSyncIncomplete = false;
                resolve(response);
          });
        }else{
          if(response.status==0 || response.status==-1){
            alert("BACKEND_ERROR (SYNC_FOREIGN_WAITLIST) : " + response.errorMsg);
            resolve(false);
          }else{
            alert("UNEXPECTED_ERROR (SYNC_FOREIGN_WAITLIST) : " + JSON.stringify(response));
            resolve(false);
          }
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

          /* if(res){
            this.pdsp.findAll(true).subscribe(data => {
              // console.log(data);
              alert('subscribed in ChartComponent');
               this.savedChartCoachList = data.coachwiseChartData;
             });
          } */
          
          //added by Neeraj to update chart load info  
          this.backend.getChartLoadInfo(this.trainAssignment.TRAIN_ID).then((res:any)=>{
            this.storage.addOrReplace(this.storage.collectionName.CHART_LOAD_INFO,res.responseJSON,['REMOTE_LOC']);
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
    /* return !this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && 
    !this.isVacantBerthDataSyncIncomplete && !this.isDynamicFarerDataSyncIncomplete &&
    !this.isForeignWaitlistDataSyncIncomplete; */
    /* if(!this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && 
    !this.isVacantBerthDataSyncIncomplete && !this.isDynamicFarerDataSyncIncomplete){
      this.pdsp.findAll(true).subscribe
    } */
    /* return !this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && 
    !this.isVacantBerthDataSyncIncomplete && !this.isDynamicFarerDataSyncIncomplete &&
    !this.isDifferentialWaitlistDataSyncIncomplete; */

    return !this.isEFTMasterDataSyncIncomplete && !this.isPsngDataSyncIncomplete && 
    !this.isVacantBerthDataSyncIncomplete && !this.isDynamicFarerDataSyncIncomplete &&
    !this.isDifferentialWaitlistDataSyncIncomplete && !this.isForeignWaitlistDataSyncIncomplete;
  }

}
