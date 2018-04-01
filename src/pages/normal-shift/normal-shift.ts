import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { UtilProvider } from '../../providers/util/util';
import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
//declare var WL;
//declare var WLResourceRequest;
/**
 * Generated class for the NormalShiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-normal-shift',
  templateUrl: 'normal-shift.html',
})
export class NormalShiftPage {
  psgnArr: any[] = [];
  vcBerth: any[] = [];
  psgnData: any[] = [];
  newVacBerh: any[] = [];
  psgnVal: any[] = [];
  vacDoc: any[] = [];
  routeReduced: any[] = [];
  vcArr: any[] = [];
  temp: any[] = [];
  psgn;
  value;
  vacBerth;
  ISL: any[] = [];
  routes: any[] = [];
  vcData: any[] = [];
  newPostVacBerh: any[] = [];
  trainAssignmentObject: any;
  vacantBerthClass;
  updRemark;
  oldRemark;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public alertCtrl: AlertController
    , public storageserviceprovider: StorageServiceProvider,private pdsp:PsngDataServiceProvider,
    public utils: UtilProvider
  ) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr[0].dbObj.json);

    this.getISLList();
    this.trainAssignmentObject=pdsp.trainAssignmentObject;
  }

  getISLList() {
    try {
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.TRAIN_ASSNGMNT_TABLE).then((res) => {
        // WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.ISL = res[0].json.ISL;
        for (let i = 0; i < this.ISL.length; i++) {
          this.routes.push({
            STN: this.ISL[i].STN_CODE.replace(/ /g, '')
          });
        }
        this.getVacantBerth();
      }, (fail) => {
        console.log("failed to fetch stations " + fail)
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getVacantBerth() {
    try {
      var query = { ALLOTED: 'N' };
      var options = { exact: true };
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, query, options).then((res) => {
        //WL.JSONStore.get('vacantberth').find(query, options).then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.vcBerth.push({
            TRAIN_ID: res[i].json.TRAIN_ID,
            COACH_ID: res[i].json.COACH_ID,
            BERTH_NO: res[i].json.BERTH_NO,
            CLASS: res[i].json.CLASS,
            REMOTE_LOC_NO: res[i].json.REMOTE_LOC_NO,
            BERTH_INDEX: res[i].json.BERTH_INDEX,
            SRC: res[i].json.SRC,
            DEST: res[i].json.DEST,
            ALLOTED: res[i].json.ALLOTED,
            REASON: res[i].json.REASON,
            CAB_CP: res[i].json.CAB_CP,
            CAB_CP_ID: res[i].json.CAB_CP_ID,
            CH_NUMBER: res[i].json.CH_NUMBER,
            PRIMARY_QUOTA: res[i].json.PRIMARY_QUOTA,
            SUB_QUOTA: res[i].json.SUB_QUOTA,
            SYSTIME: res[i].json.SYSTIME,
            UPDATE_TIME: res[i].json.UPDATE_TIME
          });
        }

      })

    } catch (EX) {
      console.log(EX);
    }
  }

  
  confirmShift(value) {
    console.log(this.psgnArr[0].dbObj.json.REMARKS);


    //console.log("vacant berth "+JSON.stringify(value));
    this.vacantBerthClass = value.CLASS;
    let alertbox = this.alertCtrl.create();
    alertbox.setTitle('Warning');
    alertbox.setMessage('Are you sure want do normal shift?');
    alertbox.addButton('Cancel');

    alertbox.addButton({
      text: 'Okay',
      handler: data => {

        /* console.log("--> " + JSON.stringify(value));
        console.log("--> " + JSON.stringify(data));
        console.log("--> " + JSON.stringify(this.psgnArr)); */


        console.log("Sucess");
        let tempVacantPosition;
        let tempSrcVacantPosition;
        let tempDestVacantPosition;
        let tempStn;
        let tempPsgnPosition;
        let tempDestPsgnPosition;
        let tempSrcPsgnPosition
        let tempPsgnStn;
        try {


          for (let start = 0; start < this.trainAssignmentObject.ISL.length; start++) {

            if (this.psgnArr[0].SRC === this.trainAssignmentObject.ISL[start].STN_CODE.trim()) {
              tempSrcPsgnPosition = this.trainAssignmentObject.ISL[start].STN_SRL_NO
              //alert("See src " + tempSrcPsgnPosition);
            }
            if (this.psgnArr[0].DEST === this.trainAssignmentObject.ISL[start].STN_CODE.trim()) {
              tempDestPsgnPosition = this.trainAssignmentObject.ISL[start].STN_SRL_NO
              //alert("See  dest" + tempDestPsgnPosition);
            }
            if (value.DEST === this.trainAssignmentObject.ISL[start].STN_CODE.trim()) {

              tempDestVacantPosition = this.trainAssignmentObject.ISL[start].STN_SRL_NO
              //alert("vacnt  src" + tempDestVacantPosition);
            }

            if (value.SRC === this.trainAssignmentObject.ISL[start].STN_CODE.trim()) {

              tempSrcVacantPosition = this.trainAssignmentObject.ISL[start].STN_SRL_NO
              //alert("Vacant  dest" + tempSrcVacantPosition);
            }

          }
          // console.log(tempSrcVacantPosition + " " + tempDestVacantPosition + "  - " + tempDestPsgnPosition + " " + tempSrcPsgnPosition)


          tempStn = value.DEST;
          tempPsgnStn = this.psgnArr[0].DEST;

          console.log(tempSrcVacantPosition + " " + tempDestVacantPosition + "  - " + tempDestPsgnPosition + " " + tempSrcPsgnPosition)

          if (tempSrcVacantPosition <= tempDestPsgnPosition && tempDestVacantPosition >= tempDestPsgnPosition) {

            this.newVacBerh.push(value); // vacant seat value
            this.updateVacantBerth(value);
            this.updatePassenger(this.psgnArr);
            this.vcArr.push(value);
            //this.temp = this.vcArr;
            this.temp = Object.assign([], this.vcArr);

            value.SRC = tempPsgnStn;
            value.DEST = tempStn;
            if (tempDestVacantPosition != tempDestPsgnPosition) {
              this.newPostVacBerh.push(value);
            }

            // commented on 6 march 2018 double vaccant berth solve
            //this.addNewPostVacantBerth(this.newPostVacBerh);
            //alert('bye not same');
          }
          else {
            // alert("you can't shift  pgsn")
            this.normalShirtAlert()
          }


        } catch (ex) {
          console.log("Exception thrown:: " + ex)
        }
        // this.updateRemark(value, this.psgnArr);

      }
    });
    alertbox.present();

  }

  normalShirtAlert() {
    let alert = this.alertCtrl.create({
      title: 'Warning Alert',
      subTitle: " you can't shift  pgsn",
      buttons: ['Ok']
    });
    alert.present();
  }

 

  updatePassenger(psgn) {

    try {

      var query = {
        PNR_NO: psgn[0].dbObj.json.PNR_NO, REL_POS: psgn[0].dbObj.json.REL_POS,
        BERTH_INDEX: psgn[0].dbObj.json.BERTH_INDEX
      };

      var option = { exact: true };

      //console.log("\n" + JSON.stringify(query));

      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        //WL.JSONStore.get('passenger').find(query, option).then((res) => {
        //console.log("------->" + JSON.stringify(res));

        var coachId = res[0].json.COACH_ID;
        var berthNo = res[0].json.BERTH_NO;

        res[0].json.COACH_ID = this.newVacBerh[0].COACH_ID;
        res[0].json.BERTH_NO = this.newVacBerh[0].BERTH_NO;

        res[0].json.NEW_COACH_ID = coachId;
        res[0].json.NEW_BERTH_NO = berthNo;

        if (res[0].json.NEW_BERTH_NO == '0' || res[0].json.BERTH_NO == '0') {

          if (res[0].json.NEW_BERTH_NO == '0') {
            console.log(JSON.stringify(psgn[0]));

            if (psgn[0].dbObj.json.REMARKS == "-") {
              if (this.vacantBerthClass == res[0].json.CLASS) {
                res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + " ST" + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
              } else {
                res[0].json.CLASS = this.vacantBerthClass;
                var tempRemarks = "CT " + res[0].json.NEW_COACH_ID + "-" + " ST" + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
                res[0].json.REMARKS = tempRemarks;
              }

            } else {
              if (this.vacantBerthClass == res[0].json.CLASS) {
                res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + " ST" + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
              } else {
                res[0].json.CLASS = this.vacantBerthClass;
                let tempRemarks = this.updRemark + " : " + " " + "CT " + res[0].json.NEW_COACH_ID + "-" + " ST" + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
                res[0].json.REMARKS = tempRemarks;
              }

            }
            // res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + " ST" + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
          }
          if (res[0].json.BERTH_NO == '0') {
            if (psgn[0].dbObj.json.REMARKS == "-") {
              if (this.vacantBerthClass == res[0].json.CLASS) {
                res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + " ST";
              } else {
                res[0].json.CLASS = this.vacantBerthClass;
                let tempRemarks = "CT " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + " ST";
                res[0].dbObj.json.REMARKS = tempRemarks;
              }

            } else {
              if (this.vacantBerthClass == res[0].json.CLASS) {


                res[0].json.REMARKS = res[0].json.REMARKS + " : " + "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + " ST";
              } else {

                res[0].json.CLASS = this.vacantBerthClass;
                let tempRemarks = res[0].json.REMARKS + " : " + this.updRemark + " : " + "CT " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + " ST";
                res[0].json.REMARKS = tempRemarks;
              }

            }
            // res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + " ST";
          }
        } else {

          if (psgn[0].dbObj.json.REMARKS == "-") {
            if (this.vacantBerthClass == res[0].json.CLASS) {
              res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
            } else {
              res[0].json.CLASS = this.vacantBerthClass;
              let tempRemarks = "CT " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
              res[0].json.REMARKS = tempRemarks;
            }
            //res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
          } else {
            if (this.vacantBerthClass == res[0].json.CLASS) {
              res[0].json.REMARKS = "SH " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
            } else {
              res[0].json.CLASS = this.vacantBerthClass;
              let tempRemarks = this.updRemark + " : " + "CT " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;
              res[0].json.REMARKS = tempRemarks;
            }

          }

        }

        //res[0].json.REMARKS = "SHFT " + res[0].json.NEW_COACH_ID + "-" + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + "-" + res[0].json.BERTH_NO;

        this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.PASSENGER_TABLE, res).then(() => {
          // WL.JSONStore.get('passenger').replace(res).then(() => {
          console.log("passenger updated successfully" + JSON.stringify(res));
          this.closeModal(res);
        }, (fail) => {
          console.log("failed to replace passenger" + JSON.stringify(fail));
        });
      }, (fail) => {
        console.log("failed to find passenger" + JSON.stringify(fail));
      });
    } catch (ex) {
      console.log("Exception thrown:: " + ex)
    }
  }

  updateVacantBerth(value) {
    //console.log("presentToast----->" + JSON.stringify(value));
    let currenTime = this.utils.getCurrentDateString();
    try {

      var query = { COACH_ID: value.COACH_ID, BERTH_NO: value.BERTH_NO, SRC: value.SRC, DEST: value.DEST, ALLOTED: 'N' };

      console.log(JSON.stringify(query));

      var option = { exact: true };
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, query, option).then((res) => {
        // WL.JSONStore.get('vacantberth').find(query, option).then((res) => {
        //console.log("check------>" + JSON.stringify(res));

        res[0].json.ALLOTED = "Y";
        res[0].json.REMARKS = " SHIFTED ";
        res[0].UPDATE_TIME = currenTime;
        res[0].SYSTIME = currenTime;
        this.vcData = res;
        //res[0].REASON="S";
        this.storageserviceprovider.replace(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.vcData).then(() => {
          // WL.JSONStore.get('vacantberth').replace(this.vcData).then(() => {
          this.addVacantBerth();
        }, (fail) => {
        });
      }, (fail) => {

      });
      // console.log("presentToast2 Exit");
    } catch (ex) {
      console.log("Exception thrown:: " + ex)
    }
  }

  addVacantBerth() {

    let currenTime = this.utils.getCurrentDateString();

    try {
      var vacIndex = this.routes.findIndex(x => x.STN == this.vcArr[0].DEST);
      var psgnIndex = this.routes.findIndex(x => x.STN == this.psgnData[0].RES_UPTO);
      if (vacIndex > psgnIndex) {
        this.temp[0].SRC = this.psgnData[0].RES_UPTO;
        this.temp[0].UPDATE_TIME = currenTime;
        this.temp[0].SYSTIME = currenTime;

        this.storageserviceprovider.add(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.temp).then((res) => {
          // WL.JSONStore.get('vacantberth').add(this.temp).then((res) => {
          console.log("vacant berth created successfully" + JSON.stringify(res));
          //this.addNewVacantBerth();
        }, (fail) => {
          console.log("failed to create new vacant berth " + JSON.stringify(fail));
        });
      } else {
        this.addNewVacantBerth();
      }
    } catch (ex) {
      console.log("Exception thrown:: " + ex)
    }

  }


  addNewVacantBerth() {
    if (this.psgnData[0].BERTH_NO > 0) {
      try {
        let currenTime = this.utils.getCurrentDateString();

        this.newVacBerh[0].COACH_ID = this.psgnData[0].COACH_ID;
        this.newVacBerh[0].BERTH_NO = this.psgnData[0].BERTH_NO;
        this.newVacBerh[0].SRC = this.psgnData[0].BOARDING_PT;
        this.newVacBerh[0].DEST = this.psgnData[0].RES_UPTO;
        this.newVacBerh[0].UPDATE_TIME = currenTime;
        this.newVacBerh[0].SYSTIME = currenTime;
        this.newVacBerh[0].SUB_QUOTA = this.psgnData[0].SUB_QUOTA;
        //this.newVacBerh[0].REASON="S"; 

        this.storageserviceprovider.add(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.newVacBerh).then((res) => {
          //WL.JSONStore.get('vacantberth').add(this.newVacBerh).then((res) => {
          //this.closeModal();
          //this.closeModal(this.newVacBerh);
        }, (fail) => {
          console.log("failed to add vacant berth " + JSON.stringify(fail));
        });
      } catch (ex) {
        console.log("Exception thrown:: " + ex)
      }
    }
  }


  addNewPostVacantBerth(newPostVacBerh) {
    if (this.newPostVacBerh[0].BERTH_NO > 0) {
      try {

        this.storageserviceprovider.add(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, this.newPostVacBerh).then((res) => {
          //WL.JSONStore.get('vacantberth').add(this.newPostVacBerh).then((res) => {
          //this.closeModal();
          //this.closeModal(this.newVacBerh);
        }, (fail) => {
          console.log("failed to add vacant berth " + JSON.stringify(fail));
        });
      } catch (ex) {
        console.log("Exception thrown:: " + ex)
      }
    }
  }

  vacantBerthList() {
    //console.log(JSON.stringify(this.vcBerth[0]));

    let alert = this.alertCtrl.create();
    alert.setTitle('Vacant Berth List');
    alert.addInput({
      type: 'radio',
      label: 'Select vacant berth',
      value: 'select',
      checked: true
    });

    for (var i = 0; i < this.vcBerth.length; i++) {
      if (this.vcBerth[i].CLASS == this.psgnArr[0].CLASS) {
        console.log("true");
        alert.addInput({
          type: 'radio',
          label: this.vcBerth[i].COACH_ID + " "
            + this.vcBerth[i].BERTH_NO + " "
            + this.vcBerth[i].SRC + " "
            + this.vcBerth[i].DEST,
          /* + " " + this.vcBerth[i].ALLOTED + " "
           + this.vcBerth[i].REASON, */
          value: this.vcBerth[i],
          checked: false
        });

      } else {
        console.log("false");
      }

    }

    alert.addButton('Cancel');

    alert.addButton({
      text: 'Okay',
      handler: data => {

        this.confirmShift(data);
        console.log('Checkbox data Boarding Psgn At: ', data);
        //BRD = data;


      }
    });
    alert.present();

  }

  /* closeModal() {
    this.presentToast();
    this.viewCtrl.dismiss();
  } */
  closeModal(newVacBerh) {
    console.log("presentToast3");
    console.log(newVacBerh);

    this.presentToast();
    this.viewCtrl.dismiss(newVacBerh);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'passenger shifted successfully!!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NormalShiftPage');
  }

}
