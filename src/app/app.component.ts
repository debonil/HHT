import { Component, ViewChild, Renderer , OnInit } from '@angular/core';
import { Platform , MenuController , NavController, Events ,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
//import { StorageProvider } from '../providers/storage/storage';
import { ChartPage } from '../pages/chart/chart';

import { EftPage } from '../pages/eft/eft';
import { RacPage } from '../pages/rac/rac';
import { RacmodalPage } from '../pages/racmodal/racmodal';
import { AfterChartingCancelledPage } from '../pages/after-charting-cancelled/after-charting-cancelled';
import { StatusPage } from '../pages/status/status';
import { VacantberthPage } from '../pages/vacantberth/vacantberth';
import { NcPsgnPage } from '../pages/nc-psgn/nc-psgn';
import { ShiftPsgnPage } from '../pages/shift-psgn/shift-psgn';
import { NcPreviewPage } from '../pages/nc-preview/nc-preview';
import { CoachwiseChartViewPage } from '../pages/coachwise-chart-view/coachwise-chart-view';
import { WaitlistPage } from '../pages/waitlist/waitlist';
import { WaitlistModelPage } from '../pages/waitlist-model/waitlist-model';

import { EftTabsPage } from '../pages/eft-tabs/eft-tabs';
import { OccupancyPage } from '../pages/occupancy/occupancy';
import { VacTabsPage } from '../pages/vac-tabs/vac-tabs';
import { NormalShiftPage } from '../pages/normal-shift/normal-shift';
import { MutualShiftPage } from '../pages/mutual-shift/mutual-shift';
import { NtPassengersPage } from '../pages/nt-passengers/nt-passengers';
import { DoctorsPage } from '../pages/doctors/doctors';

import { WaitListTabsPage } from '../pages/wait-list-tabs/wait-list-tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { DroppedETktPassengerPage } from '../pages/dropped-e-tkt-passenger/dropped-e-tkt-passenger';
import { PsngDataServiceProvider } from '../providers/psng-data-service/psng-data-service';
import { SearchPage } from '../pages/search/search';
import { RacTabPage } from '../pages/rac-tab/rac-tab';
import { StorageServiceProvider } from '../providers/storage-service/storage-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  backButtonPressedOnceToExit: boolean=false;
  @ViewChild('nav') nav: NavController;

  rootPage: any = HomePage;
  homePage:any= HomePage;
  username : string;
  downloadChartPage = ChartPage;

  eftPage = EftPage
  dropETkt = DroppedETktPassengerPage;
  occupancy = OccupancyPage;
  //racPage = RacPage;
    racPage = RacTabPage;

  afterCharting = AfterChartingCancelledPage;
  status = StatusPage;
  vacantberth = VacTabsPage;
  ncpassengers = NcPsgnPage;
  shiftpsgn = ShiftPsgnPage;
  waitlist = WaitlistPage;
  ntpassengers=NtPassengersPage;
  doctors=DoctorsPage;
  //pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen ,
    public renderer : Renderer, 
    //public storageProvider: StorageProvider,
    public event : Events, 
    public storageServiceProvider:StorageServiceProvider,
    public menuCtrl : MenuController,
    private pdsp: PsngDataServiceProvider,
    public toastCtrl: ToastController) {

    this.initializeApp();
    
    this.renderer.listenGlobal('document','mfpjsonjsloaded',()=>{
      //alert('MFP LOADED');
      console.log('--> mfpjsonjsloaded rendered');
      this.storageServiceProvider.init().then(s=>{
        this.storageServiceProvider.getDocuments(
          this.storageServiceProvider.collectionName.TRAIN_ASSNGMNT_TABLE
        ).then(result=>{
              //console.log(result);
               if(result[0]&&result[0]["json"]&&result[0]["json"]["USER_ID"]){
                this.username=result["USER_ID"];
                this.pdsp.findAll().subscribe(data => {
                  //console.log(data.coachwiseChartData.length);
                });
                this.alertToast("Auto login successfull!!");
                this.nav.setRoot(this.downloadChartPage, {user : this.username});
               }
              });
        this.splashScreen.hide();
        //this.ionViewDidLoad();
      });
    });

    this.event.subscribe('userEntered',userName=>{
      if(userName!=undefined && userName !== "" ){
        this.username = userName;
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
     // alert('platform is ready');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.registerBackButton();
      //this.splashScreen.show();
    });
  }

  onLoad(page: any){
   // alert('Page load ' + page.html());
    //this.nav.setRoot(page, {user : this.username});
    this.nav.push(page, {user : this.username});
    this.menuCtrl.close();
  }
  /* ionViewDidLoad(){
    console.log("ionViewDidLoad");
    this.storageProvider.getTrainAssignment().then(result=>{

    console.log(result);
     if(result&&result["USER_ID"]){
      this.username=result["USER_ID"];
      this.alertToast("Auto login successfull!!");
      this.nav.setRoot(this.downloadChartPage, {user : this.username});
     }
    });
  } */
  alertToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  logOutSession(){
    this. clearChart().then(cleared=>{
      if(!cleared){
        alert("Failed to clear data!!");
      }
      this.nav.setRoot(this.homePage);
      this.menuCtrl.close();
    });
  }


  clearChart() {
    //alert('clear chart');
    return new Promise(resolve => {
      this.storageServiceProvider.clearAll().then(() => {
        this.pdsp.clearAllData();
        resolve(true);
      });
    });
  }
/* 
  clearChart() {
    //alert('clear chart');
    return new Promise(resolve => {
      this.storageServiceProvider.clear('trainAssignment').then(() => {
        this.storageServiceProvider.clear('coachTime').then(() => {
          this.storageServiceProvider.clear('droptEticketPassenger').then(() => {
            this.storageServiceProvider.clear('dynamicFare').then(() => {
              this.storageServiceProvider.clear('eftMaster').then(() => {
                this.storageServiceProvider.clear('vacantberth').then(() => {
                  this.storageServiceProvider.clear('passenger').then(() => {
                    this.pdsp.clearAllData();
                    resolve(true);
                  });
                });
              });
            });
          });
        });
      });
    });
  } */
 /* dropEtkt(page:any){
   // alert('Page load ' + page.html());
    this.nav.setRoot(page, {user : this.username});
    this.menuCtrl.close();
  }*/
  registerBackButton(){
    this.platform.registerBackButtonAction(() => {


      //uncomment this and comment code below to to show toast and exit app
      if (this.backButtonPressedOnceToExit) {
        this.platform.exitApp();
      } else if (this.nav.canGoBack()) {
        this.nav.pop({});
      } else {
        this.showToast();
        this.backButtonPressedOnceToExit = true;
        setTimeout(() => {

          this.backButtonPressedOnceToExit = false;
        },2000)
      }

      /* if(this.nav.canGoBack()){
        this.nav.pop();
      }else{
        if(this.alert){ 
          this.alert.dismiss();
          this.alert =null;     
        }else{
          this.showAlert();
         }
      } */
    });
  }

  /* showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert =null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  } */

    showToast() {
      let toast = this.toastCtrl.create({
        message: 'Press back again to exit',
        duration: 2000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    }
}
