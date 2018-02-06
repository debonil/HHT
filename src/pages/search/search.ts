import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PsngDataServiceProvider } from "../../providers/psng-data-service/psng-data-service";
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
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
  items;
    loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public pdsp: PsngDataServiceProvider, public loadingCtrl: LoadingController) {
  //  this.initializeItems();
 // this.loadPsgnData();
   this.presentLoadingDefault();

  this.initializeItems();
  }

   presentLoadingDefault() {
     this.loading = this.loadingCtrl.create({
      content: 'Loading Occupancy...'
    });

    this.loading.present();

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.loadPsgnData();
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

  initializeItems(){
    this.items=this.psgnArr;
  }
  onInput(ev) {
    this.initializeItems();
    var val = ev.target.value;
    this.countCheck.push(val);
   // if (val.length > 3) {
      if (isNaN(val)) {
        if (val ) {
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
   // }
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
