import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RacPage } from './rac';

@NgModule({
  declarations: [
    RacPage,
  ],
  imports: [
    IonicPageModule.forChild(RacPage),
  ],
})
export class RacPageModule {}
