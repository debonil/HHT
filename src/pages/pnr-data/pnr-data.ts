import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { CoachwiseChartViewPage } from "../coachwise-chart-view/coachwise-chart-view";

/**
 * Generated class for the PnrDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pnr-data',
  templateUrl: 'pnr-data.html',
})
export class PnrDataPage {
pnrData:any[]=[];
pnrValue:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:StorageServiceProvider,
  public viewCtrl: ViewController) {
    this.pnrData=this.navParams.data;
    this.getPNRDetails(this.pnrData[0].dbObj.json.PNR_NO);
  }

  getPNRDetails(data){
   var query={PNR_NO: data};
    var option={exact:true};
    this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query,option).then((res)=>{
      res.forEach(val=>{
        this.pnrValue.push(val);
      });
      console.log(JSON.stringify(this.pnrValue));
    });
  } 
  ionViewDidLoad() {
    console.log('ionViewDidLoad PnrDataPage');
  }
  close(){
     this.viewCtrl.dismiss();
  }

}
