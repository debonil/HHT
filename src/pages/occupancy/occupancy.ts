import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";
declare var WL;
/**
 * Generated class for the OccupancyPage page.
 * @Author Ashutosh
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController
    , private storage: StorageServiceProvider) {
    this.getCoaches();
   // this.getPassengers();

  } 
  assignedCoach:any[]=[];
  foodArr:any[]=[];
  coach: any = [];
  coachesReduced: any = [];
  finalArr: any[] = [];
  islArr: any[] = [];
  islReduced: any = [];
  loading: any;
  islData:any[]=[];
  getSort(val:any[]){
    val.sort(function (a,b) {
                 var cca=  a.COACH_ID.replace(/[^A-Z\.]/g, '');
                 var ccb= b.COACH_ID.replace(/[^A-Z\.]/g, '');
                 if (cca < ccb)
                 return -1;
               if (cca > ccb)
                 return 1;
                 var cna= parseInt(a.COACH_ID.replace(/[^0-9\.]/g, ''), 10);
                 var cnb= parseInt(b.COACH_ID.replace(/[^0-9\.]/g, ''), 10);
                 if (cna < cnb)
                   return -1;
                 if (cna > cnb)
                   return 1;
               if (Number(a.BERTH_NO) < Number(b.BERTH_NO))
                 return -1;
               if (Number(a.BERTH_NO )> Number(b.BERTH_NO))
                 return 1;
                return 0;
             }); 
              return val;
  }

  getCoaches() {
    this.presentLoadingDefault();
    try {
      this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res) => {
        var flag = res[0].json.TS_FLAG;
        if (flag) {
          this.coach = res[0].json.TOTAL_COACH;
          this.coach=this.getSort(this.coach);
          this.assignedCoach=Object.assign([],res[0].json.TOTAL_COACHES) ;
        }
        else {
         this.coach = res[0].json.ASSIGNED_COACH;
         this.assignedCoach=Object.assign([],res[0].json.ASSIGNED_COACHES) ;
          this.coach=this.getSort(this.coach);    
        }
       for(let i=0;i<this.coach.length;i++){
         this.foodArr.push("F");
         this.foodArr.push("D");
       }
        this.islArr = res[0].json.ISL;
        this.islReduced = this.islArr.reduce(function (o, val, index) { o[val.STN_CODE.trim()] = index; return o; }, {});

        this.coachesReduced = this.coach.reduce(function (o, val, index) { o[val.COACH_ID] = index; return o; }, {});
        this.getPassengers();
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

  }

   getPassengers(){
     try {
      var options = { exact: true };
   //   var queryPart = { $notEqual: [{ BOARDING_PT: '-' },{ CANCEL_PASS_FLAG: 'C' }], $equal: [{ ATTENDANCE_MARKER: 'P' }] }
      var queryPart = { $inside:[{COACH_ID:this.assignedCoach}],$notEqual: [{ BOARDING_PT: '-' },{ CANCEL_PASS_FLAG: 'C' }], $equal: [{ ATTENDANCE_MARKER: 'P' }]}
      this.storage.getDocumentsAdvanced(this.storage.collectionName.PASSENGER_TABLE, queryPart, options).then((res) => {

        const psngCount = res.reduce((countIntermediate, psgnObj, index, array) => {
          let key = psgnObj.json.BOARDING_PT + "-" + psgnObj.json.RES_UPTO;
          let val = psgnObj.json.COACH_ID;
          let food=psgnObj.json.FOOD_FLAG;

          if (countIntermediate[key] == null) {
            countIntermediate[key] = Array<number>(this.coach.length*2 + 1).fill(0);
           if(food=='D'){
            countIntermediate[key][(this.coachesReduced[val])*2+1] = 1;
            countIntermediate[key][this.coach.length*2] = 1;
            }else{
               countIntermediate[key][(this.coachesReduced[val])*2] = 1;
            countIntermediate[key][this.coach.length*2] = 1;
            }
          } 
          
          
          else {
            if(food=='D'){
            countIntermediate[key][(this.coachesReduced[val])*2+1]++;
            countIntermediate[key][this.coach.length*2]++;
            }else{
               countIntermediate[key][(this.coachesReduced[val])*2]++;
            countIntermediate[key][this.coach.length*2]++;
            }
          }
          key = "TOTAL";
         if (countIntermediate[key] == null) {         
            countIntermediate[key] = Array<number>(this.coach.length*2 + 1).fill(0);
             if(food=='D'){
            countIntermediate[key][(this.coachesReduced[val])*2+1] = 1;

            countIntermediate[key][this.coach.length*2] = 1;
             }else{
             countIntermediate[key][(this.coachesReduced[val])*2] = 1;

            countIntermediate[key][this.coach.length*2] = 1;
             }
          } else {

             if(food=='D'){
            countIntermediate[key][(this.coachesReduced[val])*2+1]++;
            countIntermediate[key][this.coach.length*2]++;
             }else{
              countIntermediate[key][(this.coachesReduced[val])*2]++;
            countIntermediate[key][this.coach.length*2]++;
             }
          }

          return countIntermediate;

        }
        
        , {});

        for (let rows in psngCount) {
          let rowValue = psngCount[rows];
          let fromTo = rows.split("-");
          let _id;
          if (rows != "TOTAL") {
            _id = this.islReduced[fromTo[0]] * this.islArr.length + this.islReduced[fromTo[1]];
          } else {
            _id = this.islArr.length * this.islArr.length + 1;
          }
          this.finalArr.push({ 
            key: rows,
            value: rowValue,
            id: _id ,
            badge: rowValue[this.coach.length*2]
          });
         }
        this.finalArr.sort((a, b) => {
          return a.id - b.id;
        });
        this.loading.dismiss();
      }, (fail) => {
        console.log("failed to load passengers" + JSON.stringify(fail));
      });
    } catch (ex) {
      console.log("failed to load occupancy " + ex);
    }
  } 

   /* getPassengers() {
    try {
      var options = { exact: true };
      var queryPart = { $notEqual: [{ BOARDING_PT: '-' },{ CANCEL_PASS_FLAG: 'C' }], $equal: [{ ATTENDANCE_MARKER: 'P' }] }
      this.storage.getDocumentsAdvanced(this.storage.collectionName.PASSENGER_TABLE, queryPart, options).then((res) => {
        const psngCount = res.reduce((countIntermediate, psgnObj, index, array) => {
          let key = psgnObj.json.BOARDING_PT + "-" + psgnObj.json.RES_UPTO;
          let val = psgnObj.json.COACH_ID;
          let food=psgnObj.json.FOOD_FLAG;
          if (countIntermediate[key] == null) {
            countIntermediate[key] = Array<number>(this.coach.length + 1).fill(0);
            countIntermediate[key][this.coachesReduced[val]] = 1;
            countIntermediate[key][this.coach.length] = 1;
          } else {
            countIntermediate[key][this.coachesReduced[val]]++;
            countIntermediate[key][this.coach.length]++;
          }
          key = "TOTAL";
          if (countIntermediate[key] == null) {
            countIntermediate[key] = Array<number>(this.coach.length + 1).fill(0);
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
          let fromTo = rows.split("-");
          let _id;
          if (rows != "TOTAL") {
            _id = this.islReduced[fromTo[0]] * this.islArr.length + this.islReduced[fromTo[1]];
          } else {
            _id = this.islArr.length * this.islArr.length + 1;
          }
          this.finalArr.push({ key: rows, value: rowValue, id: _id });
         }
        this.finalArr.sort((a, b) => {
          return a.id - b.id;
        });
        this.loading.dismiss();
      }, (fail) => {
        console.log("failed to load passengers" + JSON.stringify(fail));
      });
    } catch (ex) {
      console.log("failed to load occupancy " + ex);
    }
  }  */

}
