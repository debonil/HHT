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
///@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  collectionName: string = 'trainCoachData';
  trainAssignment: any;
  loader : any;
  trainN: string = '12014';
  trainId: number = -1;
  coachArr: CoachDetails[] = [];
  coachTimeArr: CoachTime[] = [];
  dropEticketPassengerArr: DropEticketPassenger[] = [];
  dynamicFareArr: DynamicFare[] = [];
  eftMasterArr: EftMaster[] = [];
  isldtlArr: IsldtlTable[] = [];
  vacantBerthData: VacantBerth[] = [];
  passengerData: Passenger[] = [];
  //copyPassenger = [];
  //loadedChart = ShowChartPage;
  isSecondary: boolean;
  syncPassengerData: Passenger[] = [];
  totalPassengerData: number;
  dataleft: boolean;
  noNetwork: boolean;
  noChart: boolean = false;
  noCoach: boolean;
  username: string;
  chartDate: string;
  loadChartDate: Date = new Date();
  isChartLoadComplete: boolean = false;
  progressval: number = 0;
  savedChartCoachList: Array<any>;

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
    /*  this.username = this.navParams.get('user');
     this.noChart = this.navParams.get('noChart');
    // console.log("no chart" + this.noChart); */
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
    let alert = this.alert.create({
      title: 'Confirm New Duty',
      message: 'Do you want to switch to new Duty or fresh copy of current one ? Doing this would clean all unsynced changes. It is suggested to sync yor work before doing this. ',
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
    //alert('load chart');
    this.loader = this.loading.create({
      content: 'Loading data from server!!'
    });
   this.loader.present();
    // this.addTrainAssignment(loader).then(response=>{
    if (this.trainAssignment) {
      this.loadPassenger();
      //this.loadCoachTime(loader);
      this.loadDropEticketPassenger( this.loader);
      this.loadDynamicFare( this.loader);
      this.loadEFTMaster( this.loader);
      //this.addPassenger(this.trainAssignment.TRAIN_ID, this.trainAssignment.ASSIGNED_COACHES[0],0,this.loader, this.trainAssignment.LOAD_TIME);
      
      this.addVacantBerth(this.trainAssignment.TRAIN_ID, this.trainAssignment.ASSIGNED_COACHES[0], 0,this.loader, this.trainAssignment.LOAD_TIME);
      //this.addWaitlist(loader);
     this.loader.dismiss();
    } else {
      this.alertToast("No Train Assigned!! Could not download chart.");
    }
    // });
  }


  clearChartData() {
    this.clearChart().then((resp) => {
      this.alertToast("All data cleared !!");
    });
  }

  clearChart() {
    //alert('clear chart');
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
        if (response.CODE == 200) {
          this.trainAssignment = response.TEXT;
          this.storage.add(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE,
            this.trainAssignment,true).then(success => {
            resolve(success);
          });
        } else if (response.CODE == 500) {
          this.alertToast("Failed to refresh TrainAssignment From Backend in first attempt!! Retrying...");
          this.refreshTrainAssignmentFromBackend();
        } else {
          alert('UNHANDLED ERROR ' + response.CODE);
        }
      }, failure => {
        alert('FAILS TO GET TRAIN ASSIGNMENT' + JSON.stringify(failure));
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
              this.addVacantBerth(trainId, coach, index, loader, loadTime);
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

  loadDropEticketPassenger(loader) {
    let trainId = this.trainAssignment.TRAIN_ID;
    return new Promise(resolve => {
      this.storage.getDocumentCount(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE).then(cnt => {
        if (cnt == 0) {
          this.backend.loaddroppedETickets(trainId).then((response: any) => {
            if (response.CODE == 200) {
              let data = this.util.convertIntoJson(response.TEXT);
              if (data.resultSet.length > 0) {
                this.storage.add(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE,
                  data.resultSet,true).then((success) => {

                }, (failure) => {
                  alert("failed to add dropped e ticket passenger " + JSON.stringify(failure));
                });
              }
              resolve(true);
            } else if (response.CODE == 500) {
              this.loadDropEticketPassenger(loader);
            } else {
              loader.dismiss();
              alert('UNHANDLED ERROR ' + response.CODE);
            }
          }, (failure) => {
            alert("failed to get dropped e ticket passsenger " + JSON.stringify(failure));
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  loadDynamicFare(loader) {
    let trainId = this.trainAssignment.TRAIN_ID;
    return new Promise(resolve => {
      this.storage.getDocumentCount(this.storage.collectionName.DYNAMIC_FARE_TABLE).then(cnt => {
        if (cnt == 0) {
          this.backend.getDynamicFare(trainId).then((response: any) => {
            if (response.CODE == 200) {
              let data = this.util.convertIntoJson(response.TEXT);
              if (data.resultSet.length > 0) {
                this.storage.add(this.storage.collectionName.DYNAMIC_FARE_TABLE,data.resultSet,true).then((success) => {

                }, (failure) => {
                  alert("failed to add dynamic fare " + JSON.stringify(failure));
                });
              }
              resolve(true);
            } else if (response.CODE == 500) {
              this.loadDynamicFare(loader);
            } else {
              loader.dismiss();
              alert('UNHANDLED ERROR ' + response.CODE);
            }
          }, (failure) => {
            alert("failed to get dynamic fare " + JSON.stringify(failure));
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  loadEFTMaster(loader) {
    let trainId = this.trainAssignment.TRAIN_ID;
    return new Promise(resolve => {
      this.storage.getDocumentCount(this.storage.collectionName.EFT_MASTER_TABLE).then(cnt => {
        if (cnt == 0) {
          this.backend.getEFTDetails(trainId).then((response: any) => {
            if (response.CODE == 200) {
              let data = this.util.convertIntoJson(response.TEXT);
              if (data.resultSet.length > 0) {
                this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,data.resultSet,true).then((success) => {

                }, (failure) => {
                  alert("FAILS TO ADD EFT MASTER " + JSON.stringify(failure));
                });
              }
              resolve(true);
            } else if (response.CODE == 500) {
              this.loadEFTMaster(loader);
            } else {
              loader.dismiss();
              alert('UNHANDLED ERROR ' + response.CODE);
            }
          }, (failure) => {
            alert("failed to get eft master" + JSON.stringify(failure));
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  loadPassenger() {
    var downloadStartTime=new Date();
    //let index = 0;
    this.savedChartCoachList = new Array<any>();
    let coachArry=this.trainAssignment.ASSIGNED_COACHES.slice();
    coachArry.push("W/L");
    console.log(coachArry);
    
   // console.log("Starting download...");
   // console.log((new Date().getTime()-downloadStartTime.getTime())/ 1000);
    
    coachArry.forEach((coachId, index) => {
      this.loader.present();
      this.storage.getDocumentCount(this.storage.collectionName.PASSENGER_TABLE,{ COACH_ID: coachId }, { exact: true }).then(count => {
        if (count == 0) {
          let loadTime = this.trainAssignment.LOAD_TIME;
          let trainId = this.trainAssignment.TRAIN_ID;
          //alert('GET PSGN FOR ' + coachId);

   // console.log('GET PSGN FOR ' + coachId);
   // console.log((new Date().getTime()-downloadStartTime.getTime())/ 1000);
          this.backend.getPassenger(trainId, coachId, loadTime).then((response: any) => {
            // if(index==0)this.savedChartCoachList=new Array<any>();
            if (response.CODE == 200) {
              this.savedChartCoachList.push({ key: coachId, value: response.TEXT.resultSet });
             //// console.log("Downloaded "+coachId+" ==>"+response.TEXT.resultSet.length);
             // console.log((new Date().getTime()-downloadStartTime.getTime())/ 1000);
             // console.log(this.savedChartCoachList.length);
              
              this.progressval = (this.savedChartCoachList.length + 1) * 100 / (coachArry.length + 1);
             // console.log(this.progressval);
              if (coachArry.length == this.savedChartCoachList.length) {
                var completTime=(new Date().getTime()-downloadStartTime.getTime())/ 1000;
               // console.log("Chart Download Complete in "+completTime+" sec.");
                
                var rdcdArr = this.savedChartCoachList.reduce((arr, x) => {
                 // console.log(x);
                  return arr.concat(x.value);
                }, []);
               // console.log(this.savedChartCoachList);
               // console.log(rdcdArr);

                this.storage.add(this.storage.collectionName.PASSENGER_TABLE,rdcdArr,true).then((success) => {
                  if (success) {
                   // console.log("Downloaded "+coachId+" ==>"+response.TEXT.resultSet.length);
                   // console.log((new Date().getTime()-downloadStartTime.getTime())/ 1000);
                    this.isChartLoadComplete = true;
                    this.alertToast("Chart Download Complete in "+completTime+" sec.")
                    this.noChart = false;
                    //this.loadWaitlist();
                  } else {
                    alert("Chart Download ERROR!!");
                  }
                  this.loader.dismiss();
                });
              }
            } else {
              if (response.CODE == 500) {
                this.loadPassenger();
              } else {
                this.loader.dismiss();
                alert('UNHANDLED ERROR ' + response.CODE);
              }
            }
          }, failure => {
            alert('FAILS TO GET PASSENGER FROM BACKEND ' + JSON.stringify(failure));
          });
        }
      });
    });

  }


  ionViewWillEnter() {
    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          alert('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }

  syncData() {
    console.log("syncData");
    
    this.syncProvider.syncData(this.trainAssignment).then(res=>{
      console.log("syncData"+res);
      if(res){
        this.alertToast("Data Sync completed in "+this.syncProvider.getTimeInMili()/1000+" sec");
        this.pdsp.findAll(true).subscribe(data => {
          console.log(data);
          
          this.savedChartCoachList = data.coachwiseChartData;
          this.trainAssignment = data.trainAssignmentObj;
          this.trainAssignment.LOAD_TIME = this.syncProvider.serverTimeAtProcessStart;
          this.trainAssignment.LAST_SYNCED = this.syncProvider.serverTimeAtProcessStart;
         });
      }else{
        this.alertToast("Some Problem in data Sync, completed in "+this.syncProvider.getTimeInMili()/1000+" sec");
      }
    }).catch((e) => {
      console.error(e);
      alert(e);
  });
  }
}
