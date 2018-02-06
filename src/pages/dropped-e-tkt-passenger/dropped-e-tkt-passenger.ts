import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";
/**
 * Generated class for the DroppedETktPassengerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dropped-e-tkt-passenger',
  templateUrl: 'dropped-e-tkt-passenger.html',
})
export class DroppedETktPassengerPage {
 // droppedPsgnArr: any = [];
  droppedPsgnArr;
  searchTerm: string = '';
  val :any;
  items:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageServiceProvider) {
    this.getDroppedETicketPassenger();
    this.loadDroppedPassenger();
  // this.initializeItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DroppedETktPassengerPage');
    //this.getDroppedETicketPassenger();
  }

  loadDroppedPassenger(){
    this.storage.getDocuments(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE).then((res) => {
     res.forEach(data=>{
       this.items.push({
         PNR_NO         : data.json.PNR_NO,
         WAITLIST_NO    : data.json.WAITLIST_NO,
         PSGN_NAME      : data.json.PSGN_NAME,
         AGE_SEX        : data.json.AGE_SEX,
         BOARDING_POINT : data.json.BOARDING_POINT,
         RES_UPTO       : data.json.RES_UPTO
        
       });
     });  
    });
  }
  
  getDroppedETicketPassenger() {
    try {
     this.droppedPsgnArr= this.items;
    } catch (ex) {
      console.log("failed to load dropped e ticket passenger " + ex);
    }
  }

  getItems(ev) {
   this.getDroppedETicketPassenger();
    var val = ev.target.value;
    if (isNaN(val)){
       if (val && val.trim() != '') {
      this.droppedPsgnArr = this.droppedPsgnArr.filter((item) => {
        return (item.PSGN_NAME.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    }else{
        if (val && val.trim() != '') {
      this.droppedPsgnArr = this.droppedPsgnArr.filter((item) => {
        return (item.PNR_NO.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    }
    
  }
}
