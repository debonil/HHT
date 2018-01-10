import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,FabContainer } from 'ionic-angular';

 import { ChartPsngPage } from '../chart-psng/chart-psng';
// import { ContactPage } from '../contact/contact';
// import { PopoverPage } from '../popover/popover';
 import { ActionSheetController, ModalController, PopoverController } from 'ionic-angular';
 import { SuperTabsController, SuperTabs } from 'ionic2-super-tabs';
// import { ChartBerthPassengerDetail } from "../../model/ChartBerthPassengerDetail";
 import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
 //import { StorageProvider } from '../../providers/storage/storage';
// import { ShiftPsgnPage } from '../shift-psgn/shift-psgn';
 import { ChartPreviewPage } from '../chart-preview/chart-preview';
 import { ChartPage } from '../chart/chart';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
  selector: 'page-coachwise-chart-view',
  templateUrl: 'coachwise-chart-view.html',
})
export class CoachwiseChartViewPage {
  // set some user information on chatParams
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  selectedCoach: string;
  coachwiseChartData: Array<any>;
  coachwiseChartDataLoaded: boolean = false;
  chartComponent: any = ChartPsngPage;
  chartPreviewPage: any = ChartPreviewPage;
  trainAssignment: any;
  /* selectedBoardingPoints: Array<string>;
  showNotCheckedOnly: boolean;
  filterStatus: string="0"; */
  passengerSelectorViewObj:any={
    isActive:false,
    selectedPassengerItems:[],
    //activate:this.passengerSelectorViewObjActivate,
    //checkChanged:this.passengerSelectorViewObjCheckChanged,
  };
  private loading : any;
  timeTrack : number;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController, 
    private superTabsCtrl: SuperTabsController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private pdsp: PsngDataServiceProvider,
    public modalCtrl: ModalController, 
    private loadingCtrl: LoadingController, 
    //private storage: StorageProvider,
    private toastCtrl:ToastController
  ) {
   console.log('constructor CoachwiseChartViewPage' + new Date());
    this.timeTrack = new Date().getTime();

    
  }
  ionViewDidLoad() {
   console.log('ionViewDidLoad CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
   this.loading = this.loadingCtrl.create({
      content: 'Organizing chart ......'
    });
    this.loading.present();
  }

  ionViewDidEnter() {
   console.log('ionViewDidEnter CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
  
    
   console.log('this.pdsp.findAll() CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
   
   this.pdsp.findAll().subscribe(data => {
    //console.log("IN subscribe");
    //console.log(data);
    console.log('IN subscribe CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
    
     if (data) {
       this.coachwiseChartData = data.coachwiseChartData;
       this.trainAssignment = data.trainAssignmentObj;
       if(this.pdsp.selectedBoardingPoints==undefined)
       this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR.slice(0,1);
       this.coachwiseChartDataLoaded = true;
       this.selectedCoach = data.coachwiseChartData[0].key;
      // this.alertToast("Data loading...");
     } else {
       alert("NO CHART DATA FOUND!!");
       this.navCtrl.setRoot(ChartPage);
     }

   },
     error => {
       ////console.log("IN subscribe err" + JSON.stringify(error)); 
   },
     () => {
     // console.log("IN subscribe finish");
      console.log('IN subscribe finish CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
      //this.alertToast("Data load complete!!");
       if(this.loading){
         console.log('about to dismiss loader....');
         this.loading.dismiss();
         this.filterData();
       }
     });
    
    /* this.storage.getTrainAssignment().then(result => {
      this.trainAssignment = result;
      this.selectedBoardingPoints = this.trainAssignment.ISL_ARR;
      console.log('getTrainAssignment CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
      
    }); */
    // this.get_COACHES()
    //this.getStn_Code();
    
  }
  ionViewCanEnter() {
   console.log('ionViewCanEnter CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
  }
  refreshChart() {
   console.log('refreshChart CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
    this.loading = this.loadingCtrl.create({
      content: 'Refreshing chart ......'
    });
    //this.loading.present();
    this.pdsp.findAll(true).subscribe(data => {
     console.log("refreshChart IN subscribe");
     console.log(data);
      if (data) {
        /* this.coachwiseChartDataLoaded = false;
        this.loading.present();
        this.coachwiseChartData = data.coachwiseChartData;
        this.coachwiseChartDataLoaded = true;
        this.loading.dismiss(); */
        this.alertToast("Data refreshed!!");


        /* this.navCtrl.push(this.chartPreviewPage);
        this.navCtrl.pop(); */
      } else {
        alert("refreshChart NO CHART DATA FOUND!!");
        this.navCtrl.setRoot(ChartPage);
      }

    },
      error => {
        console.log("refreshChart IN subscribe err" + JSON.stringify(error));
     },
      () => {
       console.log("refreshChart IN subscribe finish");
        //this.loading.dismiss();
      });

   console.log('refreshChart end CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
  }

  filterData(params?: any) {

   console.log('filterData CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
    return new Promise(resolve=>{
      this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
        coachpsngbrth.value.forEach((psngbrth, ind2) => {
          psngbrth._hidden=!(this.pdsp.selectedBoardingPoints.indexOf(psngbrth.BRD)>-1)
          //||(this.showNotCheckedOnly&&psngbrth._isLocked)
          ||((Number(this.pdsp.filterStatus)>-1&&(Number(this.pdsp.filterStatus)<3))&&psngbrth._status!=this.pdsp.filterStatus)
          
          ||(Number(this.pdsp.filterStatus)>2&&psngbrth.dbObj.json.PSGN_NO!=-1);
          //console.log(psngbrth._status);
        });
      });
      //selectedBoardingPoints
       console.log("Data Filtered!!");
        resolve(true);

   console.log('filterData lastline promise cons CoachwiseChartViewPage' + (new Date().getTime()-this.timeTrack));
    });
    
  }

 /*  cancelPsgnSearch(ev) {
    var val = ev.target.value;
    //alert('--> cancelPsgnSearch : ' + val);
    this.listitems = [];
  }

  //To poen a side pop over
  openPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
 */
  /* openModel_ShiftPsgn(characterNum){
    let modal = this.modalCtrl.create(ShiftPsgnPage, characterNum);
    modal.present();
  } */

  previewAndSubmitChart() {
    this.navCtrl.push(this.chartPreviewPage, { coachwiseChartData: this.coachwiseChartData });
  }
  alertToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  share(action: string, fab: FabContainer) {
    fab.close();
    switch (action) {
      case "save":
        this.savePsngBerthDataLocally();
        break;
      case "prev":
        this.previewAndSubmitChart();
        break;
    
      default:
        break;
    }
  }
  showLoader(msg) {
    if (!this.loading) {
      this.loading  = this.loadingCtrl.create({ content: msg });
    } else {
      this.loading.dismiss();
      this.loading = this.loadingCtrl.create({ content: msg });
    }

    this.loading.present();

  }
  savePsngBerthDataLocally() {
    this.showLoader("Saving data... ");
    this.pdsp.savePsngBerthDataLocally()
    .then((resp)=>{
      this.loading.dismiss();
      if(resp["success"]){
        this.alertToast("Data saved successfully!!");
      }else{
        alert("Data could not be saved!! \n ERROR : "+ JSON.stringify(resp));
      }
    })
    .catch((error)=>{
      this.loading.dismiss();
      alert("Data could not be saved!! \n ERROR : "+ JSON.stringify(error));
    });
  }
  onTabSelect(event){
    console.log(event);
    this.selectedCoach=event.id;
  }

}

