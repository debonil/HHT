import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var WL;
/**
 * Generated class for the DoctorsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-doctors',
  templateUrl: 'doctors.html',
})
export class DoctorsPage {

  docRows : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   this.populateDoctors();
   
  }

  populateDoctors(){
    var query={VIP_MARKER :'+'}
    WL.JSONStore.get('passenger').find(query).then((res)=>{
      this.docRows=res;
    }).fail((f)=>{
      alert("unable to fetch doctors");
    });
  }

}
