import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
declare var WL;
declare var WLResourceRequest;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public alertCtrl: AlertController
    , public storageserviceprovider: StorageServiceProvider
  ) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr[0].dbObj.json);

    this.getISLList();
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
            SYSTIME: res[i].json.SYSTIME
          });
        }

      })

    } catch (EX) {
      console.log(EX);
    }
  }


  confirmShift(value) {
    //console.log("vacant berth "+JSON.stringify(value));

    let alertbox = this.alertCtrl.create();
    alertbox.setTitle('Warning');
    alertbox.setMessage('Are you sure want do normal shift?');
    alertbox.addButton('Cancel');

    alertbox.addButton({
      text: 'Okay',
      handler: data => {
        let tempVacantPosition;
        let tempStn;
        let tempPsgnPosition;
        let tempPsgnStn;
        try {
         
          for (let start = 0; start < this.routes.length; start++) {
            
            if (this.routes[start].STN.indexOf(value.DEST) == 0) {
              tempVacantPosition = start;
              tempStn = value.DEST;

            }
            if (this.routes[start].STN.indexOf(this.psgnArr[0].DEST) == 0) {
              tempPsgnPosition = start;
              tempPsgnStn = this.psgnArr[0].DEST;
            }
          }


          if (tempVacantPosition > tempPsgnPosition) {           

            this.newVacBerh.push(value); // vacant seat value
            this.updateVacantBerth(value);
            this.updatePassenger(this.psgnArr);
            this.vcArr.push(value);
            this.temp = this.vcArr;
            value.SRC = tempPsgnStn;
            value.DEST = tempStn;
            this.newPostVacBerh.push(value);
            this.addNewPostVacantBerth(this.newPostVacBerh);

            //alert('bye not same');
          } else if (tempVacantPosition == tempPsgnPosition) {
            //console.log("--->"+JSON.stringify(value));
            this.newVacBerh.push(value); // vacant seat value

            this.updatePassenger(this.psgnArr);
            this.updateVacantBerth(value);
            this.vcArr.push(value)
            this.temp = this.vcArr;
          } else {
            alert("you Can't shift  pgsn")
          }


        } catch (ex) {
          console.log("Exception thrown:: " + ex)
        }

      }
    });
    alertbox.present();




  }



  updatePassenger(psgn) {
  

    try {

      var query = { PNR_NO: psgn[0].dbObj.json.PNR_NO, REL_POS: psgn[0].dbObj.json.REL_POS, BERTH_INDEX: psgn[0].dbObj.json.BERTH_INDEX };

      var option = { exact: true };

      console.log("\n" + JSON.stringify(query));

      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.PASSENGER_TABLE, query, option).then((res) => {
        //WL.JSONStore.get('passenger').find(query, option).then((res) => {
        //  console.log("------->" + JSON.stringify(res));

        var coachId = res[0].json.COACH_ID;
        var berthNo = res[0].json.BERTH_NO;

        res[0].json.COACH_ID = this.newVacBerh[0].COACH_ID;
        res[0].json.BERTH_NO = this.newVacBerh[0].BERTH_NO;

        res[0].json.NEW_COACH_ID = coachId;
        res[0].json.NEW_BERTH_NO = berthNo;


        res[0].json.REMARKS = "SHIFTED FROM " + res[0].json.NEW_COACH_ID + " - " + res[0].json.NEW_BERTH_NO + " To " + res[0].json.COACH_ID + " - " + res[0].json.BERTH_NO;

        this.storageserviceprovider.replace('passenger', res).then(() => {
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

    try {

      var query = { COACH_ID: value.COACH_ID, BERTH_NO: value.BERTH_NO, SRC: value.SRC, DEST: value.DEST, ALLOTED: 'N' };

      console.log(JSON.stringify(query));

      var option = { exact: true };
      this.storageserviceprovider.getDocuments(this.storageserviceprovider.collectionName.VACANT_BERTH_TABLE, query, option).then((res) => {
        // WL.JSONStore.get('vacantberth').find(query, option).then((res) => {

        console.log("check------>" + JSON.stringify(res));

        res[0].json.ALLOTED = "Y";
        res[0].json.REMARKS = "SHIFTED";
        this.vcData = res;

        this.storageserviceprovider.replace('vacantberth', this.vcData).then(() => {
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


    try {
      var vacIndex = this.routes.findIndex(x => x.STN == this.vcArr[0].DEST);
      var psgnIndex = this.routes.findIndex(x => x.STN == this.psgnData[0].RES_UPTO);
      if (vacIndex > psgnIndex) {
        this.temp[0].SRC = this.psgnData[0].RES_UPTO;
        this.storageserviceprovider.add('vacantberth', this.temp).then((res) => {
          // WL.JSONStore.get('vacantberth').add(this.temp).then((res) => {
          console.log("vacant berth created successfully" + JSON.stringify(res));
          this.addNewVacantBerth();
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

    try {


      this.newVacBerh[0].COACH_ID = this.psgnData[0].COACH_ID;
      this.newVacBerh[0].BERTH_NO = this.psgnData[0].BERTH_NO;
      this.newVacBerh[0].SRC = this.psgnData[0].BOARDING_PT;
      this.newVacBerh[0].DEST = this.psgnData[0].RES_UPTO;
      this.storageserviceprovider.add('vacantberth', this.newVacBerh).then((res) => {
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


  addNewPostVacantBerth(newPostVacBerh) {

    try {

      this.storageserviceprovider.add('vacantberth', this.newPostVacBerh).then((res) => {
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

  vacantBerthList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Vacant Berth List');
    alert.addInput({
      type: 'radio',
      label: 'Select vacant berth',
      value: 'select',
      checked: true
    });

    for (var i = 0; i < this.vcBerth.length; i++) {

      alert.addInput({
        type: 'radio',
        label: this.vcBerth[i].COACH_ID + " "
          + this.vcBerth[i].BERTH_NO + " "
          + this.vcBerth[i].SRC + " "
          + this.vcBerth[i].DEST + " "
          + this.vcBerth[i].ALLOTED + " "
          + this.vcBerth[i].REASON,
        value: this.vcBerth[i],
        checked: false
      });
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
