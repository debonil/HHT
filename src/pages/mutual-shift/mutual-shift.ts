import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

declare var WL;
declare var WLResourceRequest;
/**
 * Generated class for the MutualShiftPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mutual-shift',
  templateUrl: 'mutual-shift.html',
})
export class MutualShiftPage {
  psgnData: any[] = [];
  psgnArr: any[] = [];
  coach;
  coachId: any[] = [];
  passVal: any[] = [];
  psgnReturn: any[] = [];
  loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr);
    this.getCoaches();
  }

  getCoaches() {
    try {
      WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach = res[0].json.ASSIGNED_COACH
        for (let i = 0; i < this.coach.length; i++) {
          this.coachId.push({
            COACH_ID: this.coach[i].COACH_ID
          });
        }

      })

    } catch (EX) {
      console.log(EX);;
    }
  }

   presentLoadingDefault() {
     this.loading = this.loadingCtrl.create({
      content: 'loading passengers...'
    });

    this.loading.present();

   /*  setTimeout(() => {
      loading.dismiss();
      alert("passenger loaded successfully!!!");
    }, 2000); */
  }

  getPassenger(val) {
    try {
      this.presentLoadingDefault();
      this.passVal=[];
      var query = { COACH_ID: val.COACH_ID, BOARDING_PT: this.psgnData[0].BOARDING_PT, RES_UPTO: this.psgnData[0].RES_UPTO };
      var options = { exact: true };
      WL.JSONStore.get('passenger').find(query, options).then((res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].json.NEW_COACH_ID.match("-   ")) {
            this.passVal.push({
              WAITLIST_NO: res[i].json.WAITLIST_NO,
              FOOD_FLAG: res[i].json.FOOD_FLAG,
              CLASS: res[i].json.CLASS,
              REMARKS: res[i].json.REMARKS,
              CANCEL_PASS_FLAG: res[i].json.CANCEL_PASS_FLAG,
              VIP_MARKER: res[i].json.VIP_MARKER,
              ATTENDANCE_MARKER: res[i].json.ATTENDANCE_MARKER,
              REMOTE_LOC_NO: res[i].json.REMOTE_LOC_NO,
              SUB_QUOTA: res[i].json.SUB_QUOTA,
              PSGN_NAME: res[i].json.PSGN_NAME,
              PNR_NO: res[i].json.PNR_NO,
              BERTH_SRC: res[i].json.BERTH_SRC,
              TICKET_NO: res[i].json.TICKET_NO,
              PENDING_AMT: res[i].json.PENDING_AMT,
              AGE_SEX: res[i].json.AGE_SEX,
              PRIMARY_QUOTA: res[i].json.PRIMARY_QUOTA,
              BERTH_DEST: res[i].json.BERTH_DEST,
              NEW_COACH_ID: res[i].json.NEW_COACH_ID,
              BERTH_NO: res[i].json.BERTH_NO,
              NEW_BERTH_NO: res[i].json.NEW_BERTH_NO,
              RES_UPTO: res[i].json.RES_UPTO,
              COACH_ID: res[i].json.COACH_ID,
              CAB_CP_ID: res[i].json.CAB_CP_ID,
              NEW_CLASS: res[i].json.NEW_CLASS,
              MSG_STN: res[i].json.MSG_STN,
              SYSTIME: res[i].json.SYSTIME,
              DUP_TKT_MARKER: res[i].json.DUP_TKT_MARKER,
              BERTH_INDEX: res[i].json.BERTH_INDEX,
              BOARDING_PT: res[i].json.BOARDING_PT,
              TRAIN_ID: res[i].json.TRAIN_ID,
              REL_POS: res[i].json.REL_POS,
              PSGN_NO: res[i].json.PSGN_NO,
              JRNY_TO: res[i].json.JRNY_TO,
              CH_NUMBER: res[i].json.CH_NUMBER,
              NEW_PRIMARY_QUOTA: res[i].json.NEW_PRIMARY_QUOTA,
              CAB_CP: res[i].json.CAB_CP,
              TICKET_TYPE: res[i].json.TICKET_TYPE,
              JRNY_FROM: res[i].json.JRNY_FROM
            });
          }
        }
        this.loading.dismiss();
        this.presentToast1();
      }, (fail) => {
        console.log("failed to load passenger " + JSON.stringify(fail));
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  getShift(value) {
    try {
      this.psgnReturn.push(value);
      this.updateFirstPsgn();
      this.updateSecondPsgn();
    } catch (EX) {
      console.log(EX);;
    }
  }

  updateFirstPsgn() {
    try {
      var query = { COACH_ID: this.psgnReturn[0].COACH_ID, BERTH_NO: this.psgnReturn[0].BERTH_NO };
      var option = { exact: true };
      WL.JSONStore.get('passenger').find(query, option).then((res) => {
        res[0].json.REMARKS = "SHIFTED";
        res[0].json.NEW_COACH_ID = this.psgnData[0].COACH_ID;
        res[0].json.NEW_BERTH_NO = this.psgnData[0].BERTH_NO;
        WL.JSONStore.get('passenger').replace(res).then(() => {
          console.log("passenger updated successfully" + JSON.stringify(res));
        }, (fail) => {
          console.log("failed to replace passenger" + JSON.stringify(fail));
        });
      }, (fail) => {
        console.log("failed to find passenger:: " + JSON.stringify(fail));
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  updateSecondPsgn() {
    try {
      var query = { COACH_ID: this.psgnData[0].COACH_ID, BERTH_NO: this.psgnData[0].BERTH_NO };
      var option = { exact: true };
      WL.JSONStore.get('passenger').find(query, option).then((res) => {
        res[0].json.REMARKS = "SHIFTED";
        res[0].json.NEW_COACH_ID = this.psgnReturn[0].COACH_ID;
        res[0].json.NEW_BERTH_NO = this.psgnReturn[0].BERTH_NO;
        WL.JSONStore.get('passenger').replace(res).then((opt) => {
          console.log("passenger updated successfully" + JSON.stringify(opt));
          this.closeModal();
        }, (fail) => {
          console.log("failed to replace passenger" + JSON.stringify(fail));
        });
      }, (fail) => {
        console.log("failed to find passenger:: " + JSON.stringify(fail));
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  closeModal() {
    this.presentToast();
    this.viewCtrl.dismiss();
  }

  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'passengers shifted successfully!!',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

presentToast1() {
  let toast = this.toastCtrl.create({
    message: 'passengers loaded successfully!!',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MutualShiftPage');
  }

}
