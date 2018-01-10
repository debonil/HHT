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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
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
  islReduced:any=[];
  psgnArr: any = [];
  loading:any;
  getCoaches() {
    this.presentLoadingDefault();
    try {
      WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach = res[0].json.ASSIGNED_COACH;
        this.islArr=res[0].json.ISL
        this.islReduced = this.islArr.reduce(function (o, val, index) { o[val.STN_CODE.trim()] = index; return o; }, {});

        this.coachesReduced = this.coach.reduce(function (o, val, index) { o[val.COACH_ID] = index; return o; }, {});
        console.log(this.coachesReduced);
      });
    } catch (ex) {
      alert('Exception ' + ex);
    }
  }

  presentLoadingDefault() {
     this.loading = this.loadingCtrl.create({
      content: 'Loading Occupancy...'
    });

    this.loading.present();

   /*  setTimeout(() => {
      loading.dismiss();
    }, 5000); */
  }

  getPassengers() {
    try {
      var queryPart = WL.JSONStore.QueryPart().notEqual('BOARDING_PT', '-').equal('ATTENDANCE_MARKER','P');
      var options = { exact: true };
      WL.JSONStore.get('passenger').advancedFind([queryPart], options).then((res) => {
        const psngCount = res.reduce((countIntermediate, psgnObj, index, array) => {
          let key = psgnObj.json.BOARDING_PT + "-" + psgnObj.json.RES_UPTO;
          let val = psgnObj.json.COACH_ID;
          if (countIntermediate[key] == null) {
            countIntermediate[key] = Array<number>(this.coach.length+1).fill(0);
            countIntermediate[key][this.coachesReduced[val]] = 1;
            countIntermediate[key][this.coach.length] = 1;
          } else {
            countIntermediate[key][this.coachesReduced[val]]++;
            countIntermediate[key][this.coach.length]++;
          }
          key ="TOTAL";
          if (countIntermediate[key] == null) {
            countIntermediate[key] = Array<number>(this.coach.length+1).fill(0);
            countIntermediate[key][this.coachesReduced[val]] = 1;
            countIntermediate[key][this.coach.length] = 1;
          } else {
            countIntermediate[key][this.coachesReduced[val]]++;
            countIntermediate[key][this.coach.length]++;
          }
          return countIntermediate;

        }, {});
        for (let rows in psngCount) {
          let rowValue = psngCount[rows];
          let fromTo=rows.split("-");
          let _id;
          if(rows!="TOTAL"){
            _id=this.islReduced[fromTo[0]]*this.islArr.length+this.islReduced[fromTo[1]];
          }else{
           _id=this.islArr.length*this.islArr.length+1;
          }
          this.finalArr.push({ key: rows, value: rowValue, id :_id });
          console.log(this.finalArr);
        }
      this.finalArr.sort((a,b)=>{
        return a.id-b.id;
      });
      this.loading.dismiss();
      }, (fail) => {
        console.log("failed to load passengers" + JSON.stringify(fail));
      });
    } catch (ex) {
      console.log("failed to load occupancy " + ex);
    }
  }

}
