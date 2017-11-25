import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NcPreviewPage } from '../nc-preview/nc-preview';

declare var WL;
declare var WLResourceRequest;

@IonicPage()
@Component({
  selector    : 'page-nc-psgn',
  templateUrl : 'nc-psgn.html',
})
export class NcPsgnPage {

  NC_TO_NT  = new Array();
  NC_TO_TU  = new Array();
  NC_ALL    = new Array();
  NC_ROWS   : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl : ModalController) {
    
    this.GET_NC_PSGN();
  }

  GET_NC_PSGN(){
    try{
      var query = {
				ATTENDANCE_MARKER : '-'
      };
      WL.JSONStore.get('passenger').find(query).then( (res)=> {
        if(res.length > 0){
          this.NC_ROWS = res;
        }else{
          alert('THERE IS NO NOT CHECKED PASSENGERS IN THE CHART');
        }
      }).fail((fail)=> {
        alert('FAIL TO FINF NC PSGN : ' +JSON.stringify(fail));
      });
    }catch(ex){
      alert('EXCEPTION @ nc-psgn.ts : ' +ex);
    }
  }

  NC_PREVIEW(){
    try {
      this.NC_TO_NT  = [];
      this.NC_TO_TU  = [];
      this.NC_ALL    = [];
      this.NC_ROWS.forEach(element => {
        if(element.json.ATTENDANCE_MARKER == 'A'){
          this.NC_TO_NT.push(element);
        }else{
          if(element.json.ATTENDANCE_MARKER == 'P'){
            this.NC_TO_TU.push(element);
          }
        }
      });
      this.NC_ALL.push({
        NT  : this.NC_TO_NT,
        TU  : this.NC_TO_TU
      });
      console.log('NC_ALL : ' +JSON.stringify(this.NC_ALL));
      let modal = this.modalCtrl.create(NcPreviewPage, this.NC_ALL);
      modal.present();
    } catch (ex) {
      alert('EXCEPTION NC_PREVIEW @ NC-Psgn.js');
    }
  }

}
