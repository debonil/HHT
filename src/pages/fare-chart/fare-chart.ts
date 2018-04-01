import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

/**
 * Generated class for the FareChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fare-chart',
  templateUrl: 'fare-chart.html',
})
export class FareChartPage {
  classArray: any[] = [];
  fareArray: any[] = [];
  category: any[] = [];
  islReduced: any = [];
  finalArr: any[] = [];
  islArr: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: StorageServiceProvider) {
    this.loadClass();
    this.loadDynamicFare();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FareChartPage');
  }

  loadClass() {
    this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res) => {
      var temp=res[0].json.CLASS;
      temp.forEach(element => {
        if(this.classArray.indexOf(element.CLASS)==-1){
          this.classArray.push(element.CLASS);
        }
        
      });


      /* res[0].json.CLASS.forEach(element => {
        this.classArray.push(element.CLASS);
      }); */
      this.categoryVal(this.classArray);
      this.islArr = res[0].json.ISL;
      this.islReduced = this.islArr.reduce(function (o, val, index) { o[val.STN_CODE.trim()] = index; return o; }, {});
    });


  }

  categoryVal(classes) {
    var count = classes.length;
    for (let i = 0; i < count; i++) {
      this.category.push('ADULT');
      this.category.push('CHILD');
    }
  }

  loadDynamicFare() {
    this.storage.getDocuments(this.storage.collectionName.DYNAMIC_FARE_TABLE).then((res) => {
      const fare = res.reduce((acc, curr) => {
        let key = curr.json.FROM_STN + "-" + curr.json.TO_STN;
        let valA = curr.json.ADULT_FARE;
        let valC = curr.json.CHILD_FARE;
        if (acc[key] == null) {
          acc[key] = new Array();
          acc[key].push(valA);
          acc[key].push(valC);

        } else {
          acc[key].push(valA);
          acc[key].push(valC);
        }

        return acc;
      },
        {});
      for (let rows in fare) {
        let rowValue = fare[rows];
        let fromTo = rows.split("-");
        let _id = this.islReduced[fromTo[0]] * this.islArr.length + this.islReduced[fromTo[1]];
        this.finalArr.push({
          key: rows,
          value: rowValue,
          id: _id,
        });
      }
      this.finalArr.sort((a, b) => {
        return a.id - b.id;
      });
      //  console.log(JSON.stringify(this.finalArr));
    });

  }



}
