import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RacTabPage } from './rac-tab';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    RacTabPage,
  ],
  imports: [
    IonicPageModule.forChild(RacTabPage),
    SuperTabsModule
  ],
})
export class RacTabPageModule {}
