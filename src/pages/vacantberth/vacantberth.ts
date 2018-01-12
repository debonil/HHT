import { Component, NgModule, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicPageModule } from 'ionic-angular';
declare var WL;

@IonicPage()
@Component({
  selector: 'page-vacantberth',
  templateUrl: 'vacantberth.html',
})
export class VacantberthPage {
  vacBerth: any[] = [];
  title: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.data);
     this.navParams.data.sort(function (a, b) {
      return a.BERTH_NO - b.BERTH_NO;
    }); 
    this.vacBerth = this.navParams.data;
  }

}
