import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
import { LoadingController } from 'ionic-angular';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

//import { FormControl } from '@angular/forms';
/**
 * Generated class for the SearchPage page.
 * @Author Ashutosh
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  countCheck: any[] = [];
  psgnArr: any[] = [];
  chartdata: any[];
  itemData: any[] = [];
  dropArr:any[]=[];
  items;
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public pdsp: PsngDataServiceProvider, public loadingCtrl: LoadingController,private storage: StorageServiceProvider) {
    this.presentLoadingDefault();
    this.getDroppedEtkt();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading passengers...'
    });
    this.loading.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.loadPsgnData();  
  }

  getDroppedEtkt(){
    this.storage.getDocuments(this.storage.collectionName.DROP_ETCKT_PSNG_TABLE).then((res)=>{
      res.forEach(element => {
         this.dropArr.push({
           COACH_ID      :'DROPPED',
           BERTH_NO      :'ETKT',
           WAITLIST_NO   :element.json.WAITLIST_NO,
           AGE_SEX       :element.json.AGE_SEX,
           BOARDING_PT   :element.json.BOARDING_POINT,
           PSGN_NAME     :element.json.PSGN_NAME,
           PNR_NO        :element.json.PNR_NO,
           RES_UPTO      :element.json.RES_UPTO,

         });
        //      console.log(JSON.stringify( this.dropArr));

      });
    })
  }

  loadPsgnData() {
    this.pdsp.findAll().subscribe(val => {
      this.chartdata = val.coachwiseChartData;
    });
    this.chartdata.forEach(data => {
      data.value.forEach(element => {
        this.psgnArr.push(element.dbObj.json);
      });
    });
    this.loading.dismiss();
  }


  initializeItems() {
    this.items = this.psgnArr.concat(this.dropArr);
  }

  
  onInput(ev) {
    this.initializeItems();
    var val = ev.target.value;
    this.countCheck.push(val);
    if (isNaN(val)) {
      if (val) {
        this.items = this.items.filter((item) => {
          return (item.PSGN_NAME.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      }
    } else {
      if (val && val.trim() != ' ') {
        this.items = this.items.filter((item) => {
          return (item.PNR_NO.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      }
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
