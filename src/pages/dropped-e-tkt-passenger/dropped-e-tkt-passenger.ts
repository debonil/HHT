import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider) {
    this.getDroppedETicketPassenger();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DroppedETktPassengerPage');
  }

  getDroppedETicketPassenger() {
    try {
      this.storage.getDropEticketPassenger('droptEticketPassenger').then((res) => {
        this.droppedPsgnArr = res;
      });
    } catch (ex) {
      console.log("failed to load dropped e ticket passenger " + ex);
    }
  }
}
