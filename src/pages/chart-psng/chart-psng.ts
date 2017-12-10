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
  passengerSelectorViewObj:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,
    private vibration: Vibration) {
    this.rows = this.navParams.data.psngdata;
    this.readonly = this.navParams.data.readonly; 
    this.passengerSelectorViewObj = this.navParams.data.psngSelectorViewObj;
    console.log(this.navParams.data);
  }

  checkBoxChanged(item){
    if(item.selected){
      item.selected=false;
      this.passengerSelectorViewObj.selectedPassengerItems.pop(item);
      if(this.passengerSelectorViewObj.selectedPassengerItems.length==0){
        this.passengerSelectorViewObj.isActive=false;
      }
    }else{
      item.selected=true;
      this.passengerSelectorViewObj.selectedPassengerItems.push(item);

    }
    
  }

  onItemPressed(item){
    if(this.passengerSelectorViewObj.isActive){
      //do nothing or release actove
    }else{
      this.vibration.vibrate(40);
      item.selected=true;
      this.passengerSelectorViewObj.isActive=true;
      this.passengerSelectorViewObj.selectedPassengerItems.push(item);
      this.passengerSelectorViewObj.activate();
    }
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