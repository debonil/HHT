import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { Network } from '@ionic-native/network';
// import { IonicStorageModule } from '@ionic/storage';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChartPage } from '../pages/chart/chart';
import { EftPageModule } from '../pages/eft/eft.module';

//import { StorageProvider } from '../providers/storage/storage';
import { LoggerProvider } from '../providers/logger/logger';
import { BackendProvider } from '../providers/backend/backend';
import { UtilProvider } from '../providers/util/util';
import { DroppedETktPassengerPageModule } from '../pages/dropped-e-tkt-passenger/dropped-e-tkt-passenger.module';
import { EftTabsPageModule } from '../pages/eft-tabs/eft-tabs.module';
import { OccupancyPageModule } from '../pages/occupancy/occupancy.module';
import { VacTabsPageModule } from '../pages/vac-tabs/vac-tabs.module';
import { WaitListTabsPageModule } from '../pages/wait-list-tabs/wait-list-tabs.module';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { RacPageModule } from '../pages/rac/rac.module';
import { RacmodalPageModule } from '../pages/racmodal/racmodal.module';
import { AfterChartingCancelledPageModule } from '../pages/after-charting-cancelled/after-charting-cancelled.module';
import { StatusPageModule } from '../pages/status/status.module';
import { VacantberthPageModule } from '../pages/vacantberth/vacantberth.module';
import { NcPsgnPageModule } from '../pages/nc-psgn/nc-psgn.module';
import { NcPreviewPageModule } from '../pages/nc-preview/nc-preview.module';
import { ShiftPsgnPageModule } from '../pages/shift-psgn/shift-psgn.module';
import { CoachwiseChartViewPageModule } from '../pages/coachwise-chart-view/coachwise-chart-view.module';
import { ChartPsngPage } from '../pages/chart-psng/chart-psng';
import { GotDownPsgnPageModule } from '../pages/got-down-psgn/got-down-psgn.module';
import { BoardedAtPsgnPageModule } from '../pages/boarded-at-psgn/boarded-at-psgn.module';
import { ChartPreviewPageModule } from '../pages/chart-preview/chart-preview.module';
import { PopoverPageModule} from '../pages/popover/popover.module'
import { WaitlistPageModule } from '../pages/waitlist/waitlist.module';
import { WaitlistModelPageModule } from '../pages/waitlist-model/waitlist-model.module';
import { PsngDataServiceProvider } from '../providers/psng-data-service/psng-data-service';
import { DatabaseProvider } from '../providers/database/database';
import { DataSyncProvider } from '../providers/data-sync/data-sync';
import { DataLoadProvider } from '../providers/data-load/data-load';
import { NormalShiftPageModule } from '../pages/normal-shift/normal-shift.module';
import { MutualShiftPageModule } from '../pages/mutual-shift/mutual-shift.module';
import { RacTabPageModule } from '../pages/rac-tab/rac-tab.module';
import { SearchPageModule } from '../pages/search/search.module';

import { NtPassengersPageModule } from '../pages/nt-passengers/nt-passengers.module';
import { DoctorsPageModule } from '../pages/doctors/doctors.module';
import { DirectivesModule } from '../directives/directives.module';
import { ComponentsModule } from '../components/components.module';
import { WaitListPsngComponent } from '../components/wait-list-psng/wait-list-psng';
import { DataSyncStatusPageModule } from '../pages/data-sync-status/data-sync-status.module';
import { EftServiceProvider } from '../providers/eft-service/eft-service';
import { EftFormPage } from '../pages/eft-form/eft-form';
import { StorageServiceProvider } from '../providers/storage-service/storage-service';

@NgModule({
  declarations: [
     MyApp,
     HomePage,
     ChartPage,
     ChartPsngPage,
     EftFormPage
     //ComponentsModule,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    ComponentsModule,
    DirectivesModule,
    // IonicStorageModule.forRoot(),
    EftPageModule,
    DroppedETktPassengerPageModule,
    EftTabsPageModule,
    OccupancyPageModule,
    VacTabsPageModule,
    WaitListTabsPageModule,
    RacPageModule,
    RacmodalPageModule,
    AfterChartingCancelledPageModule,
    StatusPageModule,
    VacantberthPageModule,
    NcPreviewPageModule,
    NcPsgnPageModule,
    ShiftPsgnPageModule,
    ChartPreviewPageModule,
    BoardedAtPsgnPageModule,
    GotDownPsgnPageModule,
    CoachwiseChartViewPageModule,
    PopoverPageModule,
    WaitlistPageModule,
    WaitlistModelPageModule,
    MutualShiftPageModule,
    NormalShiftPageModule,
    NtPassengersPageModule,
    DoctorsPageModule,
    DataSyncStatusPageModule,
    RacTabPageModule,
    SearchPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChartPage,
    ChartPsngPage,
    WaitListPsngComponent,
    EftFormPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Network,
    //StorageProvider,
    LoggerProvider,
    BackendProvider,
    UtilProvider,
    PsngDataServiceProvider,
    DatabaseProvider,
    DataSyncProvider,
    StorageServiceProvider,
    // SQLite,
    Vibration,
    DataLoadProvider,
    EftServiceProvider
  ]
})
export class AppModule {}
