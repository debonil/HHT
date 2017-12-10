import { Component } from '@angular/core';
import { StorageProvider } from '../../providers/storage/storage';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { WaitlistModelPage } from '../../pages/waitlist-model/waitlist-model';

/**
 * Generated class for the WaitListPsngComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'wait-list-psng',
  templateUrl: 'wait-list-psng.html'
})
export class WaitListPsngComponent {
  waitlist:any=[];
  confirmed_waitlist: any =[];
  non_confirmed_waitlist: any =[];

  constructor(private storage : StorageProvider, private modalCtrl : ModalController,
    private navCtrl: NavController, public navParams: NavParams) {
    //alert('Hello WaitListPsngComponent Component' + navParams.data);
    console.log('-----------------------------');
    console.log(navParams.data);

    this.storage.getConfirmedWaitlistPassenger(navParams.data.class).then(res=>{
      this.confirmed_waitlist = res;
      console.log('cnf');
      console.log(this.confirmed_waitlist);
    },failure=>{
      alert("failed to load confirmed waitlist "+JSON.stringify(failure));
    });

    this.storage.getNonConfirmedWaitlistPassenger(navParams.data.class).then(res=>{
      this.non_confirmed_waitlist = res;
      console.log('non cnf');
      console.log(this.non_confirmed_waitlist);
    },failure=>{
      alert("failed to load non-confirmed waitlist "+JSON.stringify(failure));
    });
  }

  onWaitlistClick(event, item){
    console.log('E I ');
    console.log(event);
    console.log(item);
    this.navCtrl.push(WaitlistModelPage, item);
  }
}
