import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
declare var WL;
/**
 * Generated class for the OccupancyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-occupancy',
  templateUrl: 'occupancy.html',
})
export class OccupancyPage {

  occRows: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.getCoaches();
    this.getPassengers();

  }

  coachId;
  islPair: any = [];
  coach: any = [];
  coachesReduced: any = [];
  occup: any = [];
  newArr: any = [];
  finalArr: any[] = [];
  islArr: any[] = [];
  psgnArr: any = [];

  getCoaches() {
    console.log("get coaches called");
    this.presentLoadingDefault();
    try {
      WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach=res[0].json.ASSIGNED_COACH;
        this.coachesReduced= this.coach.reduce(function(o, val,index) { o[val.COACH_ID] = index; return o; }, {});
        console.log(this.coachesReduced);
        console.log(this.coachesReduced);

      });


    } catch (ex) {
      alert('Exception ' + ex);
    }
  }

  presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  loading.present();

   setTimeout(() => {
    loading.dismiss();
  }, 5000); 
}

  getPassengers() {
    var queryPart=WL.JSONStore.QueryPart().notEqual('BOARDING_PT','-');
    var options={exact:true};
        WL.JSONStore.get('passenger').advancedFind([queryPart], options).then((res) => {

   // WL.JSONStore.get('passenger').findAll().then((res) => {
      const psngCount = res.reduce((countIntermediate, psgnObj, index, array) => {

        var key = psgnObj.json.BOARDING_PT + "-" + psgnObj.json.RES_UPTO;

        var val = psgnObj.json.COACH_ID;

        if (countIntermediate[key] == null) {
               countIntermediate[key] = Array<number>(this.coach.length).fill(0);
               countIntermediate[key][this.coachesReduced[val]] = 1;
               
        } else {
             countIntermediate[key][this.coachesReduced[val]]++;
        }
        return countIntermediate;

      }, {});
      console.log(psngCount)

      for (let rows in psngCount) {
        let rowValue = psngCount[rows];
        console.log("row value:: " + rowValue);
        this.finalArr.push({ key: rows, value: rowValue })
        
      }
      console.log(this.finalArr)

    }, (fail) => {
      console.log("failed to load passengers" + JSON.stringify(fail));
    })
  }

}
