import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacmodalPage } from '../racmodal/racmodal';
import { LoadingController, ViewController } from 'ionic-angular';
import { RacTabPage } from "../rac-tab/rac-tab";
//import { StorageProvider } from '../../providers/storage/storage';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

//import { RacServiceProvider } from '../../providers/rac-service/rac-service';
//import { IonTextAvatar } from 'ionic-text-avatar';
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
  temp: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public viewCtrl: ViewController, private storage: StorageServiceProvider
  ) {
    console.log(JSON.stringify(this.navParams.data));
    this.navParams.data.sort(function (a, b) {
      return a.berthNo - b.berthNo;
    });
    this.racBerth = this.navParams.data;
  }

  replacePassenger(coachId, berthNo) {
     var option = { exact: true };
    var query = { COACH_ID: coachId, BERTH_NO: berthNo };
    this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query).then((res:any[])=>{

    //this.storage.findPassenger(query).then((res) => {
      res[0].json.NEW_COACH_ID = res[0].json.COACH_ID;
      res[0].json.NEW_BERTH_NO = res[0].json.BERTH_NO;
      res[0].json.REMARKS = 'CNF';
      this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,res).then((success) => {
        console.log("passenger updated successfully" + JSON.stringify(success));
      }, (fail) => {
        console.log("failed to update passenger " + JSON.stringify(fail));
      });
    }, (fail) => {

    });
  }


  showAlertPopup(item) {
    try {     

      if (item.value[0].ATTENDANCE_MARKER === 'P' && item.value[1].ATTENDANCE_MARKER === 'A') {
        this.replacePassenger(item.value[0].COACH_ID, item.value[0].BERTH_NO);
        item.value[0].REMARKS = 'CNF';
        item.value[0].NEW_PRIMARY_QUOTA="CNF";

      }

      if (item.value[0].ATTENDANCE_MARKER === 'A' && item.value[1].ATTENDANCE_MARKER === 'P') {
        this.replacePassenger(item.value[1].COACH_ID, item.value[1].BERTH_NO);
        item.value[1].REMARKS = 'CNF';
        item.value[1].NEW_PRIMARY_QUOTA="CNF";

      }

      if (item.value[0].ATTENDANCE_MARKER === 'P' && item.value[1].ATTENDANCE_MARKER === 'P') {
        this.psgnArr = item;
        let myModal = this.modalCtrl.create(RacmodalPage, item);
        myModal.onDidDismiss(data => {
         if(data[0][0].json.PNR_NO === item.value[0].PNR_NO && data[0][0].json.REL_POS === item.value[0].REL_POS){
                        item.value[1].REMARKS="CNF";
                        item.value[1].NEW_PRIMARY_QUOTA="CNF";
                        item.value[0].COACH_ID=data[0][0].json.COACH_ID;
                        item.value[0].BERTH_NO=data[0][0].json.BERTH_NO;
                        item.value[0].REMARKS="CNF";
                        item.value[0].NEW_PRIMARY_QUOTA="CNF";

                        item.berthNo=data[0][0].json.BERTH_NO;
          }
          else if(data[0][0].json.PNR_NO === item.value[1].PNR_NO && data[0][0].json.REL_POS === item.value[1].REL_POS){
                        item.value[0].REMARKS="CNF";
                        item.value[0].NEW_PRIMARY_QUOTA="CNF";

                        item.value[1].COACH_ID=data[0][0].json.COACH_ID;
                        item.value[1].BERTH_NO=data[0][0].json.BERTH_NO;
                        item.value[1].REMARKS="CNF";
                        item.value[1].NEW_PRIMARY_QUOTA="CNF";

                        item.berthNo=data[0][0].json.BERTH_NO;

          }

        });
        myModal.present();

      }


      
    } catch (ex) {
      alert(ex);
    }


  }


  ionViewDidEnter() {
    console.log("page loaded---");
    var temp = this.racBerth;
    this.racBerth = [];
    this.racBerth = temp;
  }

}
