import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FareChartPage } from './fare-chart';

@NgModule({
  declarations: [
    FareChartPage,
  ],
  imports: [
    IonicPageModule.forChild(FareChartPage),
  ],
})
export class FareChartPageModule {}
