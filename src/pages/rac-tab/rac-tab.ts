import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacPage } from '../rac/rac';
import { StorageProvider } from '../../providers/storage/storage';

declare var WL;
/**
 * Generated class for the RacTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rac-tab',
  templateUrl: 'rac-tab.html',
})
export class RacTabPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider) {
    this.getCoaches();
  }
  tabparams = { title: null };
  tab1Root = RacPage;
  coach;
  racBerth: any[] = [];
  tabs: any[] = [];

  getCoaches() {
    try {
      this.storage.getTrainAssignmentDocument().then((res: any) => {
        // WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach = res.json.ASSIGNED_COACHES;
        console.log(JSON.stringify(this.coach));
        for (let i = 0; i < this.coach.length; i++) {
          this.racBerth[this.coach[i]] = [];
          console.log(this.racBerth);
        }
        this.getValue();
      });

    } catch (EX) {
      console.log(EX);;
    }
  }

  getValue() {
    try {
      var option = { exact: true };
      var query = { PRIMARY_QUOTA: 'RC' }
      this.storage.findPassenger(query).then((res: any) => {

        //    WL.JSONStore.get('passenger').find(query).then((res)=>{
        for (let i = 0; i < res.length; i++) {
          this.racBerth[res[i].json.COACH_ID].push({
            COACH_ID: res[i].json.COACH_ID,
            FOOD_FLAG: res[i].json.FOOD_FLAG,
            CLASS: res[i].json.CLASS,
            REMARKS: res[i].json.REMARKS,
            CANCEL_PASS_FLAG: res[i].json.CANCEL_PASS_FLAG,
            VIP_MARKER: res[i].json.VIP_MARKER,
            ATTENDANCE_MARKER: res[i].json.ATTENDANCE_MARKER,
            REMOTE_LOC_NO: res[i].json.REMOTE_LOC_NO,
            SUB_QUOTA: res[i].json.SUB_QUOTA,
            PNR_NO: res[i].json.PNR_NO,
            PSGN_NAME: res[i].json.PSGN_NAME,
            OLD_CLASS: res[i].json.OLD_CLASS,
            BERTH_SRC: res[i].json.BERTH_SRC,
            TICKET_NO: res[i].json.TICKET_NO,
            PENDING_AMT: res[i].json.PENDING_AMT,
            AGE_SEX: res[i].json.AGE_SEX,
            PRIMARY_QUOTA: res[i].json.PRIMARY_QUOTA,
            BERTH_DEST: res[i].json.BERTH_DEST,
            BERTH_NO: res[i].json.BERTH_NO,
            RES_UPTO: res[i].json.RES_UPTO,
            CAB_CP_ID: res[i].json.CAB_CP_ID,
            PASS_LOC_FLAG: res[i].json.PASS_LOC_FLAG,
            MSG_STN: res[i].json.MSG_STN,
            SYNC_FLAG: res[i].json.SYNC_FLAG,
            SYSTIME: res[i].json.SYSTIME,
            DUP_TKT_MARKER: res[i].json.DUP_TKT_MARKER,
            BERTH_INDEX: res[i].json.BERTH_INDEX,
            BOARDING_PT: res[i].json.BOARDING_PT,
            TRAIN_ID: res[i].json.TRAIN_ID,
            REL_POS: res[i].json.REL_POS,
            PSGN_NO: res[i].json.PSGN_NO,
            JRNY_TO: res[i].json.JRNY_TO,
            CH_NUMBER: res[i].json.CH_NUMBER,
            CAB_CP: res[i].json.CAB_CP,
            TICKET_TYPE: res[i].json.TICKET_TYPE,
            JRNY_FROM: res[i].json.JRNY_FROM
          });
          console.log(this.racBerth);
        }
        for (let rowkey in this.racBerth) {
          var rowval = this.racBerth[rowkey];
          this.tabs.push({
            key: rowkey,
            value: rowval,
            badge: rowval.length
          });
          console.log(this.tabs);

        }
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter RacTabPage');
  }

}
