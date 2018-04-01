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
import { UtilProvider } from '../../providers/util/util';
import { SearchPage } from "../search/search";
import { PnrDataPage } from "../pnr-data/pnr-data";
import { EftWithPnrPage } from '../eft-with-pnr/eft-with-pnr';

@IonicPage()
@Component({
  selector: 'page-coachwise-chart-view',
  templateUrl: 'coachwise-chart-view.html',
})
export class CoachwiseChartViewPage {
  // set some user information on chatParams
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  temp: any[] = [];
  assignedSelectedCoach: String;
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
  totalPsgn: any;
  totalPsgnState: any;
  countPsgnArray: any[] = [];
  dataSRC: string;
  dataDTN: string;
  addVacantTempArray: any[] = [];
  /* selectedBoardingPoints: Array<string>;
  showNotCheckedOnly: boolean;
  filterStatus: string="0"; */
  passengerSelectorViewObj: any = {
    isActive: false,
    selectedPassengerItems: [],
    activate: this.passengerSelectorViewObjActivate,
    checkChanged: this.passengerSelectorViewObjCheckChanged,
    selectedPassengerItemsNC: [],

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
    public util: UtilProvider,
    //public EftWithPnrPage
    // public pnrData:PnrDataPage
  ) {
    //  console.log('constructor CoachwiseChartViewPage' + new Date());
    this.timeTrack = new Date().getTime();
    //  console.log(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems));

  }
  ionViewDidLoad() {
    //  console.log('ionViewDidLoad CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
    this.loading = this.loadingCtrl.create({
      content: 'Organizing chart ......'
    });
    this.loading.present();
  }

  ionViewDidEnter() {
    //  console.log('ionViewDidEnter CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));


    //  console.log('this.pdsp.findAll() CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
    //  this.pdsp.findAll().subscribe(data => {

    /* this.pdsp.findAll(true).subscribe(data => {
     if (data) {
       console.log(JSON.stringify(data.trainAssignmentObj.TS_FLAG));
       this.coachwiseChartData = data.coachwiseChartData;
       this.trainAssignment = data.trainAssignmentObj;
       if (this.trainAssignment.ISL_ARR.indexOf("ALL") == -1)
         this.trainAssignment.ISL_ARR.push("ALL");
 
       if (this.pdsp.selectedBoardingPoints == undefined || this.pdsp.selectedBoardingPoints.length == 0)
         this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR.slice(0, 1);
       this.coachwiseChartDataLoaded = true;
       this.selectedCoach = data.coachwiseChartData[0].key;
 
     } else {
       alert("NO CHART DATA FOUND!!");
       this.navCtrl.setRoot(ChartPage);
     }
 
   },
     error => {
     },
     () => {
       if (this.loading) {
         this.loading.dismiss();
         this.filterData();
       }
     });
 }  */

    this.pdsp.findAll(true).subscribe(data => {
      if (data) {
        if (data.trainAssignmentObj.TS_FLAG) {
          //  console.log(JSON.stringify(data.trainAssignmentObj.TS_FLAG));
          this.coachwiseChartData = data.coachwiseChartData;
          this.trainAssignment = data.trainAssignmentObj;
          if (this.trainAssignment.ISL_ARR.indexOf("ALL") == -1)
            this.trainAssignment.ISL_ARR.push("ALL");

          if (this.pdsp.selectedBoardingPoints == undefined || this.pdsp.selectedBoardingPoints.length == 0)
            this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR.slice(0, 1);
          this.coachwiseChartDataLoaded = true;
          this.selectedCoach = data.coachwiseChartData[0].key;
          this.assignedSelectedCoach = data.trainAssignmentObj.ASSIGNED_COACHES[0]
        } else {
          //   console.log(JSON.stringify(data.trainAssignmentObj.TS_FLAG));
          // var tempArr:any[]=[];
          var tempArr = Object.assign([], data.trainAssignmentObj.ASSIGNED_COACHES);
          tempArr.push('W/L');
          console.log(JSON.stringify(tempArr));
          this.coachwiseChartData = data.coachwiseChartData;
          this.trainAssignment = data.trainAssignmentObj;
          this.coachwiseChartData.forEach(element => {
            //   if(!(data.trainAssignmentObj.ASSIGNED_COACHES.indexOf(element.key)==-1)){
            if (!(tempArr.indexOf(element.key) == -1)) {

              this.temp.push(element);
            }
          });
          this.coachwiseChartData = [];
          this.coachwiseChartData = this.temp;
          //   console.log(JSON.stringify(this.coachwiseChartData));
          if (this.trainAssignment.ISL_ARR.indexOf("ALL") == -1)
            this.trainAssignment.ISL_ARR.push("ALL");

          if (this.pdsp.selectedBoardingPoints == undefined || this.pdsp.selectedBoardingPoints.length == 0)
            this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR.slice(0, 1);
          this.coachwiseChartDataLoaded = true;
          this.selectedCoach = data.coachwiseChartData[0].key;
          this.assignedSelectedCoach = data.trainAssignmentObj.ASSIGNED_COACHES[0]
        }


      } else {
        alert("NO CHART DATA FOUND!!");
        this.navCtrl.setRoot(ChartPage);
      }

    },
      error => {
      },
      () => {
        if (this.loading) {
          this.loading.dismiss();
          this.filterData();
        }
      });
  }


