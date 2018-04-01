import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
//import { Vibration } from '@ionic-native/vibration';
import { ShiftPsgnPage } from '../shift-psgn/shift-psgn';
import { Vibration } from '@ionic-native/vibration';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LongPressModule } from 'ionic-long-press';

import { UtilProvider } from '../../providers/util/util';
@Component({
  selector: 'page-chart',
  templateUrl: 'chart-psng.html'
})
export class ChartPsngPage {
  private rows: any;
  private readonly: boolean;
  listitems;
  selectedItems = new Array();
  myIcon: string;
  someArray = new Array();
  passengerSelectorViewObj: any;
  intialTime: any;
  endTime: any;
  result: any
  constructor(
    //public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private vibration: Vibration,
    public alertCtrl: AlertController, public util: UtilProvider
  ) {
    this.rows = this.navParams.data.psngdata;
    this.readonly = this.navParams.data.readonly;
    this.passengerSelectorViewObj = this.navParams.data.psngSelectorViewObj;
    // console.log(JSON.stringify(this.passengerSelectorViewObj));

  //  console.log(this.navParams.data);

  }

  /*  checkBoxChanged(val){
 console.log(val);
 
   } */
  checkBoxChanged(item) {
    //console.log("Item Value:  " + JSON.stringify(item.dbObj.json.ATTENDANCE_MARKER));
    if (item.dbObj.json.ATTENDANCE_MARKER == "P" && this.passengerSelectorViewObj.selectedPassengerItems[0].dbObj.json.ATTENDANCE_MARKER == "P") {
      if (item.selected) {
        // alert('checkBoxChanged if : ' + item.selected);
        item.selected = false;
        this.passengerSelectorViewObj.selectedPassengerItems.pop(item);
        if (this.passengerSelectorViewObj.selectedPassengerItems.length == 0) {
          //console.log(JSON.stringify(this.passengerSelectorViewObj.isActive = false));
          this.passengerSelectorViewObj.isActive = false;
        }
      } else {
        //alert('checkBoxChanged else: ' + item.selected);

        if (this.passengerSelectorViewObj.selectedPassengerItems.length < 2) {
          item.selected = true;
          this.passengerSelectorViewObj.selectedPassengerItems.push(item);

        }
      }

    } else {
      //alert('Please select a turn up passenger !!');

      if (item.selected) {
        // alert('checkBoxChanged if : ' + item.selected);
        item.selected = false;
        this.passengerSelectorViewObj.selectedPassengerItems.pop(item);
        if (this.passengerSelectorViewObj.selectedPassengerItems.length == 0) {
    //      console.log(JSON.stringify(this.passengerSelectorViewObj.isActive = false));

          this.passengerSelectorViewObj.isActive = false;
        }
      } else {
        //alert('checkBoxChanged else: ' + item.selected);
        // alert("on check: "+this.passengerSelectorViewObj.selectedPassengerItems.length);
        if (this.passengerSelectorViewObj.selectedPassengerItems.length < 1) {
          item.selected = true;
          this.passengerSelectorViewObj.selectedPassengerItems.push(item);

        }
      }


      //this.presentAlert();

    }


  }
  pressed() {
    
    /* var d = new Date();
    console.log(d.getSeconds());
    this.intialTime = d.getSeconds();;
    console.log("onPressStart"); */
  }
  active(item) { console.log("onPressing") 
  this.onItemPressed(item);
}
  released(item) {
    console.log("onPressEnd");
    /* timer for select passenger 3 sec*/
   /*  var d = new Date();    
    console.log(this.util.getCurrentDateString());
    this.endTime = d.getSeconds();
    this.result = this.endTime - this.intialTime;
    console.log(this.result); */

   /*  if (this.result > 1) {
      //alert('time out!!')
      //this.onItemPressed(item);
     
    }
 */

  }
  onItemPressed(item) {

    if (item.dbObj.json.ATTENDANCE_MARKER == "P") {

    //  console.log(JSON.stringify(this.passengerSelectorViewObj.isActive));

      if (item._isLocked) {
        if (this.passengerSelectorViewObj.isActive) {
          //alert('onItemPressed if');
          //do nothing or release actove
        } else {

          if (this.passengerSelectorViewObj.selectedPassengerItems.length < 2) {
            this.vibration.vibrate(40);
            item.selected = true;
            this.passengerSelectorViewObj.isActive = true;
            this.passengerSelectorViewObj.selectedPassengerItems.push(item);

            // this.passengerSelectorViewObj.activate();
          }
        }
      }
    } else {

      if (!item._isLocked && item._status == "0") {
        if (this.passengerSelectorViewObj.isActive) {
          //alert('onItemPressed if');
          //do nothing or release actove
        } else {

          if (this.passengerSelectorViewObj.selectedPassengerItems.length < 1) {

            this.vibration.vibrate(40);
            item.selected = true;
            this.passengerSelectorViewObj.isActive = true;
            this.passengerSelectorViewObj.selectedPassengerItems.push(item);
            // this.passengerSelectorViewObj.activate();
          }

        }
      }

      //alert('Please select a turned up passenger !!');
      //this.presentAlert()
    }

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Warning Alert',
      subTitle: ' Please select turned up passenger',
      buttons: ['Ok']
    });
    alert.present();
  }

  openModel_ShiftPsgn(selectedPsgnData) {
    let modal = this.modalCtrl.create(ShiftPsgnPage, selectedPsgnData);
    modal.onDidDismiss(res => {


    })
    modal.present();
  }

  /* onItemHold(item){
    console.log(item);
    this.vibration.vibrate(50);
    //alert(item.BN);
  } */

  /*  chartItemClicked(val) {
     console.log(val);
     //alert(val);
   }
 
   openModel_ShiftPsgn(selectedPsgnData){
     let modal = this.modalCtrl.create(ShiftPsgnPage, selectedPsgnData);
     modal.present();
   } */

}