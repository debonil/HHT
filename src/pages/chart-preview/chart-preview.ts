import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ChartPsngPage } from '../chart-psng/chart-psng';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';


interface CoachChartStatus{
  coachId:string;
  tuCount :number;
  ntCount :number;
  ncCount :number;
}

@IonicPage()
@Component({
  selector: 'page-chart-preview',
  templateUrl: 'chart-preview.html',
})

export class ChartPreviewPage {
  load: any;
  currNtTotal : number = 0 ;
  currTuTotal : number = 0 ;
  curr_TU: any[] = [];
  curr_NT: any[] = [];

  coachWiseChartStatus :CoachChartStatus[]=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController, 
    private pdsp: PsngDataServiceProvider,
    //private storage: StorageServiceProvider, 
    private loading: LoadingController,
    private alert: AlertController, 
    private logger: LoggerProvider,
    private backend: BackendProvider, 
    public toastCtrl: ToastController) {
    
  }


  presentLoadingDefault() {
    this.load = this.loading.create({
      content: 'Loading Preview...'
    });

    this.load.present();
  }

  status(val) {

    val.forEach(element => {
      let curr_TU_count = 0;
      let curr_NT_count = 0;
     // console.log(element.key);
     let cStatus:CoachChartStatus= {
        coachId:"",
        tuCount : 0,
        ntCount : 0,
        ncCount :0
    }
    cStatus.coachId=element.key;
      element.value.forEach(data => {
        if (data._isLocked) {
          if (data._status == 1) {
            cStatus.tuCount++;
          }
          else if (data._status == 2) {
            cStatus.ntCount++;
          }
        }

        if (!(data._isLocked)) {
          cStatus.ncCount++;
          if (data._status == 1) {
            curr_TU_count++;
            this.currTuTotal++;
          }
          else if (data._status == 2) {
            curr_NT_count++;
            this.currNtTotal++;
          }
        }

      });
      this.coachWiseChartStatus.push(cStatus);
      if (curr_TU_count > 0) {
        this.curr_TU.push({
          count: curr_TU_count,
          key: element.key
        });
      }

      if (curr_NT_count > 0) {
        this.curr_NT.push({
          count: curr_NT_count,
          key: element.key
        });
      }

    });


   // this.load.dismiss();
  //  console.log(this.coachWiseChartStatus);
    
  }

  ionViewDidEnter() {
   console.log(this.navParams.data);
   // this.status(this.navParams.data.coachwiseChartData);
        this.status(this.navParams.data);

  }
  alertToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  showLoader(msg) {
    if (!this.load) {
      this.load = this.loading.create({ content: msg });
    } else {
      this.load.dismiss();
      this.load = this.loading.create({ content: msg });
    }

    this.load.present();

  }
  
   savePsngBerthDataLocally() {
    this.showLoader("Saving data... ");
    this.pdsp.savePsngBerthDataLocally()
      .then((resp) => {
        this.load.dismiss();
        this.modal_Close() ;
        if (resp["success"]) {
          this.alertToast("Data saved successfully!!");
        } else {
          alert("Data could not be saved!! \n ERROR : " + JSON.stringify(resp));
        }
      })
      .catch((error) => {
        this.load.dismiss();
        alert("Data could not be saved!! \n ERROR : " + JSON.stringify(error));
      });
  } 

  

  modal_Close() {
    this.viewCtrl.dismiss();
  }


}
