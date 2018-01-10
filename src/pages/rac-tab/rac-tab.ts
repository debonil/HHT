import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacPage } from '../rac/rac';
import { StorageProvider } from '../../providers/storage/storage';
//import { RacServiceProvider } from '../../providers/rac-service/rac-service';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

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
      this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res:any)=>{
        console.log(JSON.stringify(res));
      //this.storage.getTrainAssignmentDocument().then((res: any) => {
        // WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach = res[0].json.ASSIGNED_COACHES;
        for (let i = 0; i < this.coach.length; i++) {
          this.racBerth[this.coach[i]] ={};
        
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
      this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query,option).then((res:any[])=>{
      //  console.log(JSON.stringify(res));

    //  this.storage.findPassenger(query).then((res: any) => {

        //    WL.JSONStore.get('passenger').find(query).then((res)=>{
        for (let i = 0; i < res.length; i++) {
         // this.racBerth[res[i].json.COACH_ID].push(this.convertToRACBerth(res[i]));
          let key=res[i].json.BERTH_NO+"";
          let racmap=this.racBerth[res[i].json.COACH_ID];
           if (racmap[key] == null) {
            racmap[key] = Array<any>();
          } 

            racmap[key].push(this.convertToRACBerth(res[i]));

          
       //  console.log(racmap);
        }

                  //console.log(racmap);

        for (let rowkey in this.racBerth) {
          var rowval = this.racBerth[rowkey];
          var berthArr=[];
          for(let berthNo in rowval){
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
       // console.log(JSON.stringify(this.tabs));
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter RacTabPage');
  }

  convertToRACBerth(psngObj){
    return {
            COACH_ID: psngObj.json.COACH_ID,
            FOOD_FLAG: psngObj.json.FOOD_FLAG,
            CLASS: psngObj.json.CLASS,
            REMARKS: psngObj.json.REMARKS,
            CANCEL_PASS_FLAG: psngObj.json.CANCEL_PASS_FLAG,
            VIP_MARKER: psngObj.json.VIP_MARKER,
            ATTENDANCE_MARKER: psngObj.json.ATTENDANCE_MARKER,
            REMOTE_LOC_NO: psngObj.json.REMOTE_LOC_NO,
            SUB_QUOTA: psngObj.json.SUB_QUOTA,
            PNR_NO: psngObj.json.PNR_NO,
            PSGN_NAME: psngObj.json.PSGN_NAME,
            OLD_CLASS: psngObj.json.OLD_CLASS,
            BERTH_SRC: psngObj.json.BERTH_SRC,
            TICKET_NO: psngObj.json.TICKET_NO,
            PENDING_AMT: psngObj.json.PENDING_AMT,
            AGE_SEX: psngObj.json.AGE_SEX,
            PRIMARY_QUOTA: psngObj.json.PRIMARY_QUOTA,
            BERTH_DEST: psngObj.json.BERTH_DEST,
            BERTH_NO: psngObj.json.BERTH_NO,
            RES_UPTO: psngObj.json.RES_UPTO,
            CAB_CP_ID: psngObj.json.CAB_CP_ID,
            PASS_LOC_FLAG: psngObj.json.PASS_LOC_FLAG,
            MSG_STN: psngObj.json.MSG_STN,
            SYNC_FLAG: psngObj.json.SYNC_FLAG,
            SYSTIME: psngObj.json.SYSTIME,
            DUP_TKT_MARKER: psngObj.json.DUP_TKT_MARKER,
            BERTH_INDEX: psngObj.json.BERTH_INDEX,
            BOARDING_PT: psngObj.json.BOARDING_PT,
            TRAIN_ID: psngObj.json.TRAIN_ID,
            REL_POS: psngObj.json.REL_POS,
            PSGN_NO: psngObj.json.PSGN_NO,
            JRNY_TO: psngObj.json.JRNY_TO,
            CH_NUMBER: psngObj.json.CH_NUMBER,
            CAB_CP: psngObj.json.CAB_CP,
            TICKET_TYPE: psngObj.json.TICKET_TYPE,
            JRNY_FROM: psngObj.json.JRNY_FROM,
            NEW_PRIMARY_QUOTA:psngObj.json.NEW_PRIMARY_QUOTA
          };
  }

}
