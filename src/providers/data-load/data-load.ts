import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { StorageProvider } from '../../providers/storage/storage';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { LoggerProvider } from '../../providers/logger/logger';
import { Logs } from '../../entities/messages';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the DataLoadProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataLoadProvider {
  private trainAssignment : any;
  //private pogressObject : any;
  private savedChartCoachList : Array<any>;
  private savedVacantberthList : Array<any>;
  private progressval : number=0;
  private loadTime : any;
  private trainId : any;
  private loader : any;
  private coachArray : Array<any>;

  constructor(private storageProvider:StorageProvider, private backendProvider:BackendProvider, 
    private loggerProvider:LoggerProvider, private utilProvider:UtilProvider,
    private loadingController:LoadingController) {
    console.log('Hello DataLoadProvider Provider');
  }
  //savedChartCoachList, progressval, loader, isCorrupt
  loadChart(trainAssignment, pogressObject){
    this.loader = this.loadingController.create({
        content : 'Loading data from server!!'
    });
    
    console.log("trainAssignment");
    console.log(trainAssignment);
    console.log("pogressObject");
    console.log(pogressObject);

    this.loader.present();
    this.loadTime = trainAssignment.LOAD_TIME;
    this.trainId = trainAssignment.TRAIN_ID;
    this.coachArray = trainAssignment.ASSIGNED_COACHES;
    /**/
    this.savedChartCoachList = new Array<any>();
    this.savedVacantberthList = new Array<any>();
    this.loadPassenger();
    this.loadVacantBerth();
    this.loadEFTMaster();
    this.loadDynamicFare();
    this.loadDropEticketPassenger();
  }

  loadPassenger(){
    this.coachArray.forEach((coachId) => {
      this.storageProvider.getPassengerCount({COACH_ID : coachId},{exact : true}).then(count=>{
        if(count==0){
          this.backendProvider.getPassenger(this.trainId, coachId, this.loadTime).then((response:any)=>{
            if(response.CODE==200){
              let data = this.utilProvider.convertIntoJson(response.TEXT);
              this.savedChartCoachList.push({key:coachId,value:data.resultSet});
              this.progressval = (this.savedChartCoachList.length+1)*100/this.coachArray.length;
              if(this.coachArray.length==this.savedChartCoachList.length){
                var passengerArray = this.savedChartCoachList.reduce((array, object)=>{
                  console.log(object);
                  return array.concat(object.value);
                },[]);
                this.storageProvider.addPassengers(passengerArray).then(success=>{
                  if(success){
                    //this.loader.dismiss();
                    this.loadWaitlist();
                  }else{
                    this.loader.dismiss();
                    this.loggerProvider.logErrorLogs(Logs.passenger_load_failure_json);
                  }
                });
              }
            }else if(response.CODE==500){
              this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadPassenger in ' + coachId);
              this.loadPassenger();
            }else{
              this.loader.dismiss();
              this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
            }
          },failure=>{
            this.loggerProvider.logErrorLogs(Logs.passenger_failure);
          });
        }
      });
    });
  }

  loadWaitlist(){
    this.storageProvider.getWaitlistCount({BERTH_NO:'-1'},{exact : true}).then(count=>{
      if(count==0){
        this.backendProvider.getWaitlist(this.trainId, this.loadTime).then((response:any)=>{
          if(response.CODE==200){
            this.storageProvider.putWaitListPassenger(response.TEXT.resultSet).then(success=>{
              this.savedChartCoachList.push({key:"W/L",value:response.TEXT.resultSet});
              console.log(this.savedChartCoachList);
              this.loader.dismiss();
            });
          }else if(response.CODE==500){
            this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadWaitlist ');
            this.loadWaitlist();
          }else{
            this.loader.dismiss();
            this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
          }
        },failure=>{
          this.loggerProvider.logErrorLogs(Logs.waitlist_failure);
        });
      }
    });
  }

  loadVacantBerth(){
    this.coachArray.forEach(coachId=>{
      this.storageProvider.getVacantBerthCount({COACH_ID : coachId},{exact : true}).then(count=>{
        if(count==0){
          this.backendProvider.getVacantBerth(this.trainId, coachId, this.loadTime).then((response:any)=>{
            if(response.CODE==200){
              let data = this.utilProvider.convertIntoJson(response.TEXT);
              //this.savedVacantberthList.push({key:coachId,value:data.resultSet});
              this.savedVacantberthList.push(data.resultSet);
              if(this.coachArray.length==this.savedVacantberthList.length){
                this.storageProvider.addVacantBerth(this.savedVacantberthList).then(success=>{
                  if(!success){
                    this.loggerProvider.logErrorLogs(Logs.vacantberth_load_failure_json);
                  }
                });
              }
            }else if(response.CODE==500){
              this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadVacantBerth in ' + coachId);
              this.loadVacantBerth();
            }else{
              this.loader.dismiss();
              this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
            }
          },failure=>{
            this.loggerProvider.logErrorLogs(Logs.vacantberth_failure);
          });
        }
      });
    });
  }

  loadEFTMaster(){
    this.storageProvider.getEftMasterCount().then(count=>{
      if(count==0){
        this.backendProvider.getEFTDetails(this.trainId).then((response :any)=>{
          if(response.CODE==200){
            let data = this.utilProvider.convertIntoJson(response.TEXT);
            this.storageProvider.addEftMaster(data.resultSet).then(success=>{
              if(!success){
                this.loggerProvider.logErrorLogs(Logs.eftmaster_load_failure_json);
              }
            });
          }else if(response.CODE==500){
            this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadEFTMaster ');
            this.loadEFTMaster();
          }else{
            this.loader.dismiss();
            this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
          }
        },failure=>{
          this.loggerProvider.logErrorLogs(Logs.eftmaster_failure);
        });
      }
    });
  }

  loadDynamicFare(){
    this.storageProvider.getDynamicFareCount().then(count=>{
      if(count==0){
        this.backendProvider.getDynamicFare(this.trainId).then((response:any)=>{
          if(response.CODE==200){
            let data = this.utilProvider.convertIntoJson(response.TEXT);
            this.storageProvider.addDynamicFare(data.resultSet).then((success)=>{
              if(!success){
                this.loggerProvider.logErrorLogs(Logs.dynamicfare_load_failure_json);
              }
            });
          }else if(response.CODE==500){
            this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadDynamicFare ');
            this.loadDynamicFare();
          }else{
            this.loader.dismiss();
            this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
          }
        },failure=>{
          this.loggerProvider.logErrorLogs(Logs.dynamicfare_failure);
        });
      }
    });
  }

  loadDropEticketPassenger(){
    this.storageProvider.getDroppedEticketPassengerCount().then(count=>{
      if(count==0){
        this.backendProvider.loaddroppedETickets(this.trainId).then((response:any)=>{
          if(response.CODE==200){
            let data = this.utilProvider.convertIntoJson(response.TEXT);
            this.storageProvider.addDroppedEticketPassenger(data.resultSet).then((success)=>{
              if(!success){
                this.loggerProvider.logErrorLogs(Logs.dropeticket_load_failure_json);
              }
            });
          }else if(response.CODE==500){
            this.loggerProvider.logErrorLogs(Logs.network_lost + ' loadDynamicFare ');
            this.loadDropEticketPassenger();
          }else{
            this.loader.dismiss();
            this.loggerProvider.logErrorLogs(Logs.unexpected_error + ' : ' + response.CODE);
          }
        },failure=>{
          this.loggerProvider.logErrorLogs(Logs.dropeticket_failure);
        });
      }
    });
  }

}
