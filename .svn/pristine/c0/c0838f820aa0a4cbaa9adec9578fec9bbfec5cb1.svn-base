import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ShowChartPage } from '../chart/showChart/showChart';

/**
 * Generated class for the ChartTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart-tabs',
  templateUrl: 'chart-tabs.html',
})
export class ChartTabsPage {
  tabparams = { title : null};
chartTab=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var newArr=navParams.get("coachArr");
    //alert("coach array :: "+JSON.stringify(navParams.get("coachArr")));
    navParams.get("coachArr").forEach(element => {
      this.chartTab.push({root : ShowChartPage,title : element.COACH_ID});
    });
  }

 onTabSelect(ev: any){
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    console.log("coach id is " +ev.id);
    this.tabparams.title= ev.id;
    //this.getVacantBerths(this.tabparams.title);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChartTabsPage');
  }

}
