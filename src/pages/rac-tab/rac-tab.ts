import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacPage } from '../rac/rac';
import { StorageProvider } from '../../providers/storage/storage';
//import { RacServiceProvider } from '../../providers/rac-service/rac-service';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

declare var WL;
/**
 * Generated class for the RacTabPage page.
 * @Author Ashutosh
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rac-tab',
  templateUrl: 'rac-tab.html',
})
export class RacTabPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: StorageServiceProvider) {
    this.getCoaches();
  }
  tabparams = { title: null };
  tab1Root = RacPage;
  coach;
  racBerth: any[] = [];
  tabs: any[] = [];

  getCoaches() {
    try {
      this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res: any) => {
        this.coach = res[0].json.ASSIGNED_COACHES;
        for (let i = 0; i < this.coach.length; i++) {
          this.racBerth[this.coach[i]] = {};

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
      var query = { PRIMARY_QUOTA: 'RC', CANCEL_PASS_FLAG: '-' }
      this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE, query, option).then((res: any[]) => {
        console.log(JSON.stringify(res));
        for (let i = 0; i < res.length; i++) {
          if (!(this.coach.indexOf(res[i].json.COACH_ID) == -1)) {
            let key = res[i].json.BERTH_NO + "";
            let racmap = this.racBerth[res[i].json.COACH_ID];
            if (racmap[key] == null) {
              racmap[key] = Array<any>();
            }

            racmap[key].push(this.convertToRACBerth(res[i]));
          }

        }

        for (let rowkey in this.racBerth) {
          var rowval = this.racBerth[rowkey];
          var berthArr = [];
          for (let berthNo in rowval) {
            berthArr.push({
              berthNo: berthNo,
              value: rowval[berthNo]
            });
          }


          this.tabs.push({
            key: rowkey,
            value: berthArr,
            badge: berthArr.length
          });

        }
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter RacTabPage');
  }

  convertToRACBerth(psngObj) {
    return {
      TRAIN_ID: psngObj.json.TRAIN_ID,
      CH_NUMBER: psngObj.json.CH_NUMBER,
      REMOTE_LOC_NO: psngObj.json.REMOTE_LOC_NO,
      COACH_ID: psngObj.json.COACH_ID,
      CLASS: psngObj.json.CLASS,
      BERTH_INDEX: psngObj.json.BERTH_INDEX,
      BERTH_NO: psngObj.json.BERTH_NO,
      BERTH_SRC: psngObj.json.BERTH_SRC,
      BERTH_DEST: psngObj.json.BERTH_DEST,
      PSGN_NO: psngObj.json.PSGN_NO,
      PNR_NO: psngObj.json.PNR_NO,
      PSGN_NAME: psngObj.json.PSGN_NAME,
      AGE_SEX: psngObj.json.AGE_SEX,
      JRNY_FROM: psngObj.json.JRNY_FROM,
      JRNY_TO: psngObj.json.JRNY_TO,
      BOARDING_PT: psngObj.json.BOARDING_PT,
      RES_UPTO: psngObj.json.RES_UPTO,
      TICKET_NO: psngObj.json.TICKET_NO,
      WAITLIST_NO: psngObj.json.WAITLIST_NO,
      DUP_TKT_MARKER: psngObj.json.DUP_TKT_MARKER,
      CAB_CP: psngObj.json.CAB_CP,
      CAB_CP_ID: psngObj.json.CAB_CP_ID,
      PRIMARY_QUOTA: psngObj.json.PRIMARY_QUOTA,
      SUB_QUOTA: psngObj.json.SUB_QUOTA,
      PENDING_AMT: psngObj.json.PENDING_AMT,
      MSG_STN: psngObj.json.MSG_STN,
      VIP_MARKER: psngObj.json.VIP_MARKER,
      ATTENDANCE_MARKER: psngObj.json.ATTENDANCE_MARKER,
      REL_POS: psngObj.json.REL_POS,
      TICKET_TYPE: psngObj.json.TICKET_TYPE,
      NEW_CLASS: psngObj.json.NEW_CLASS,
      FOOD_FLAG: psngObj.json.FOOD_FLAG,
      NEW_COACH_ID: psngObj.json.NEW_COACH_ID,
      NEW_BERTH_NO: psngObj.json.NEW_BERTH_NO,
      NEW_PRIMARY_QUOTA: psngObj.json.NEW_PRIMARY_QUOTA,
      CANCEL_PASS_FLAG: psngObj.json.CANCEL_PASS_FLAG,
      SYSTIME: psngObj.json.SYSTIME,
      REMARKS: psngObj.json.REMARKS,
      UPDATE_TIME: psngObj.json.UPDATE_TIME,
      SYNC_TIME: psngObj.json.SYNC_TIME

    };
  }

}
