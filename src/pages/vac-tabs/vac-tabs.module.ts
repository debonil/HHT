import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VacTabsPage } from './vac-tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';
@NgModule({
  declarations: [
    VacTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(VacTabsPage),
    SuperTabsModule
  ],
})
export class VacTabsPageModule {}
