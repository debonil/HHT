import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer } from 'ionic-angular';

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
import { NormalShiftPage } from '../normal-shift/normal-shift';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

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
  addVacantBerthArry: any[] = [];
  tempArray: any[] = [];
  shiftTempArray: any[] = [];
  shiftPsngArr: any[] = [];

  /* selectedBoardingPoints: Array<string>;
  showNotCheckedOnly: boolean;
  filterStatus: string="0"; */
  passengerSelectorViewObj: any = {
    isActive: false,
    selectedPassengerItems: [],
    activate: this.passengerSelectorViewObjActivate,
    checkChanged: this.passengerSelectorViewObjCheckChanged,
  };
  private loading: any;
  timeTrack: number;

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
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storageserviceprovider: StorageServiceProvider,

  ) {
    console.log('constructor CoachwiseChartViewPage' + new Date());
    this.timeTrack = new Date().getTime();
    console.log(JSON.stringify(this.passengerSelectorViewObj));



  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
    this.loading = this.loadingCtrl.create({
      content: 'Organizing chart ......'
    });
    this.loading.present();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));


    console.log('this.pdsp.findAll() CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));

    this.pdsp.findAll().subscribe(data => {
      //console.log("IN subscribe");
      //console.log(data);
      console.log('IN subscribe CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));

      if (data) {
        this.coachwiseChartData = data.coachwiseChartData;
        this.trainAssignment = data.trainAssignmentObj;
        if (this.pdsp.selectedBoardingPoints == undefined)
          this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR.slice(0, 1);
        this.coachwiseChartDataLoaded = true;
        this.selectedCoach = data.coachwiseChartData[0].key;
        //console.log(this.selectedCoach);

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
        console.log('IN subscribe finish CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
        //this.alertToast("Data load complete!!");
        if (this.loading) {
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
    console.log('ionViewCanEnter CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
  }
  refreshChart() {
    console.log('refreshChart CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
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

    console.log('refreshChart end CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
  }

  filterData(params?: any) {

    console.log('filterData CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
    //console.log(this.pdsp.filterStatus);
   return new Promise(resolve => {
      this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
        coachpsngbrth.value.forEach((psngbrth, ind2) => {
       // console.log(psngbrth);
        psngbrth._hidden = !(this.pdsp.selectedBoardingPoints.indexOf(psngbrth.BRD) > -1)
            //||(this.showNotCheckedOnly&&psngbrth._isLocked)
            || ((Number(this.pdsp.filterStatus) > -1 && (Number(this.pdsp.filterStatus) < 3)) && psngbrth._status != this.pdsp.filterStatus)

            || (Number(this.pdsp.filterStatus) > 2 && psngbrth.dbObj.json.PSGN_NO != -1);
          //console.log(psngbrth._status);
        });
      });
      //selectedBoardingPoints
      console.log("Data Filtered!!");
      resolve(true);

      console.log('filterData lastline promise cons CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
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
      this.loading = this.loadingCtrl.create({ content: msg });
    } else {
      this.loading.dismiss();
      this.loading = this.loadingCtrl.create({ content: msg });
    }

    this.loading.present();

  }
  savePsngBerthDataLocally() {
    this.showLoader("Saving data... ");
    this.pdsp.savePsngBerthDataLocally()
      .then((resp) => {
        this.loading.dismiss();
        if (resp["success"]) {
          this.alertToast("Data saved successfully!!");
        } else {
          alert("Data could not be saved!! \n ERROR : " + JSON.stringify(resp));
        }
      })
      .catch((error) => {
        this.loading.dismiss();
        alert("Data could not be saved!! \n ERROR : " + JSON.stringify(error));
      });
  }
  onTabSelect(event) {
    //alert(JSON.stringify(event));
    console.log(event);
    this.selectedCoach = event.id;
  }
  ionViewCanLeave(): boolean {
    // here we can either return true or false
    // depending on if we want to leave this view
    if (!this.passengerSelectorViewObj.isActive) {
      return true;
    } else {
      this.releaseSelectorMode();
      return false;
    }
  }
  passengerSelectorViewObjActivate() {
    console.log("passengerSelectorViewObjActivate");
  }
  passengerSelectorViewObjCheckChanged() {
    console.log("passengerSelectorViewObjCheckChanged");
  }

  releaseSelectorMode() {
    this.passengerSelectorViewObj.isActive = false;
    while (this.passengerSelectorViewObj.selectedPassengerItems.length > 0) {
      this.passengerSelectorViewObj.selectedPassengerItems.pop().selected = false;
    }
  }


  /*code start Normal shift method */
  normalShift() {
    //console.log(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems));

    // we are getting selected row
    let myModal = this.modalCtrl.create(NormalShiftPage, this.passengerSelectorViewObj.selectedPassengerItems);
    myModal.onDidDismiss(data => {
      if(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID===data[0].json.COACH_ID){
        
        this.passengerSelectorViewObj.selectedPassengerItems[0].BN = data[0].json.BERTH_NO;
        this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data[0].json.REMARKS;
        
        this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID = data[0].json.COACH_ID;
        this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO = data[0].json.BERTH_NO;
        this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.NEW_COACH_ID = data[0].json.NEW_COACH_ID;
        this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.NEW_BERTH_NO = data[0].json.NEW_BERTH_NO
        this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = data[0].json.REMARKS;
  
        this.passengerSelectorViewObj.selectedPassengerItems[0].selected = false;
        this.passengerSelectorViewObj.isActive = false;
        this.passengerSelectorViewObj.selectedPassengerItems.pop();
  
      }else{
       
        this.pdsp.addPsngBerth(data[0].json);
        this.pdsp.convertPsngToVBerth(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json);
        this.passengerSelectorViewObj.selectedPassengerItems[0].selected = false;
        this.passengerSelectorViewObj.isActive = false;
        this.passengerSelectorViewObj.selectedPassengerItems.pop();
  
      }
     
    });
    myModal.present();
  }
  /*code end Normal shift method */

  gotDownPsgn() {
    this.showCheckboxGoDownPsgn();

  }
  showCheckboxGoDownPsgn() {
    var psgnGDS;
    var psgnBP;
    

    var option = { exact: true };
    var query = {
      COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
      BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO,
      //PNR_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.PNR_NO
    };

    // Storing Data into json
    this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
      psgnGDS = res[0].json.RES_UPTO;
      psgnBP = res[0].json.JRNY_FROM;

      let alert = this.alertCtrl.create();
      alert.setTitle('Passenger Got Down At');
      alert.addInput({
        type: 'radio',
        label: 'select station',
        value: 'select',
        checked: true
      });

      // Getting ISL stations
      var index = this.trainAssignment.ISL_ARR;
      // Getting ISL Upto reservation station of psgn
      var upto = index.indexOf(psgnGDS);
      // Getting ISL from reservation station of psgn
      var from = index.indexOf(psgnBP)
      from++;
      for (var i = from; i < upto; i++) {
        //console.log(index[i]);
        alert.addInput({
          type: 'radio',
          label: index[i],
          value: index[i],
          checked: false
        });
      }


      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: data => {
          //console.log('Checkbox data Got Down Psgn At: ', data);

          res[0].json.RES_UPTO = data;
          this.addVaccanBerth(res, data);

          this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
            console.log("passenger boarded at updated successfully" + JSON.stringify(opt));
            console.log("passenger boarded at updated successfully" + JSON.stringify(res));

          }, (fail) => {
            console.log("failed to replace passenger" + JSON.stringify(fail));
          });
        }
      });
      alert.present();

    }, (fail) => {
      console.log("failed to find passenger:: " + JSON.stringify(fail));
    });


  }

  addVaccanBerth(result, gotDownPoint) {

    var query = {

      TRAIN_ID: result[0].json.TRAIN_ID,
      COACH_ID: result[0].json.COACH_ID,
      BERTH_NO: result[0].json.BERTH_NO,
      CLASS: result[0].json.CLASS,
      REMOTE_LOC_NO: result[0].json.REMOTE_LOC_NO,
      BERTH_INDEX: result[0].json.BERTH_INDEX,
      SRC: gotDownPoint,
      DEST: result[0].json.JRNY_TO,
      ALLOTED: "N",
      REASON: "V",
      CAB_CP: "-",
      CAB_CP_ID: "-",
      CH_NUMBER: 1,
      PRIMARY_QUOTA: "--",
      SUB_QUOTA: "--",
      SYSTIME: "2018-01-01 15:40:03.477"


    }
    this.addVacantBerthArry.push(query)
    console.log(JSON.stringify(this.addVacantBerthArry));

    // change code using psdp service
    //WL.JSONStore.get('vacantberth').add(this.addVacantBerthArry)
   
    this.storageserviceprovider.add(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.addVacantBerthArry).then((opt) => {

      console.log("passenger boarded at added successfully" + JSON.stringify(opt));
      console.log("passenger boarded at updated successfully" + JSON.stringify(query));

    }, (fail) => {
      console.log("failed to add vacant berth" + JSON.stringify(fail));
    });

  }

  boardedAtPsgn() {
    
    this.showCheckboxBoardPsgn();

  }
  showCheckboxBoardPsgn() {

    console.log(JSON.stringify(this.trainAssignment.ISL_ARR));
    var psgnGDS ;
    var psgnBP ;    

    var option = { exact: true };
    var query = {
      COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
      BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO,
      //PNR_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.PNR_NO
    };

    // change code using psdp service
    this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
      

      psgnGDS = res[0].json.RES_UPTO;
      psgnBP = res[0].json.JRNY_FROM;

      // Create alert modal
      let alert = this.alertCtrl.create();
      alert.setTitle('Passenger Boarded At');
      alert.addInput({
        type: 'radio',
        label: 'select station',
        value: 'select',
        checked: true
      });

      // Getting ISL stations
      var index = this.trainAssignment.ISL_ARR;
      // Getting ISL Upto reservation station of psgn
      var upto = index.indexOf(psgnGDS);
      // Getting ISL from reservation station of psgn
      var from = index.indexOf(psgnBP)
      from++;

      for (var i = from; i < upto; i++) {

        alert.addInput({
          type: 'radio',
          label: index[i],
          value: index[i],
          checked: false
        });
      }

      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: data => {
          //console.log('Checkbox data Boarding Psgn At: ', data);

          res[0].json.BOARDING_PT = data;
          

          // change code using psdp service

          this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
            console.log("passenger boarded at updated successfully" + JSON.stringify(opt));
            console.log("passenger boarded at updated successfully" + JSON.stringify(res));
          }, (fail) => {
            console.log("failed to replace passenger" + JSON.stringify(fail));
          });


        }
      });
      alert.present();


    }, (fail) => {
      console.log("failed to find passenger:: " + JSON.stringify(fail));
    });


  }

  mutualShift() {
    let alertbox = this.alertCtrl.create();
    alertbox.setTitle('Warning');
    alertbox.setMessage("Are you sure want do mutual shift?");
    alertbox.addButton('Cancel');
    alertbox.addButton({
      text: 'Okay',
      handler: data => {
        this.shiftPsngArr = this.passengerSelectorViewObj.selectedPassengerItems;
        if (this.shiftPsngArr[0].dbObj.json.JRNY_TO == this.shiftPsngArr[1].dbObj.json.JRNY_TO) {
          this.getShift();

        } else {
          //alert(" Sorry!! Berth destination is not same. you can't do shiftting ! ")
          this.presentAlert();
        }
      }
    });
    alertbox.present();



  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Warning Alert',
      subTitle: "Sorry!! Berth destination is not same. you can't do shiftting !",
      buttons: ['Ok']
    });
    alert.present();
  }
  instantUpdateCode() {
    return new Promise(resolve => {

      this.tempArray = this.passengerSelectorViewObj.selectedPassengerItems;
      this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = "SHIFTED";
      this.passengerSelectorViewObj.selectedPassengerItems[1].REMARKS = "SHIFTED";
      //console.log("looking  for: " + this.finalArray);

      this.passengerSelectorViewObj.selectedPassengerItems[0].NAME = this.tempArray[1].dbObj.json.PSGN_NAME;
      this.passengerSelectorViewObj.selectedPassengerItems[1].NAME = this.tempArray[0].dbObj.json.PSGN_NAME;
      this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID = this.tempArray[1].dbObj.json.COACH_ID;
      this.passengerSelectorViewObj.selectedPassengerItems[1].dbObj.json.COACH_ID = this.tempArray[0].dbObj.json.COACH_ID;



      this.passengerSelectorViewObj.selectedPassengerItems[1].PNR = this.tempArray[0].dbObj.json.PNR_NO;
      this.passengerSelectorViewObj.selectedPassengerItems[0].PNR = this.tempArray[1].dbObj.json.PNR_NO;

      this.passengerSelectorViewObj.selectedPassengerItems[0].selected = false;
      this.passengerSelectorViewObj.selectedPassengerItems[1].selected = false;
      this.passengerSelectorViewObj.isActive = false;

      for (let i = 0; i <= this.passengerSelectorViewObj.selectedPassengerItems.length; i++) {
        this.passengerSelectorViewObj.selectedPassengerItems.pop();

      }

    });

  }
  getShift() {
    this.shiftTempArray = [];
    this.getPSGN(0).then(res => {
      this.shiftTempArray.push(res);
      this.getPSGN(1).then(res => {
        this.shiftTempArray.push(res);
        //console.log("Checking data final array :" + JSON.stringify(this.checkArray));
        this.replacePsgn(this.shiftTempArray).then(res => {
          this.instantUpdateCode();
        });

      });
    });
  }

  getPSGN(index) {
    return new Promise(resolve => {
      var refIndex = (index + 1) % 2;
      var query = {
        COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[index].dbObj.json.COACH_ID,
        BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[index].dbObj.json.BERTH_NO
      };
      var option = { exact: true };

      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        var coachId = res[0].json.COACH_ID;
        var berthNo = res[0].json.BERTH_NO;
        var berthIndex = res[0].json.BERTH_INDEX;


        res[0].json.COACH_ID = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.COACH_ID;
        res[0].json.BERTH_NO = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.BERTH_NO;
        res[0].json.BERTH_INDEX = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.BERTH_INDEX;


        res[0].json.NEW_COACH_ID = coachId;
        res[0].json.NEW_BERTH_NO = berthNo;
        res[0].json.NEW_BERTH_INDEX = berthIndex;

        res[0].json.REMARKS = "SHIFTED";


        resolve(res[0]);
      });
    });
  }

  replacePsgn(obj) {
    return new Promise(resolve => {
      this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, obj).then(res => {

        resolve(true);
      }, (fail) => {
        console.log("failed to replace passenger" + JSON.stringify(fail));
        resolve(false);
      });
    });
  }

}

