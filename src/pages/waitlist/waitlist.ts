import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { WaitListPsngComponent } from '../../components/wait-list-psng/wait-list-psng';

/**
 * Generated class for the WaitlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waitlist',
  templateUrl: 'waitlist.html',
})
export class WaitlistPage {
   waitlist:any=[];
   rootPage = WaitListPsngComponent;//ChartPsngPage
   classArray : any[];
   classArrayFound : boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage : StorageProvider) {
    this.storage.getTrainAssignment().then((res:any)=>{
      console.log(res.CLASS);
      this.classArray = res.CLASS;
      console.log(this.classArray);
      this.classArrayFound = true;
    });
  }

}
