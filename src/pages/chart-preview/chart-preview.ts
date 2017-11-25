import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ChartPsngPage } from '../chart-psng/chart-psng';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';

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
    public viewCtrl: ViewController, private storage: StorageProvider, private loading: LoadingController,
    private alert: AlertController, private logger: LoggerProvider,
    private backend: BackendProvider, public toastCtrl: ToastController) {

  }
  ionViewDidEnter(){
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
    this.showLoader("Organizing data before save..");
    this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
      var progressObj = {
        coach: coachpsngbrth.key,
        total: coachpsngbrth.value.length,
        progressval: 0
      }
      coachpsngbrth.value.forEach((psngbrth, ind2) => {
        if (!psngbrth._isLocked) {
          psngbrth._isLocked=psngbrth.IS_CHECKED;
          var psngObj = {
            id: psngbrth.ID,
            am: psngbrth.IS_CHECKED ? (psngbrth.TU_NT ? "P" : "A") : "-"
          }
          this.psngObjArr.push(psngObj);
          if (psngbrth.IS_CHECKED && !psngbrth.TU_NT)
            this.vbObjArr.push(this.convertPsngToVBerth(psngbrth));
          ++progressObj.progressval;
        }
      });
    });
    this.loader.dismiss();
    this.psngObjArr.forEach((psngam, i, array) => {
      this.storage.getDocumentById("passenger", psngam.id).then((dbobj) => {
       // console.log(dbobj);
        dbobj["json"].ATTENDANCE_MARKER = psngam.am;
        psngam["dbobj"] = dbobj;
        if (++this.completion == array.length) {
          //console.log(this.psngObjArr.map(p => p.dbobj));
          this.storage.replacePassenger(this.psngObjArr.map(p => p.dbobj)).then(success => {

            this.storage.appendVacantBerth(this.vbObjArr).then((success) => {
              if (success) {
                this.alertToast("Data saved successfully!!");
                this.modal_Close();
              } else {
                this.alertToast("Data Saved Failed!!" + JSON.stringify(success));
              }
            });
          });
        }
      });
    });

  }

  savePsngBerthDataLocally2() {
    this.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
      var progressObj = {
        coach: coachpsngbrth.key,
        total: coachpsngbrth.value.length,
        progressval: 0
      }
      coachpsngbrth.value.forEach((psngbrth, ind2) => {
        if (psngbrth.IS_CHECKED) {
          console.log("started ind1=> " + ind1 + "; ind1=> " + ind2 + "; psngbrth.id=>" + JSON.stringify(psngbrth.ID));
          this.storage.updateAttendanceMarker(psngbrth.ID, psngbrth.TU_NT, psngbrth.IS_CHECKED).then((success1) => {
            console.log("updateAttendanceMarker ind1=> " + ind1 + "; ind1=> " + ind2 + "; psngbrth.id=>" + JSON.stringify(psngbrth.ID));
            if (success1) {
              if (!psngbrth.TU_NT) {
                var vacberth = this.convertPsngToVBerth(psngbrth);
                this.storage.appendVacantBerth(vacberth).then((success) => {
                  console.log("appendVacantBerth ind1=> " + ind1 + "; ind1=> " + ind2 + "; psngbrth.id=>" + JSON.stringify(psngbrth.ID));
                  if (success) {
                    ++progressObj.progressval;
                  } else {
                    this.alertToast("Data Saved Failed!!" + JSON.stringify(vacberth));
                  }
                });
              } else {
                ++progressObj.progressval;
              }
            } else {
              this.alertToast("Data Saved Failed!!" + JSON.stringify(psngbrth));
            }
          });

          console.log("ended ind1=> " + ind1 + "; ind1=> " + ind2 + "; psngbrth.id=>" + JSON.stringify(psngbrth.ID));
        } else {
          //++progressObj.progressval;
        }
      });
      //this.progressObjArr.push(progressObj);
    });
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

  /*   Confirm_SUBMIT() {
      try {
        this.NT_CHART_SUMMARY = [];
        this.NC_CHART_SUMMARY = [];
        this.NT_PSGN_UPDT = [];
        this.NT_PSGN_UPDT = [];
        this.NT_BERTH_ADD = [];
        for (let item of this.COACHTIME) {
          item.CHECKING_END_TIME = this.getCurrentTime();
        }
        WL.JSONStore.get('CoachTime').add(this.COACHTIME).then((res) => {
          this.alertToast('Coach Time Added: ' + res);
        });
        for (let item of this.NT_PREVIEW) {
          var obj = {
            COACH_ID: item.COACH,
            BERTH: item.BN,
            PNR: item.PNR,
            NAME: item.NAME,
            BRD_PT: item.BRD,
            RES_UPTO: item.DEST,
            QUOTA: item.QT,
            REL_POS: item.RS,
            STATUS: item.REMARKS,
            VAC_BERTH: 'Y',
            UPDT_PSGN: 'NT',
            RAC_TYPE: 'N'
          }
          this.NT_CHART_SUMMARY.push(obj);
        }
        for (let item of this.NC_PREVIEW) {
          var obj = {
            COACH_ID: item.COACH,
            BERTH: item.BN,
            PNR: item.PNR,
            NAME: item.NAME,
            BRD_PT: item.BRD,
            RES_UPTO: item.DEST,
            QUOTA: item.QT,
            REL_POS: item.RS,
            STATUS: item.REMARKS,
            VAC_BERTH: 'N',
            UPDT_PSGN: 'NC',
            RAC_TYPE: 'N'
          }
          this.NC_CHART_SUMMARY.push(obj);
        }
        this.EXECUTE_SUMMARY_NT_PSGN();
        this.EXECUTE_SUMMARY_NC_PSGN();
      } catch (ex) {
        this.alertToast('EXCEPTION Confirm_SUBMIT @ chart-preview.ts : ' + ex);
      }
    }
  
    EXECUTE_SUMMARY_NT_PSGN() {
      try {
        var query = [];
        var options = {
          exact: true
        };
        this.NT_CHART_SUMMARY.forEach(val => {
          query.push({
            PNR_NO: val.PNR,
            REL_POS: val.REL_POS
          });
        });
        WL.JSONStore.get('Passenger').find(query, options).then((res) => {
          res.forEach(psgn => {
            this.NT_CHART_SUMMARY.forEach(NTPsgn => {
              if (NTPsgn.PNR == psgn.json.PNR_NO && NTPsgn.REL_POS == psgn.json.REL_POS) {
                psgn.json.ATTENDANCE_MARKER = 'A';
                psgn.json.REMARKS = 'PDNTU';
  
                this.NT_PSGN_UPDT.push(psgn);
  
                if (NTPsgn.VAC_BERTH == 'Y') {
                  var berth = {
                    CAB_CP: psgn.json.CAB_CP,
                    TRAIN_ID: psgn.json.TRAIN_ID,
                    SRC: psgn.json.BOARDING_PT,
                    SYSTIME: psgn.json.SYSTIME,
                    CLASS: psgn.json.CLASS,
                    PRIMARY_QUOTA: psgn.json.PRIMARY_QUOTA,
                    CAB_CP_ID: psgn.json.CAB_CP_ID,
                    SUB_QUOTA: psgn.json.SUB_QUOTA,
                    REMOTE_LOC_NO: psgn.json.REMOTE_LOC_NO,
                    BERTH_NO: psgn.json.BERTH_NO,
                    COACH_ID: psgn.json.COACH_ID,
                    CH_NUMBER: psgn.json.CH_NUMBER,
                    ALLOTED: 'N',
                    REASON: 'V',
                    DEST: psgn.json.JRNY_TO,
                    BERTH_INDEX: psgn.json.BERTH_INDEX
                  };
                  this.NT_BERTH_ADD.push(berth);
                }
              }
            });
          });
          this.UPDT_PSGN_IN_COLLECTION(this.NT_PSGN_UPDT);
          this.ADD_BERTHS_IN_COLLECTION(this.NT_BERTH_ADD);
        });
      } catch (ex) {
        this.alertToast('EXCEPTION EXECUTE_SUMMARY_NT_PSGN @ chart-preview.ts : ' + ex);
      }
    }
  
    EXECUTE_SUMMARY_NC_PSGN() {
      try {
        var query = [];
        var options = {
          exact: true
        };
        this.NC_CHART_SUMMARY.forEach(val => {
          query.push({
            PNR_NO: val.PNR,
            REL_POS: val.REL_POS
          });
        });
        WL.JSONStore.get('Passenger').find(query, options).then((res) => {
          res.forEach(psgn => {
            this.NC_CHART_SUMMARY.forEach(NCPsgn => {
              if (NCPsgn.PNR == psgn.json.PNR_NO && NCPsgn.REL_POS == psgn.json.REL_POS) {
                psgn.json.ATTENDANCE_MARKER = '-';
                psgn.json.REMARKS = 'PNCY';
  
                this.NC_PSGN_UPDT.push(psgn);
              }
            });
          });
          this.UPDT_PSGN_IN_COLLECTION(this.NC_PSGN_UPDT);
        });
      } catch (ex) {
        this.alertToast('EXCEPTION EXECUTE_SUMMARY_NC_PSGN @ chart-preview.ts : ' + ex);
      }
    } */
  modal_Close() {
    this.viewCtrl.dismiss();
  }


}
