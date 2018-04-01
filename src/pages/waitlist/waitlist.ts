import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
/* import { StorageProvider } from '../../providers/storage/storage'; */
import {StorageServiceProvider} from '../../providers/storage-service/storage-service';
import { WaitListPsngComponent } from '../../components/wait-list-psng/wait-list-psng';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';

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

   trainAssignmentObject : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    //private storage : StorageProvider,
    private storageService : StorageServiceProvider,private pdsp: PsngDataServiceProvider
  ) {
    this.classArray = [];
    console.log(JSON.stringify(this.classArray.length));
    /* this.trainAssignmentObject = this.pdsp.trainAssignmentObject;
    this.classArray = this.trainAssignmentObject.CLASS;
    this.classArrayFound = true; */
  }

  ionViewDidLoad() {
    this.pdsp.findAll(true).subscribe(data => {
      this.classArrayFound = true;
      data.trainAssignmentObj.CLASS.reduce((acc,currentVal)=>{
        if(this.classArray.indexOf(currentVal.CLASS)<0){
          this.classArray.push(currentVal.CLASS);
        }
        return this.classArray;
      });
    });
  }

}
