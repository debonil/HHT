import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PnrDataPage } from './pnr-data';

@NgModule({
  declarations: [
    PnrDataPage,
  ],
  imports: [
    IonicPageModule.forChild(PnrDataPage),
  ],
})
export class PnrDataPageModule {}
