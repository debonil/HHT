import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NcPreviewPage } from './nc-preview';

@NgModule({
  declarations: [
    NcPreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(NcPreviewPage),
  ],
})
export class NcPreviewPageModule {}
