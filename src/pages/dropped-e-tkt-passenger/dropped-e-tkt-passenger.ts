import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";
/**
 * Generated class for the DroppedETktPassengerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dropped-e-tkt-passenger',
  templateUrl: 'dropped-e-tkt-passenger.html',
})
export class DroppedETktPassengerPage {
  droppedPsgnArr: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageServiceProvider) {
    this.getDroppedETicketPassenger();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DroppedETktPassengerPage');
  }

  getDroppedETicketPassenger() {
    try {
      this.storage.getDocuments(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE).then((res) => {
    //  this.storage.getDropEticketPassenger('droptEticketPassenger').then((res) => {
      console.log(JSON.stringify(res));
        this.droppedPsgnArr = res;
      });
    } catch (ex) {
      console.log("failed to load dropped e ticket passenger " + ex);
    }
  }
}
