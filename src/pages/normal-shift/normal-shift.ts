import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl: ToastController) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr);
    this.getISLList();
  }

  getISLList() {
    try {
      WL.JSONStore.get('trainAssignment').findAll().then((res) => {
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
      WL.JSONStore.get('vacantberth').find(query, options).then((res) => {
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
    try {
      alert("confirm shift");
      this.updatePassenger(this.psgnArr);
      this.updateVacantBerth(value);
      this.newVacBerh.push(value);
      this.vcArr.push(value);
      this.temp = this.vcArr;
    } catch (ex) {
      console.log("Exception thrown:: " + ex)
    }
  }


  updatePassenger(psgn) {
    try {
      var query = { PNR_NO: psgn.PNR_NO, REL_POS: psgn.REL_POS };
      var option = { exact: true };
      WL.JSONStore.get('passenger').find(query, option).then((res) => {
        res[0].json.REMARKS = "SHIFTED";
        res[0].json.NEW_COACH_ID = this.newVacBerh[0].COACH_ID;
        res[0].json.NEW_BERTH_NO = this.newVacBerh[0].BERTH_NO;
        WL.JSONStore.get('passenger').replace(res).then(() => {
          console.log("passenger updated successfully" + JSON.stringify(res));
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
    try {
      var query = { COACH_ID: value.COACH_ID, BERTH_NO: value.BERTH_NO, SRC: value.SRC, DEST: value.DEST, ALLOTED: 'N' };
      var option = { exact: true };
      WL.JSONStore.get('vacantberth').find(query, option).then((res) => {
        res[0].json.ALLOTED = "Y";
        res[0].json.REMARKS = "SHIFTED";
        this.vcData = res;
        WL.JSONStore.get('vacantberth').replace(this.vcData).then(() => {
          this.addVacantBerth();
        }, (fail) => {
        });
      }, (fail) => {

      });
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
        WL.JSONStore.get('vacantberth').add(this.temp).then((res) => {
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
      this.vacDoc = this.newVacBerh;
      this.vacDoc[0].COACH_ID = this.psgnData[0].COACH_ID;
      this.vacDoc[0].BERTH_NO = this.psgnData[0].BERTH_NO;
      this.vacDoc[0].SRC = this.psgnData[0].BOARDING_PT;
      this.vacDoc[0].DEST = this.psgnData[0].RES_UPTO;
      WL.JSONStore.get('vacantberth').add(this.vacDoc).then((res) => {
        this.closeModal();
      }, (fail) => {
        console.log("failed to add vacant berth " + JSON.stringify(fail));
      });
    } catch (ex) {
      console.log("Exception thrown:: " + ex)
    }
  }


  closeModal() {
    this.presentToast();
    this.viewCtrl.dismiss();
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
