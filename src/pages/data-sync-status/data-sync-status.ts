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
 dirtyVacSyncSuccess:any[]=[];
 dirtyVacSyncFail:any[]=[];
 dirtyVacDiffData:any[]=[];
 dirtyEFTSuccess:any[]=[];
 dirtyEFTFail:any[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public syncProvider: DataSyncProvider,
  ) {
    if(this.syncProvider.dirtyVacBerthSyncSuccessCount==0){
       this.dirtyVacSyncSuccess.push('V');
    }
      if(this.syncProvider.dirtyVacBerthSyncFailureCount==0){
       this.dirtyVacSyncFail.push('V');
    }
      if(this.syncProvider.differentialVacBerthDownloadedCount==0){
       this.dirtyVacDiffData.push('V');
    }
      if(this.syncProvider.dirtyEFTSyncSuccessCount==0){
       this.dirtyEFTSuccess.push('V');
    }
      if(this.syncProvider.dirtyEFTSyncFailureCount==0){
       this.dirtyEFTFail.push('V');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataSyncStatusPage');

  }

}
