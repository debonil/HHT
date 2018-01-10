import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";
declare var WL;
/**
 * Generated class for the DoctorsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctors',
  templateUrl: 'doctors.html',
})
export class DoctorsPage {

  docRows: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageServiceProvider) {
    this.populateDoctors();

  }

  populateDoctors() {
    try {
      var query = { VIP_MARKER: '+' };
      this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query).then((res) => {
    //  WL.JSONStore.get('passenger').find(query).then((res) => {
        this.docRows = res;
      },(f) => {
        alert("unable to fetch doctors");
      });
    } catch (ex) {
      console.log("failed to load doctors " + ex);
    }
  }

}
