import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ChartPsngPage } from '../chart-psng/chart-psng';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

@IonicPage()
@Component({
  selector: 'page-chart-preview',
  templateUrl: 'chart-preview.html',
})
export class ChartPreviewPage {

  chartComponent: any = ChartPsngPage;

  coachwiseChartData = [];
  psngObjArr: Array<any> = [];
  vbObjArr: Array<any> = [];
  loader: any;
  completion: number = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private loading: LoadingController,
    private alert: AlertController, private logger: LoggerProvider,
    private backend: BackendProvider, public toastCtrl: ToastController) {

  }
  ionViewDidEnter() {
    this.coachwiseChartData = this.navParams.data.coachwiseChartData;
    console.log(this.navParams.data.coachwiseChartData);
  }
  alertToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  showLoader(msg) {
    if (!this.loader) {
      this.loader = this.loading.create({ content: msg });
    } else {
      this.loader.dismiss();
      this.loader = this.loading.create({ content: msg });
    }

    this.loader.present();

  }
  savePsngBerthDataLocally() {
    this.showLoader("Saving data... ");
    this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
      coachpsngbrth.value.forEach((psngbrth, ind2) => {
        if (!psngbrth._isLocked && psngbrth._status > 0) {
          psngbrth._isLocked = true;
          this.psngObjArr.push(psngbrth);
          if (psngbrth._status == 2)
            this.vbObjArr.push(this.convertPsngToVBerth(psngbrth));
        }
      });
    });
    /* this.storage.replacePassenger(this.psngObjArr.map(p => p.dbObj)).then(success => {
      this.loader.dismiss();
      this.alertToast("Data saved successfully!!");
      this.modal_Close();
      this.storage.appendVacantBerth(this.vbObjArr).then((success) => {
        if (success) {
          this.alertToast("Generated vacant berths!!");
        } else {
          this.alertToast("Data Saved Failed!!" + JSON.stringify(success));
        }
      });
    }); */
    

  }

  private convertPsngToVBerth(psngbrth) {
    return {
      TRAIN_ID: psngbrth.TRAIN_ID,
      COACH_ID: psngbrth.COACH,
      BERTH_NO: psngbrth.BN,
      CLASS: psngbrth.CLASS,
      REMOTE_LOC_NO: psngbrth.REMOTE_LOC_NO,
      BERTH_INDEX: psngbrth.BERTH_INDEX,
      SRC: psngbrth.BRD,
      DEST: psngbrth.DEST,
      ALLOTED: "N",
      REASON: "V",
      CAB_CP: psngbrth.CAB_CP,
      CAB_CP_ID: psngbrth.CAB_CP_ID,
      CH_NUMBER: psngbrth.CH_NUMBER,
      PRIMARY_QUOTA: psngbrth.QT,
      SUB_QUOTA: psngbrth.SUB_QUOTA,
      SYSTIME: psngbrth.SYSTIME,

      // CAB_CP: psngbrth.CAB_CP,
      // TRAIN_ID: psngbrth.TRAIN_ID,
      // SRC: psngbrth.BOARDING_PT,
      // SYSTIME: psngbrth.SYSTIME,
      // CLASS: psngbrth.CLASS,
      // PRIMARY_QUOTA: psngbrth.QT,
      // CAB_CP_ID: psngbrth.CAB_CP_ID,
      // SUB_QUOTA: psngbrth.SUB_QUOTA,
      // REMOTE_LOC_NO: psngbrth.REMOTE_LOC_NO,
      // BERTH_NO: psngbrth.BN,
      // COACH_ID: psngbrth.COACH,
      // CH_NUMBER: psngbrth.CH_NUMBER,
      // ALLOTED: 'N',
      // REASON: 'V',
      // DEST: psngbrth.JRNY_TO,
      // BERTH_INDEX: psngbrth.BERTH_INDEX
    };
  }

  modal_Close() {
    this.viewCtrl.dismiss();
  }


}
