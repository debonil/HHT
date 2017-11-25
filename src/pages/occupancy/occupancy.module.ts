import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OccupancyPage } from './occupancy';

@NgModule({
  declarations: [
    OccupancyPage,
  ],
  imports: [
    IonicPageModule.forChild(OccupancyPage),
  ],
})
export class OccupancyPageModule {}
