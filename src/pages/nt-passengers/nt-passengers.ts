import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var WL;
declare var WLResourceRequest;
/**
 * Generated class for the NtPassengersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nt-passengers',
  templateUrl: 'nt-passengers.html',
})
export class NtPassengersPage {
 ntPassenger:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadNTPassengers();
  }

  loadNTPassengers(){
    try{
      var query={ATTENDANCE_MARKER:"A"};
      WL.JSONStore.get('passenger').find(query).then((res)=>{
        console.log(res);
       for(let i=0;i<res.length;i++){
         this.ntPassenger.push({
           PSGN_NAME:res[i].json.PSGN_NAME,
           PNR_NO   :res[i].json.PNR_NO,
           AGE_SEX  :res[i].json.AGE_SEX,
           COACH_ID :res[i].json.COACH_ID,
           BERTH_NO :res[i].json.BERTH_NO
         });
       }
        
      },(fail)=>{
        console.log("failed to load NT PASSENGERS"+JSON.stringify(fail));
      });

    }catch(ex){
      console.log("failed to fetch NT passengers "+ex);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NtPassengersPage');
  }

}
