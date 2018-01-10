import { Component } from '@angular/core';
//import { StorageProvider } from '../../providers/storage/storage';
import {StorageServiceProvider} from '../../providers/storage-service/storage-service';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { WaitlistModelPage } from '../../pages/waitlist-model/waitlist-model';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
/**
 * Generated class for the WaitListPsngComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'wait-list-psng',
  templateUrl: 'wait-list-psng.html'
})
export class WaitListPsngComponent {
  waitlist:any=[];
  confirmed_waitlist: any =[];
  non_confirmed_waitlist: any =[];

  trainAssignmentObject : any;
  
  constructor(private storageService : StorageServiceProvider, private modalCtrl : ModalController,
    private navCtrl: NavController, public navParams: NavParams,private pdsp: PsngDataServiceProvider) {
    this.trainAssignmentObject = this.pdsp.trainAssignmentObject;
      
    var query = {
      $equal : [{'CLASS' : navParams.data.class}],
      $greaterThan : [{'BERTH_INDEX':0},{'WAITLIST_NO':0}]
    };  
    var option = {
      exact : true
    };
    this.storageService.getDocumentsAdvanced(this.storageService.collectionName.PASSENGER_TABLE, query, option).then(res=>{
      this.confirmed_waitlist = res;
    });

    var query2 = {
      $equal : [{'CLASS' : navParams.data.class},{'BERTH_INDEX':-1}]
    };

    this.storageService.getDocumentsAdvanced(this.storageService.collectionName.PASSENGER_TABLE, query2, option).then(res=>{
      this.non_confirmed_waitlist = res;
    });
  }

  onWaitlistClick(event, item){
    console.log('E I ');
    console.log(event);
    console.log(item);
    this.navCtrl.push(WaitlistModelPage, item);
  }
}
