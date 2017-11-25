import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EftTabsPage } from './eft-tabs';

@NgModule({
  declarations: [
    EftTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(EftTabsPage),
  ],
})
export class EftTabsPageModule {}
