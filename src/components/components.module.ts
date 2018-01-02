import { NgModule } from '@angular/core';
import { WaitListPsngComponent } from './wait-list-psng/wait-list-psng';
import { IonicModule } from 'ionic-angular';
import { EftComponent } from './eft/eft';

@NgModule({
	declarations: [WaitListPsngComponent,
    EftComponent],
	imports: [IonicModule],
	exports: [WaitListPsngComponent,
    EftComponent]
})
export class ComponentsModule {}
