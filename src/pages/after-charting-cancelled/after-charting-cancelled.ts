import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

/**
 * Generated class for the AfterChartingCancelledPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-after-charting-cancelled',
  templateUrl: 'after-charting-cancelled.html',
})
export class AfterChartingCancelledPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: StorageServiceProvider) {
    this.getAfterChartingCancelled();
  }
  cnclArr: any = [];
  
  getAfterChartingCancelled() {
    try {
      var query = { CANCEL_PASS_FLAG: 'C' };
      var options = { exact: true };
       this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query,options).then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.cnclArr.push({
            PRIMARY_QUOTA: res[i].json.PRIMARY_QUOTA,
            COACH_ID: res[i].json.COACH_ID,
            BERTH_NO: res[i].json.BERTH_NO,
            PNR_NO: res[i].json.PNR_NO,
            PSGN_NAME: res[i].json.PSGN_NAME,
            AGE_SEX: res[i].json.AGE_SEX,
            JRNY_FROM: res[i].json.JRNY_FROM,
            JRNY_TO: res[i].json.JRNY_TO,
            BOARDING_PT: res[i].json.BOARDING_PT,
            RES_UPTO: res[i].json.RES_UPTO

          });
        }
      });
    } catch (ex) {
      alert('Exception ' + ex);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AfterChartingCancelledPage');
  }

}
