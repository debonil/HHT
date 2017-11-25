import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoachwiseChartViewPage } from './coachwise-chart-view';
import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
import { UtilProvider } from '../../providers/util/util';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    CoachwiseChartViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CoachwiseChartViewPage),
    SuperTabsModule
  ],
  providers:[
    PsngDataServiceProvider,
    UtilProvider
  ]

})
export class CoachwiseChartViewPageModule {}
