import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacmodalPage } from '../racmodal/racmodal';
import { LoadingController, ViewController } from 'ionic-angular';
import { RacTabPage } from "../rac-tab/rac-tab";
import { StorageProvider } from '../../providers/storage/storage';

declare var WL;
/**
 * Generated class for the RacPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rac',
  templateUrl: 'rac.html',
})
export class RacPage {
  [x: string]: any;
  racBerth: any[] = [];
  title: any;
  psgnArr: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public viewCtrl: ViewController, private storage: StorageProvider) {
    this.racBerth = this.navParams.data;
  }


  showAlertPopup(item) {
    try {
      var query = { COACH_ID: item.COACH_ID, BERTH_NO: item.BERTH_NO, ATTENDANCE_MARKER: 'P' };
      //  var options = { exact: true };
      this.storage.findPassenger(query).then((res: any) => {

        //  WL.JSONStore.get('passenger').find(query, options).then((res) => {
        if (res.length < 2) {
          res[0].json.NEW_COACH_ID = res[0].json.COACH_ID;
          res[0].json.NEW_BERTH_NO = res[0].json.BERTH_NO;
          res[0].json.REMARKS = 'RAC_CNF';
          item.ATTENDANCE_MARKER = 'P'
          item.REMARKS = 'RAC_CNF';
          this.storage.replacePassenger(res).then((success) => {

            //    WL.JSONStore.get('passenger').replace(res).then((success) => {
            console.log("passenger updated successfully" + JSON.stringify(success));
          }, (fail) => {
            console.log("failed to update passenger " + JSON.stringify(fail));
          });
        } else {
          this.psgnArr = item;
          let myModal = this.modalCtrl.create(RacmodalPage, item);
          myModal.present();
        }

      }, (fail) => {
        console.log("failed to find passenger " + JSON.stringify(fail));
      });
    } catch (ex) {
      alert(ex);
    }
    

  }
  
ionViewDidLeave(){
  alert("left page");
}

  ionViewDidEnter() {
    console.log("page loaded---");
   // alert('ionViewDidEnter RacTab root');
   
  }

}
