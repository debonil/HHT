import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { ShiftPsgnDetails } from '../../model/ShiftPsgnDetails';
import { ChartPage } from '../chart/chart'
import { MutualShiftPage } from '../mutual-shift/mutual-shift'
import { NormalShiftPage } from '../normal-shift/normal-shift'
import { LoadingController } from 'ionic-angular';


import { ModalController } from 'ionic-angular';

declare var WL;
declare var WLResourceRequest;

@IonicPage()
@Component({
  selector: 'page-shift-psgn',
  templateUrl: 'shift-psgn.html',
})
export class ShiftPsgnPage {
  coach;
  coachId: any[] = [];
  psgnArray: any[] = [];
  vcBerth: any[] = [];
  shiftVal: any;
  psgnValue;
  loading: any;
  alert;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController,public alertCtrl: AlertController,public toastCtrl: ToastController) {
    this.getCoaches()
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
      });

    } catch (EX) {
      console.log(EX);;
    }
  }

  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'passenger loaded successfully!!',
    duration: 3000,
    position: 'bottom'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}
  presentAlert(){
    this.alert=this.alertCtrl.create({
      title:'Passenger loaded'
    });
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

  getPassenger(coachValue) {
    this.presentLoadingDefault();
    try {
      this.psgnArray = [];
      var query = { COACH_ID: coachValue.COACH_ID, ATTENDANCE_MARKER: "P" }
      WL.JSONStore.get('passenger').find(query).then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.psgnArray.push({
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
      });
     this.loading.dismiss();
    // this.presentAlert();
    // this.alert.dismiss();
    this.presentToast();
    } catch (EX) {
      console.log(EX);
    }
  }

  getVacantBerth(psgnValue) {
    try {
      WL.JSONStore.get('vacantberth').findAll().then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.vcBerth.push({
            COACH_ID: res[i].json.COACH_ID,
            BERTH: res[i].json.BERTH_NO,
            CLASS: res[i].json.CLASS,
            FROM: res[i].json.SRC,
            TO: res[i].json.DEST
          });
        }

      })

    } catch (EX) {
      console.log(EX);
    }

  }

  getShiftType(shiftVal) {
    try {
      var shiftType = JSON.stringify(shiftVal);
      if (shiftType.match("NORMAL SHIFT")) {
        let myModal = this.modalCtrl.create(NormalShiftPage, this.psgnValue);
        myModal.present();
      } else {
        let myModal = this.modalCtrl.create(MutualShiftPage, this.psgnValue);
        myModal.present();
      }
    } catch (EX) {
      console.log(EX);
    }
  }

}