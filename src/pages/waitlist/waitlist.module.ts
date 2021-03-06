import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaitlistPage } from './waitlist';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    WaitlistPage,
  ],
  imports: [
    IonicPageModule.forChild(WaitlistPage),
    SuperTabsModule,
  ],
})
export class WaitlistPageModule {}
