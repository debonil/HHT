import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RacPage } from './rac';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    RacPage,
  ],
  imports: [
    IonicPageModule.forChild(RacPage),
  ],
})
export class RacPageModule {}
