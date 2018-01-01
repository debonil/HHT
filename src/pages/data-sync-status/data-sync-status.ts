import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataSyncProvider } from '../../providers/data-sync/data-sync';

/**
 * Generated class for the DataSyncStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-sync-status',
  templateUrl: 'data-sync-status.html',
})
export class DataSyncStatusPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public syncProvider: DataSyncProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataSyncStatusPage');
  }

}
