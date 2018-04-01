import { Component } from '@angular/core';
//import { IonicPage, NavController, NavParams,ViewController , MenuController , LoadingController ,AlertController} from 'ionic-angular';
import { NavController, NavParams, ViewController, MenuController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import {
  CoachDetails, CoachTime, DropEticketPassenger, DynamicFare, EftMaster, IsldtlTable,
  VacantBerth, Passenger, NewCoaches
} from '../../entities/map';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { Logs } from '../../entities/messages';
import { CoachwiseChartViewPage } from '../coachwise-chart-view/coachwise-chart-view';

import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
import { DataSyncProvider } from "../../providers/data-sync/data-sync";
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { Network } from '@ionic-native/network';

declare var WL;

///@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  appVer:any;
  trainAssignment: any;
  loader : any;
  dataleft: boolean;
  isNetworkAvailable: boolean;
  noChart: boolean = false;
  noCoach: boolean;
  username: string;
  chartDate: string;
  loadChartDate: Date = new Date();
  isChartLoadComplete: boolean = false;
  progressval: number = 0;
  savedChartCoachList: Array<any>;
  chartLoadInfo: any;

  isBerthLoadComplete: boolean = false;
  isDropEtktComplete: boolean = false;
  isDynamicFareComplete: boolean = false;
  isEFTMasterComplete: boolean = false;
  isChartLoadInfoComplete: boolean = false;

  syncColor;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController, 
    private menuCtrl: MenuController,
    private network: Network,
    //private storage: StorageProvider, 
    public storage:StorageServiceProvider,
    private loading: LoadingController,
    private alert: AlertController, 
    private logger: LoggerProvider,
    private backend: BackendProvider, 
    private util: UtilProvider,
    private pdsp: PsngDataServiceProvider, 
    public toastCtrl: ToastController,
    public syncProvider: DataSyncProvider) {

    this.menuCtrl.get('menu1').enable(false);
    this.menuCtrl.get('menu2').enable(true);
    this.isNetworkAvailable='none'!=this.network.type;
    this.appVer=util.getAppVersion();
  }

  ionViewDidEnter(){
    var arr = [];
    this.storage.getDocuments(this.storage.collectionName.CHART_LOAD_INFO).then((result:any)=>{
      result.forEach(val=>{
        var obj = val.json;
        arr.push(obj);
      });
      this.chartLoadInfo = arr;
    });

    this.pdsp.syncStatus.then(res=>{
      this.syncColor = res;
    });
  }

  ionViewDidLoad() {
    this.storage.getDocuments(
      this.storage.collectionName.TRAIN_ASSNGMNT_TABLE
    ).then(result => {
      this.trainAssignment = result[0].json;
      this.username = this.trainAssignment.USER_ID;
    });

    this.pdsp.findAll().subscribe(data => {
     // console.log(data);
      this.savedChartCoachList = data.coachwiseChartData;
    });

  }

  continue() {
    //if(!this.noChart){
    //// this.navCtrl.setRoot(CoachwiseChartViewPage, {username : this.username , TRAIN_NO : this.trainN, chartLoadDate : this.chartDate});
    this.goToCoachwiseChartViewPage();
    // }else{
    //this.alertToast(Logs.CHART_NOT_LOADED);
    //}
  }

  goToChart() {
    /* const loader = this.loading.create({
        content : 'Loading data offline'
    });
    loader.present(); */
    //this.addCoaches(loader);
    this.loadChart();
  }

  alertToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  confirmAlert() {
    console.log('************************************ Confirm Alert');
    let alert = this.alert.create({
      title: 'Confirm New Duty',
      message: 'Do you want to switch to new Duty or fresh copy of current one ? Doing this would clean all unsynced changes. It is suggested to sync your work before doing this. ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
           // console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
           // console.log('Yes clicked');
            this.clearChart().then(response => {
              if (response) {
                //this.trainAssignment=false;
                this.noChart = true;
                this.refreshTrainAssignmentFromBackend().then(done => {
                 // console.log(this.trainAssignment);
                  if (done && this.trainAssignment) {
                    this.loadChart();
                  } else {
                    this.alertToast("refreshTrainAssignmentFromBackend Failed!!");
                  }
                });
              } else {
                this.alertToast("Could not clear loacl data!!");
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
  goToCoachwiseChartViewPage() {
    // if(this.isChartLoadComplete){
    this.navCtrl.push(CoachwiseChartViewPage, {});
    // }else{
    //   this.alertToast(Logs.CHART_NOT_LOADED);
    //  }
  }
  /// New Code 

  loadChart() {
    this.syncColor = "light";
    let logger = WL.Logger.create({pkg: 'HHT_CORDOVA',maxFileSize : 150000});
    //analytics,debug,error,fatal,info,log,trace,warn
    logger.error('DEBUG LOG ');
    console.log("************************ logger *******************************");
    console.log(logger);
    this.loader = this.loading.create({
      content: 'Loading data from server!!'
    });
   this.loader.present();
    if (this.trainAssignment) {
      this.loadPassenger();
      /* this.loadForeignWaitlist(); */
      /* Since we can't call loadPassenger and loadForeignWaitlist parallely due to API limitation 
      I've called it after all the passengers have suceessfully been loaded */

      this.loadDropEticketPassenger();
      this.loadDynamicFare();
      this.loadEFTMaster();
      this.loadVacantberth();
      this.loadChartLoadInfo();
      this.loader.dismiss();
    } else {
      this.alertToast("No Train Assigned!! Could not download chart.");
    }
  }

  clearChartData() {
    this.clearChart().then((resp) => {
      this.alertToast("All data cleared !!");
    });
  }

  clearChart() {
    //alert('clear chart');
    this.chartLoadInfo=[];
    return new Promise(resolve => {
      this.storage.clearAll().then(() => {
        this.pdsp.clearAllData();
        this.savedChartCoachList=[];
        this.trainAssignment={"USER_ID":this.username};
        resolve(true);
      });
    });
  }

  refreshTrainAssignmentFromBackend() {
    return new Promise(resolve => {
      this.backend.getTrainAssignment(this.username).then((response: any) => {
        if (response.status == 200) {
          this.trainAssignment = response.responseJSON;
          this.storage.add(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE,
            this.trainAssignment,true).then(success => {
            resolve(success);
          });
        } else if (response.status == 0 || response.status==-1) {
          this.alertToast("Failed to refresh TrainAssignment From Backend in first attempt!! Retrying...");
          /* this.refreshTrainAssignmentFromBackend(); */
          alert('BACKEND_ERROR (CHART.REFRESH_TRAIN_ASSIGNMENT) : ' + response.errorMsg);
        } else {
          alert('UNEXPECTED_ERROR (CHART.REFRESH_TRAIN_ASSIGNMENT) : ' + JSON.stringify(response));
        }
      }, failure => {
        alert('BACKEND_FAILURE (CHART.REFRESH_TRAIN_ASSIGNMENT) : ' + JSON.stringify(failure));
      });
    });
  }

  addVacantBerth(trainId, coach, index, loader, loadTime) {
    return new Promise(resolve => {
      this.storage.getDocumentCount(this.storage.collectionName.VACANT_BERTH_TABLE,
        { COACH_ID: coach }, { exact: true }).then(count => {
        if (count > 0) {
          if (index < this.trainAssignment.ASSIGNED_COACHES.length - 1) {
            index++;
            this.addVacantBerth(trainId, this.trainAssignment.ASSIGNED_COACHES[index], index, loader, loadTime);
          }
          resolve(true);
        } else {
          this.backend.getVacantBerth(trainId, coach, loadTime).then((response: any) => {
            if (response.CODE == 200) {
              let data = this.util.convertIntoJson(response.TEXT);
              this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,
                data.resultSet,true).then(success => {
                //alert(coach + ' : ' + data.resultSet.length);
                if (index < (this.trainAssignment.ASSIGNED_COACHES.length - 1)) {
                  index++;
                  this.addVacantBerth(trainId, this.trainAssignment.ASSIGNED_COACHES[index], index, loader, loadTime);
                }
              }, failure => {
                alert('FAILS TO ADD PASSENGER AT LOCAL STORAGE' + JSON.stringify(failure));
              });
              resolve(true);
            } else if (response.CODE == 500) {
              //this.addVacantBerth(trainId, coach, index, loader, loadTime);
            } else {
              loader.dismiss();
              alert('UNHANDLED ERROR ' + response.CODE);
            }
          }, (failure) => {
            alert('FAILS TO GET VACANTBERTH FROM BACKEND ' + JSON.stringify(failure));
          });
        }
      });
    });
  }

  loadForeignWaitlist(){
    let coachWiseForeignWaitlist = new Array<any>();
    this.trainAssignment.FOREIGN_COACHES.forEach((coachId, index)=>{
      this.loader.present();
      var downloadStartTime=new Date();
      let coachWiseWaitlist = new Array<any>();
      this.storage.getDocumentCount(this.storage.collectionName.PASSENGER_TABLE,{ COACH_ID: coachId }, { exact: true }).then(count=>{
        if(count==0){
          let loadTime = this.trainAssignment.LOAD_TIME;
          let trainId = this.trainAssignment.TRAIN_ID;
          this.backend.getForeignWaitList(trainId, coachId, loadTime).then((response:any)=>{
            if(response.status==200){
              coachWiseForeignWaitlist.push({ key: coachId, value: response.responseJSON });
              if(coachWiseForeignWaitlist.length == this.trainAssignment.FOREIGN_COACHES.length){
                var completTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
                var rdcdArr = coachWiseForeignWaitlist.reduce((arr, x)=>{
                  return arr.concat(x.value);
                },[]);
                
                if(rdcdArr.length>0){
                  this.storage.add(this.storage.collectionName.PASSENGER_TABLE,rdcdArr,true).then((success)=>{
                    this.loader.dismiss();
                    if(success){
                      //this.isBerthLoadComplete = true;
                      this.alertToast("Foreign Waitlist Download Complete in "+completTime+" sec.");
                      
                    }else{
                      alert('Foreign Waitlist Download');
                    }
                  });
                }
              }
            }else{
              this.loader.dismiss();
              if (response.status == 0 || response.status == -1) {
                alert("BACKEND_ERROR (CHART.LOAD_FOREIGN_WL) : " + response.errorMsg);
                return false;
              }else{
                alert('UNEXPECTED_ERROR (CHART.LOAD_FOREIGN_WL) : ' + JSON.stringify(response));
              }
            }
          },failure=>{
            this.loader.dismiss();
            alert("SERVER_GET_FAILURE (CHART.LOAD_FOREIGN_WL)  : " + JSON.stringify(failure));
          });
        }
      });
    });
  }

  loadDropEticketPassenger() {
    var downloadStartTime=new Date();
    this.loader.present();
    let trainId = this.trainAssignment.TRAIN_ID;
    this.backend.getDroppedETickets(trainId).then((response:any)=>{
      if (response.status == 200) {
        this.storage.add(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE,response.responseJSON.resultSet,true).then(success=>{
          this.loader.dismiss();
          this.isDropEtktComplete = true;
          var completTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
          this.alertToast("DROP_ETKTS Download Complete in "+completTime+" sec.")
        },failure=>{
          this.loader.dismiss();
          alert('STORAGE_ADD_FAILURE (CHART.DROP_ETKTS) : ' + JSON.stringify(failure));
        });
      }else if(response.status ==0 || response.status == -1){
        this.loader.dismiss();
        alert("BACKEND_ERROR (CHART.DROP_ETKTS) : " + response.errorMsg);
      }else{
        this.loader.dismiss();
        alert('UNEXPECTED_ERROR (CHART.DROP_ETKTS) : ' + JSON.stringify(response));
      }
    },failure=>{
      this.loader.dismiss();
      alert("SERVER_GET_FAILURE (CHART.DROP_ETKTS)  : " + JSON.stringify(failure));
    });
  }

  loadDynamicFare() {
    let logger = WL.Logger.create({pkg: 'HHT_CORDOVA',maxFileSize : 150000});
      //analytics,debug,error,fatal,info,log,trace,warn
      logger.log('DEBUG LOG ');
      logger.error('**************** loadDynamicFare ');
    var downloadStartTime=new Date();
    this.loader.present();
    let trainId = this.trainAssignment.TRAIN_ID;

    this.backend.getDynamicFare(trainId).then((response:any)=>{
      if(response.status==200){
        this.storage.add(this.storage.collectionName.DYNAMIC_FARE_TABLE,response.responseJSON.resultSet,true).then(success=>{
          this.loader.dismiss();
          this.isDynamicFareComplete = true;
          var completeTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
          this.alertToast("DYNAMIC_FARE Download Complete in "+completeTime+" sec.");
        },failure=>{
          this.loader.dismiss();
          alert('STORAGE_ADD_FAILURE (CHART.DYNAMIC_FARE) : ' + JSON.stringify(failure));
        });
      }else if(response.status==0 || response.status==-1){
        this.loader.dismiss();
        alert("BACKEND_ERROR (CHART.DYNAMIC_FARE) : " + response.errorMsg);
      }else{
        this.loader.dismiss();
        alert('UNEXPECTED_ERROR (CHART.DYNAMIC_FARE) : ' + JSON.stringify(response));
      }
    },failure=>{
      this.loader.dismiss();
      alert("SERVER_GET_FAILURE (CHART.DYNAMIC_FARE)  : " + JSON.stringify(failure));
    });
  }

  loadEFTMaster() {
    var downloadStartTime=new Date();
    this.loader.present();
    let trainId = this.trainAssignment.TRAIN_ID;
    this.backend.getEFTDetails(trainId).then((response:any)=>{
      if (response.status == 200) {
        this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,response.responseJSON.resultSet,true).then((success:any)=>{
          this.loader.dismiss();
          this.isEFTMasterComplete = true;
          var completeTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
          this.alertToast("EFT_MASTER Download Complete in "+completeTime+" sec.");
        },failure=>{
          this.loader.dismiss();
          alert('STORAGE_ADD_FAILURE (CHART.EFT_MASTER) : ' + JSON.stringify(failure));
        });
      }else if (response.status == 0 || response.status == -1) {
        this.loader.dismiss();
        alert("BACKEND_ERROR (CHART.EFT_MASTER) : " + response.errorMsg);
      }else{
        this.loader.dismiss();
        alert('UNEXPECTED_ERROR (CHART.EFT_MASTER) : ' + JSON.stringify(response));
      }
    },failure=>{
      this.loader.dismiss();
      alert("SERVER_GET_FAILURE (CHART.EFT_MASTER)  : " + JSON.stringify(failure));
    });
  }

  loadVacantberth(){
    try{
      let logger = WL.Logger.create({pkg: 'HHT_CORDOVA',maxFileSize : 150000});
      //analytics,debug,error,fatal,info,log,trace,warn
      logger.log('DEBUG LOG ');
      logger.error('**************** loadVacantberth ');
      var downloadStartTime=new Date();
      let coachWiseBerthList = new Array<any>();
      /* let coachArray = this.trainAssignment.TOTAL_COACH.map(coach=>coach.COACH_ID); */
      let coachArray=this.trainAssignment.TS_FLAG?this.trainAssignment.TOTAL_COACH.map(coach=>coach.COACH_ID):
      this.trainAssignment.ASSIGNED_COACHES.slice();
      
      coachArray.forEach((coachId, index) => {
        this.loader.present();
        this.storage.getDocumentCount(this.storage.collectionName.VACANT_BERTH_TABLE,{ COACH_ID: coachId }, { exact: true }).then(count=>{
          if (count == 0) {
            let loadTime = this.trainAssignment.LOAD_TIME;
            let trainId = this.trainAssignment.TRAIN_ID;
            this.backend.getVacantBerth(trainId, coachId, loadTime).then((response:any)=>{
              if (response.status == 200) {
                coachWiseBerthList.push({ key: coachId, value: response.responseJSON.resultSet });
                
                if(coachWiseBerthList.length == coachArray.length){
                  var completTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
                  var rdcdArr = coachWiseBerthList.reduce((arr, x) => {
                    return arr.concat(x.value);
                  }, []);
                  this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,rdcdArr,true).then(success=>{
                    this.loader.dismiss();
                    if(success){
                      this.isBerthLoadComplete = true;
                      this.alertToast("Berth Download Complete in "+completTime+" sec.");
                    }else{
                      alert('Berth Download Error');
                    }
                  },failure=>{
                    alert('STORAGE_ADD_FAILURE (CHART.LOAD_BERTH) : ' + JSON.stringify(failure));
                  });
                }
              }else{
                if (response.status == 0 || response.status == -1) {
                  this.loader.dismiss();
                  alert("BACKEND_ERROR (CHART.LOAD_BERTH) : " + response.errorMsg);
                  return false;
                }else {
                  this.loader.dismiss();
                  alert('UNEXPECTED_ERROR (CHART.LOAD_BERTH) : ' + JSON.stringify(response));
                }
              }
            },failure=>{
              this.loader.dismiss();
              alert("SERVER_GET_FAILURE (CHART.LOAD_BERTH)  : " + JSON.stringify(failure));
            });
          }
        });
      });
    }catch(ex){
      alert('Exception loadVacantberth : ' + ex);
    }
  }

  loadPassenger() {
    let logger = WL.Logger.create({pkg: 'HHT_CORDOVA',maxFileSize : 150000});
    //analytics,debug,error,fatal,info,log,trace,warn
    logger.log('DEBUG LOG ');
    logger.error('**************** loadPassenger ');
    var downloadStartTime=new Date();
    this.savedChartCoachList = new Array<any>();
    let coachArry=this.trainAssignment.TS_FLAG?this.trainAssignment.TOTAL_COACH.map(coach=>coach.COACH_ID):
    this.trainAssignment.ASSIGNED_COACHES.slice();
    coachArry.push("W/L");
    console.log(coachArry);
    
    coachArry.forEach((coachId, index) => {
      this.loader.present();
      this.storage.getDocumentCount(this.storage.collectionName.PASSENGER_TABLE,{ COACH_ID: coachId }, { exact: true }).then(count => {
        if (count == 0) {
          let loadTime = this.trainAssignment.LOAD_TIME;
          let trainId = this.trainAssignment.TRAIN_ID;
          this.backend.getPassenger(trainId, coachId, loadTime).then((response: any) => {
            if (response.status == 200) {  
              this.savedChartCoachList.push({ key: coachId, value: response.responseJSON.resultSet });
              this.progressval = (this.savedChartCoachList.length + 1) * 100 / (coachArry.length + 1);
             
              if (coachArry.length == this.savedChartCoachList.length) {
                var completTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
                
                var rdcdArr = this.savedChartCoachList.reduce((arr, x) => {
                  return arr.concat(x.value);
                }, []);

                this.storage.add(this.storage.collectionName.PASSENGER_TABLE,rdcdArr,true).then((success) => {
                  if (success) {
                    this.isChartLoadComplete = true;
                    this.alertToast("Chart Download Complete in "+completTime+" sec.")
                    this.noChart = false;
                    
                    if(!this.trainAssignment.TS_FLAG){
                      this.loadForeignWaitlist();
                    }
                  } else {
                    alert("Chart Download ERROR!!");
                  }
                  this.loader.dismiss();
                });
              }
            } else {
              if (response.status == 0 || response.status == -1) {
                this.loader.dismiss();
                //alert("BACKEND_ERROR (CHART.LOAD_PSGN) : " + response.errorMsg);
                alert("BACKEND_ERROR (CHART.LOAD_PSGN) : " + JSON.stringify(response));
                return false;
              } else {
                this.loader.dismiss();
                alert('UNEXPECTED_ERROR (CHART.LOAD_PSGN) : ' + JSON.stringify(response));
              }
            }
          }, failure => {
            this.loader.dismiss();
            alert("SERVER_GET_FAILURE (CHART.LOAD_PSGN)  : " + JSON.stringify(failure)); 
          });
        }
      });
    });

  }

  loadChartLoadInfo(){
    var downloadStartTime=new Date();
    this.loader.present();
    let trainId = this.trainAssignment.TRAIN_ID;

    this.backend.getChartLoadInfo(trainId).then((response:any)=>{
      if (response.status == 200) {
        this.chartLoadInfo = response.responseJSON;
        this.storage.add(this.storage.collectionName.CHART_LOAD_INFO, response.responseJSON, true).then((success)=>{
          this.loader.dismiss();
          this.isChartLoadInfoComplete = true;
          var completeTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
          this.alertToast("CHART_LOAD_INFO Download Complete in "+completeTime+" sec.");
        },failure=>{
          this.loader.dismiss();
          alert('STORAGE_ADD_FAILURE (CHART.CHART_LOAD_INFO) : ' + JSON.stringify(failure));
        });
      }else if (response.status == 0 || response.status == -1) {
        this.loader.dismiss();
        alert("BACKEND_ERROR (CHART.CHART_LOAD_INFO) : " + response.errorMsg);
      }else{
        this.loader.dismiss();
        alert('UNEXPECTED_ERROR (CHART.CHART_LOAD_INFO) : ' + JSON.stringify(response));
      }
    },failure=>{
      this.loader.dismiss();
      alert("SERVER_GET_FAILURE (CHART.CHART_LOAD_INFO)  : " + JSON.stringify(failure));
    });
  }


  ionViewWillEnter() {
    // watch network for a disconnect
    let changeSubscription = this.network.onchange().subscribe(() => {
      this.isNetworkAvailable='none'!=this.network.type;
      //alert('Network changed!!');
    });
    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.isNetworkAvailable=false;
      //alert('Network was disconnected :-(');
    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.isNetworkAvailable=true;
      //alert('Network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
     /*  setTimeout(() => {
        if (this.network.type === 'wifi') {
          alert('we got a wifi connection, woohoo!');
        }
      }, 3000); */
    });
  }

  syncData() {
    console.log("syncData");
    this.syncProvider.syncData(this.trainAssignment).then(res=>{
      console.log("syncData"+res);
      if(res){
        this.alertToast("Data Sync completed in "+this.syncProvider.getTimeInMili()/1000+" sec");
        //this.syncColor = "light";
        this.pdsp.syncStatus.then(res=>{
          this.syncColor = res;
        });
        this.pdsp.findAll(true).subscribe(data => {
          console.log(data);
          
          this.savedChartCoachList = data.coachwiseChartData;
          this.trainAssignment = data.trainAssignmentObj;
          this.trainAssignment.LOAD_TIME = this.syncProvider.serverTimeAtProcessStart;
          this.trainAssignment.LAST_SYNCED = this.syncProvider.serverTimeAtProcessStart;
         });
      }else{
        //this.syncColor = "danger";
        this.pdsp.syncStatus.then(res=>{
          this.syncColor = res;
        });
        this.alertToast("Some Problem in data Sync, completed in "+this.syncProvider.getTimeInMili()/1000+" sec");
      }
    }).catch((e) => {
      console.error(e);
      alert(e);
  });
  }
}
