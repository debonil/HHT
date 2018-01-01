import { Component, OnInit } from '@angular/core';
import { VacantberthPage } from '../../pages/vacantberth/vacantberth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';

declare var WL;
/**
 * Generated class for the MyTabsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'vac-tabs',
  templateUrl: 'vac-tabs.html'
})
export class VacTabsPage {
  isAvailable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider) {
    this.getCoaches();
  }
  temp:any[]=[];
  tabparams = { title: null };
  tab1Root = VacantberthPage;
  coach;
  vacBerth: any[] = [];
  tabs: any[] = [];

  /* getCoaches() {
    
      WL.JSONStore.get('trainAssignment').findAll().then((res) => {
        this.coach = res[0].json.ASSIGNED_COACHES;
        console.log(JSON.stringify(this.coach));
        for (let i = 0; i < this.coach.length; i++) {
          this.vacBerth[this.coach[i]] = [];
          console.log(this.vacBerth);
        }
        this.getValue();
      });

    } catch (EX) {
      console.log(EX);;
    }
  }
 */
  getCoaches() {
    try {
        this.storage.getTrainAssignment().then((res:any)=>{      
         this.coach=res.ASSIGNED_COACHES;
        for (let i = 0; i < this.coach.length; i++) {
          this.vacBerth[this.coach[i]] = [];
        }
        this.getValue();
        },(fail)=>{

        })
    } catch (EX) {
      console.log(EX);;
    }
  }

  getValue() {
    try {
      var query = { ALLOTED: "N" };
      var option = { exact: true };
      this.storage.getVacantBerth(query,option).then((res:any) => {
        for (let i = 0; i < res.length; i++) {
          this.vacBerth[res[i].json.COACH_ID].push({
            COACH_ID: res[i].json.COACH_ID,
            BERTH_NO: res[i].json.BERTH_NO,
            CLASS: res[i].json.CLASS,
            BERTH_INDEX: res[i].json.BERTH_INDEX,
            SRC: res[i].json.SRC,
            DEST: res[i].json.DEST,
            REASON: res[i].json.REASON
          });
          console.log(this.vacBerth);
        }
        for (let rowkey in this.vacBerth) {
          var rowval = this.vacBerth[rowkey];
          this.tabs.push({
            key: rowkey,
            value: rowval,
            badge: rowval.length
          });
          console.log(this.tabs);

        }
      });
    } catch (EX) {
      console.log(EX);;
    }
  }

  /* getValue() {
    try {
      var query = { ALLOTED: "N" };
      var option = { exact: true };
      WL.JSONStore.get('vacantberth').find(query, option).then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.vacBerth[res[i].json.COACH_ID].push({
            COACH_ID: res[i].json.COACH_ID,
            BERTH_NO: res[i].json.BERTH_NO,
            CLASS: res[i].json.CLASS,
            BERTH_INDEX: res[i].json.BERTH_INDEX,
            SRC: res[i].json.SRC,
            DEST: res[i].json.DEST,
            REASON: res[i].json.REASON
          });
          console.log(this.vacBerth);
        }
        for (let rowkey in this.vacBerth) {
          var rowval = this.vacBerth[rowkey];
          this.tabs.push({
            key: rowkey,
            value: rowval,
            badge: rowval.length
          });
          console.log(this.tabs);

        }
      });
    } catch (EX) {
      console.log(EX);;
    }
  } */

}