  ionViewCanEnter() {
    // console.log('ionViewCanEnter CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
  }
  refreshChart() {
    // console.log('refreshChart CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));
    this.loading = this.loadingCtrl.create({
      content: 'Refreshing chart ......'
    });
    //this.loading.present();
    this.pdsp.findAll(true).subscribe(data => {
      //   console.log("refreshChart IN subscribe");
      //    console.log(data);
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
    console.log(this.pdsp.filterStatus);
    //    console.log('filterData CoachwiseChartViewPage' + (new Date().getTime() - this.timeTrack));

    //    console.log(this.pdsp.selectedBoardingPoints);

    if (!(this.pdsp.selectedBoardingPoints.indexOf("ALL") == -1)) {
      this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR;
    }
    if ((this.pdsp.selectedBoardingPoints.indexOf("ALL") == -1) && (this.pdsp.selectedBoardingPoints.length == this.trainAssignment.ISL_ARR.length - 1)) {
      this.pdsp.selectedBoardingPoints = this.trainAssignment.ISL_ARR[0];
    }
    return new Promise(resolve => {
      var count = 0;
      this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
        coachpsngbrth.noOfVisibleRecord = 0;
        coachpsngbrth.value.forEach((psngbrth, ind2) => {
          // console.log(psngbrth);
          psngbrth._hidden = !(this.pdsp.selectedBoardingPoints.indexOf(psngbrth.BRD) > -1)
            //||(this.showNotCheckedOnly&&psngbrth._isLocked)
            || ((Number(this.pdsp.filterStatus) > -1 && (Number(this.pdsp.filterStatus) < 3)) && psngbrth._status != this.pdsp.filterStatus)

            || (Number(this.pdsp.filterStatus) > 2 && psngbrth.dbObj.json.PSGN_NO != -1);
          if (!psngbrth._hidden) {
            coachpsngbrth.noOfVisibleRecord++;
            count++;
          }
          //console.log(psngbrth._status);
        });
      });

      if (this.pdsp.filterStatus == '-1') {
        this.totalPsgnState = " ALL "
      } if (this.pdsp.filterStatus == '0') {
        this.totalPsgnState = " NC "
      }
      if (this.pdsp.filterStatus == '1') {
        this.totalPsgnState = " TU "
      }
      if (this.pdsp.filterStatus == '2') {
        this.totalPsgnState = " NT "
      }
      if (this.pdsp.filterStatus == '3') {
        this.totalPsgnState = " CURR "
      }

      this.totalPsgn = count;

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

  /*  previewAndSubmitChart() {
     this.navCtrl.push(this.chartPreviewPage, { coachwiseChartData: this.coachwiseChartData });
   } */
  previewAndSubmitChart() {
    // this.navCtrl.push(this.chartPreviewPage, { coachwiseChartData: this.coachwiseChartData });
    let modal = this.modalCtrl.create(this.chartPreviewPage, this.coachwiseChartData);
    modal.present();
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
    // console.log(event);
    this.selectedCoach = event.id;
    this.assignedSelectedCoach = event.id;
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
    // console.log("passengerSelectorViewObjActivate");
  }
  passengerSelectorViewObjCheckChanged() {
    //  console.log("passengerSelectorViewObjCheckChanged");
  }

  releaseSelectorMode() {
    this.passengerSelectorViewObj.isActive = false;
    while (this.passengerSelectorViewObj.selectedPassengerItems.length > 0) {
      this.passengerSelectorViewObj.selectedPassengerItems.pop().selected = false;
    }
  }


  updateRemark() {
    // console.log(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj));
    var option = { exact: true };
    var query = {
      COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
      BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO,
      //PNR_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.PNR_NO
    };
    let alert = this.alertCtrl.create({
      title: 'Update Remark',
      inputs: [
        {
          name: 'REMARKS',
          placeholder: 'Update Remark'
        }
      ],
      message: 'Old Remark : ' + this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
            this.releaseSelectorMode();
          }
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: data => {
            //console.log("--> " + JSON.stringify(data.REMARKS));
            if (this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS == '-') {

              this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data.REMARKS;

              this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
                res[0].json.REMARKS = data.REMARKS;
                this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
                  console.log("passenger boarded at updated successfully" + JSON.stringify(opt));
                  //console.log("passenger boarded at updated successfully" + JSON.stringify(res));

                }, (fail) => {
                  console.log("failed to replace passenger" + JSON.stringify(fail));
                });

              }, (fail) => {
                console.log("failed to find passenger:: " + JSON.stringify(fail))
              });

            } else {
              var tempstr = this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS
              this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = tempstr + ": " + data.REMARKS;

              this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
                res[0].json.REMARKS = tempstr + ": " + data.REMARKS;
                this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
                  console.log("passenger boarded at updated successfully" + JSON.stringify(opt));
                  console.log("passenger boarded at updated successfully" + JSON.stringify(res));

                }, (fail) => {
                  console.log("failed to replace passenger" + JSON.stringify(fail));
                });

              }, (fail) => {
                console.log("failed to find passenger:: " + JSON.stringify(fail))
              });

            }
            //this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS=data.REMARKS;
            this.releaseSelectorMode();


          }
        }
      ]
    });


    alert.present();
  }


  /*code start Normal shift method */
  normalShift() {
    //console.log(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems));
    if (this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS.startsWith("SHFT")) {
      //alert('Passeneger is shifted already');
      this.repeatedNormalShiftAlert();
      this.releaseSelectorMode();
    } else {
      // we are getting selected row
      let myModal = this.modalCtrl.create(NormalShiftPage, this.passengerSelectorViewObj.selectedPassengerItems);
      myModal.onDidDismiss(data => {

        if (this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID === data[0].json.COACH_ID) {

          this.passengerSelectorViewObj.selectedPassengerItems[0].BN = data[0].json.BERTH_NO;
          this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data[0].json.REMARKS;

          this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID = data[0].json.COACH_ID;
          this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO = data[0].json.BERTH_NO;
          this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.NEW_COACH_ID = data[0].json.NEW_COACH_ID;
          this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.NEW_BERTH_NO = data[0].json.NEW_BERTH_NO
          this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = data[0].json.REMARKS;

          this.passengerSelectorViewObj.selectedPassengerItems[0].selected = false;
          this.releaseSelectorMode();
          /* this.passengerSelectorViewObj.isActive = false;
          this.passengerSelectorViewObj.selectedPassengerItems.pop(); */
          this.alertToast(" Passenger Successfully Shifted");

        } else {


          this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data[0].json.REMARKS;
          this.pdsp.addPsngBerth(data[0].json);
          this.pdsp.convertPsngToVBerth(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json);
          //this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = data[0].json.REMARKS;
          this.passengerSelectorViewObj.selectedPassengerItems[0].selected = false;
          this.releaseSelectorMode();
          /*  this.passengerSelectorViewObj.isActive = false;
           this.passengerSelectorViewObj.selectedPassengerItems.pop(); */
          this.alertToast(" Passenger Successfully Shifted");



        }

      });
      myModal.present();
    }
  }
  /*code end Normal shift method */
  repeatedNormalShiftAlert() {
    let alert = this.alertCtrl.create({
      title: 'Warning Alert',
      subTitle: "Sorry!! Berth is already shifted !",
      buttons: ['Ok']
    });
    alert.present();
  }
  gotDownPsgn() {
    //this.showCheckboxGoDownPsgn();
    //this.releaseSelectorMode();
    this.alertBoxForGotDownAtPsgn();

  }
  alertBoxForGotDownAtPsgn() {

    this.alertPromptCall().then(resolve => {
      //console.log(resolve);     
      var option = { exact: true };
      var query = {
        COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
        BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO,
        //PNR_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.PNR_NO
      };
      this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.RES_UPTO = resolve
      //this.passengerSelectorViewObj.selectedPassengerItems[0].DEST = resolve;
      //console.log(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj));
      this.addVacantTempArray.push(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj);
      this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = "GA " + resolve;
      //this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = "Got Down At " + resolve;

      this.addVaccanBerth(this.addVacantTempArray, resolve);
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        res[0].json.REMARKS = "GA " + resolve;

        this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
          console.log("passenger got down at updated successfully" + JSON.stringify(resolve));
        }, (fail) => {
          console.log("failed to replace passenger" + JSON.stringify(fail));
        });
      }, (fail) => {
        console.log("failed to find passenger" + JSON.stringify(fail))
      });

      this.releaseSelectorMode();
      this.addVacantTempArray.pop();
      this.alertToast(" Passenger Got Down At " + resolve + " " + "Updated Successfully ");


    });

  }
  /* showCheckboxGoDownPsgn() {
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


  } */

  addVaccanBerth(result, gotDownPoint) {
    let currentTime = this.util.getCurrentDateString();
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
      SYSTIME: currentTime,//"2018-01-01 15:40:03.477"
      UPDATE_TIME: currentTime
    }
    this.addVacantBerthArry.push(query)
    // console.log(JSON.stringify(this.addVacantBerthArry));

    // change code using psdp service
    //WL.JSONStore.get('vacantberth').add(this.addVacantBerthArry)

    this.storageserviceprovider.add(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.addVacantBerthArry).then((opt) => {

      //   console.log("passenger boarded at added successfully" + JSON.stringify(opt));
      //    console.log("passenger boarded at updated successfully" + JSON.stringify(query));

    }, (fail) => {
      console.log("failed to add vacant berth" + JSON.stringify(fail));
    });

  }

  boardedAtPsgn() {

    //this.showCheckboxBoardPsgn();
    //this.releaseSelectorMode();
    //this.calldata()
    this.alertBoxForBordedAtPsgn()


  }

  alertBoxForBordedAtPsgn() {
    var option = { exact: true };
    var query = {
      COACH_ID: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
      BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO,
      //PNR_NO: this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.PNR_NO
    };
    this.alertPromptCall().then(resolve => {
      this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BOARDING_PT = resolve
      this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = "BA " + resolve;
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        res[0].json.REMARKS = "BA " + resolve;
        //res[0].json.REMARKS = "Boarded At " + resolve;;

        this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then((opt) => {
          console.log("passenger boarded at updated successfully" + JSON.stringify(resolve));
        }, (fail) => {
          console.log("failed to replace passenger" + JSON.stringify(fail));
        });
      }, (fail) => {
        console.log("failed to find passenger" + JSON.stringify(fail))
      });

      this.releaseSelectorMode();
      this.alertToast(" Passenger Boarded At " + resolve + " " + "Updated Successfully ");

    });

  }
  alertPromptCall() {

    return new Promise(resolve => {
      var psgnGDS = this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.RES_UPTO;
      var psgnBP = this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.JRNY_FROM;

      let alert = this.alertCtrl.create();
      alert.setTitle('Please select station');
      alert.addInput({
        type: 'radio',
        label: 'select station',
        value: 'select',
        checked: true
      });

      var index = this.trainAssignment.ISL_ARR;
      var upto = index.indexOf(psgnGDS);
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

          resolve(data);
        }
      });


      alert.present();
    });

  }

  /*
    showCheckboxBoardPsgn() {
  
      console.log(JSON.stringify(this.trainAssignment.ISL_ARR));
      var psgnGDS;
      var psgnBP;
  
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
  */

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
          this.alertToast(" Passengers Successfully Shifted");

        } else {
          //alert(" Sorry!! Berth destination is not same. you can't do shiftting ! ")
          this.presentAlert();
          this.releaseSelectorMode();

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

      this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = "SH " + this.tempArray[1].dbObj.json.COACH_ID + " - " + this.tempArray[1].dbObj.json.BERTH_NO + " TO " + this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID + " - " + this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO;
      this.passengerSelectorViewObj.selectedPassengerItems[1].REMARKS = "SH " + this.tempArray[0].dbObj.json.COACH_ID + " - " + this.tempArray[0].dbObj.json.BERTH_NO + " TO " + this.passengerSelectorViewObj.selectedPassengerItems[1].dbObj.json.COACH_ID + " - " + this.passengerSelectorViewObj.selectedPassengerItems[1].dbObj.json.BERTH_NO;
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
        BERTH_NO: this.passengerSelectorViewObj.selectedPassengerItems[index].dbObj.json.BERTH_NO,
        ATTENDANCE_MARKER: 'P'
      };
      var option = { exact: true };

      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        var tempCOACH_ID = res[0].json.COACH_ID;
        var tempBERTH_NO = res[0].json.BERTH_NO;
        var tempBERTH_INDEX = res[0].json.BERTH_INDEX;


        res[0].json.COACH_ID = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.COACH_ID;
        res[0].json.BERTH_NO = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.BERTH_NO;
        res[0].json.BERTH_INDEX = this.passengerSelectorViewObj.selectedPassengerItems[refIndex].dbObj.json.BERTH_INDEX;


        res[0].json.NEW_COACH_ID = tempCOACH_ID;
        res[0].json.NEW_BERTH_NO = tempBERTH_NO;
        res[0].json.NEW_BERTH_INDEX = tempBERTH_INDEX;


        res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + " - " + res[0].json.NEW_BERTH_NO + " TO " + res[0].json.COACH_ID + " - " + res[0].json.BERTH_NO;



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


  searchPsgn() {
    let myModal = this.modalCtrl.create(SearchPage);
    myModal.present();
  }


  pnrSearch() {
    let myModal = this.modalCtrl.create(PnrDataPage, this.passengerSelectorViewObj.selectedPassengerItems);
    myModal.present();
  }

    modalEFT(){
     let myModal = this.modalCtrl.create(EftWithPnrPage, this.passengerSelectorViewObj.selectedPassengerItems);
     myModal.onDidDismiss(data => {
       if(data!=undefined){
         var oldVal = JSON.parse(JSON.stringify(this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json));
         if(data.EFT_TYPE=='Upgrade'){
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID = data.json.COACH_ID;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO = data.json.BERTH_NO;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_INDEX = data.json.BERTH_INDEX;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = data.json.REMARKS;
           this.pdsp.addPsngBerth(data.json);
 
           this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data.json.REMARKS;
           
         }
         if(data.EFT_TYPE=='Luggage'){
           this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data.json.REMARKS;
           console.log(this.passengerSelectorViewObj.selectedPassengerItems[0]);
           //this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json = {};
         }
         if(data.EFT_TYPE=='FreeEFT'){
           this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = 'FreeEFT';
         }
         if(data.EFT_TYPE=='JourneyExtend'){
           var obj = {
             OLD_COACH : this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID,
             NEW_COACH : data.json.COACH_ID,
             NEW_BERTH : data.json.BERTH_NO,
             OLD_BERTH : this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_INDEX
           };
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.REMARKS = data.json.REMARKS;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.JRNY_TO = data.json.JRNY_TO;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.COACH_ID = data.json.COACH_ID;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_NO = data.json.BERTH_NO;
           this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.BERTH_INDEX = data.json.BERTH_INDEX;
           if(obj.OLD_COACH!=obj.NEW_COACH || obj.OLD_BERTH!=obj.NEW_BERTH){
             this.pdsp.addPsngBerth(data.json);
           }
           this.passengerSelectorViewObj.selectedPassengerItems[0].REMARKS = data.json.REMARKS;
         }
       }
       this.releaseSelectorMode();
     });
     myModal.present();
   }
  
}

