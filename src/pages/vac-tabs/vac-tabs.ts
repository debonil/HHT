import { Component, OnInit } from '@angular/core';
import { VacantberthPage } from '../../pages/vacantberth/vacantberth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getCoaches();
  }
  tabparams = { title: null };
  tab1Root = VacantberthPage;
  coach;
  vacBerth: any[] = [];
  tabs: any[] = [];

getCoaches(){
  try{
     WL.JSONStore.get('trainAssignment').findAll().then((res)=>{
       console.log(res);
       this.coach=res[0].json.ASSIGNED_COACH
       for(let i=0;i<this.coach.length;i++){
         this.vacBerth[this.coach[i].COACH_ID]=[];
         console.log(this.vacBerth);
       }
       console.log(this.coach);
      /*  for(let){

       } */
    //   this.vacBerth[res[0].json.ASSIGNED_COACH]=[];

       /* for(let i=0;i<res.length;i++){
          this.vacBerth[res[i].json.COACH_ID]=[];
       } */
      this. getValue();
     }) 

  }catch(EX){
    console.log(EX);;
  }
}

getValue(){
      WL.JSONStore.get('vacantberth').findAll().then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.vacBerth[res[i].json.COACH_ID].push({
            COACH_ID: res[i].json.COACH_ID,
            BERTH_NO: res[i].json.BERTH_NO,
            CLASS: res[i].json.CLASS,
            BERTH_INDEX: res[i].json.BERTH_INDEX,
            SRC: res[i].json.SRC,
            DEST: res[i].json.DEST,
            REASON: res[i].json.REASON
          })
        }
        for(let rowkey in this.vacBerth){
          var rowval=this.vacBerth[rowkey];
            this.tabs.push({
           key   : rowkey,
           value : rowval
         }) ;

        }


      });
}
}
  



