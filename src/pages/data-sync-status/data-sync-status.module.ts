import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSyncStatusPage } from './data-sync-status';

@NgModule({
  declarations: [
    DataSyncStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSyncStatusPage),
  ],
})
export class DataSyncStatusPageModule {}
