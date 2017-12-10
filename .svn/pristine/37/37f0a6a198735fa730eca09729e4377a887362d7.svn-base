import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { ShiftPsgnPage } from '../shift-psgn/shift-psgn';
@Component({
  selector: 'page-chart',
  templateUrl: 'chart-psng.html'
})
export class  ChartPsngPage {
  private rows : any;
  private readonly : boolean;
  listitems;
  selectedItems=new Array();
  myIcon : string;
  someArray=new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,
    private vibration: Vibration) {
    this.rows = this.navParams.data.psngdata;
    this.readonly = this.navParams.data.readonly; 
    console.log(this.navParams.data);
  }

  checkBoxChanged(val){
console.log(val);

  }

  onItemHold(item){
    console.log(item);
    this.vibration.vibrate(50);
    //alert(item.BN);
  }

  chartItemClicked(val) {
    console.log(val);
    //alert(val);
  }

  openModel_ShiftPsgn(selectedPsgnData){
    let modal = this.modalCtrl.create(ShiftPsgnPage, selectedPsgnData);
    modal.present();
  }

}