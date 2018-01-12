import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RacmodalPage } from '../racmodal/racmodal';
import { LoadingController, ViewController } from 'ionic-angular';
import { RacTabPage } from "../rac-tab/rac-tab";
//import { StorageProvider } from '../../providers/storage/storage';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

//import { RacServiceProvider } from '../../providers/rac-service/rac-service';
//import { IonTextAvatar } from 'ionic-text-avatar';
declare var WL;
/**
 * Generated class for the RacPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rac',
  templateUrl: 'rac.html',
})
export class RacPage {
  [x: string]: any;
  racBerth: any[] = [];
  title: any;
  psgnArr: any[];
  temp: any[] = [];
  vacBerth: any[] = [];
  vacArr:any[]=[];
  islArray:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public viewCtrl: ViewController, private storage: StorageServiceProvider
  ) {
    console.log(JSON.stringify(this.navParams.data));
    this.navParams.data.sort(function (a, b) {
      return a.berthNo - b.berthNo;
    });
    this.racBerth = this.navParams.data;
    this.populateISL();
  }

  populateISL() {
    try {
      this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res: any) => {
        // this.storage.getTrainAssignmentDocument().then((res: any) => {
        this.resArr = res[0].json.ISL;
        // alert("loading stations: " + JSON.stringify(this.resArr));
        for (let i = 0; i < this.resArr.length; i++) {
          this.islArray.push({
            STN_CODE: this.resArr[i].STN_CODE

          });
        }
        console.log(JSON.stringify(this.islArray));

      });
    } catch (ex) {
      alert(ex);
    }
  }


  replacePassenger(coachId, berthNo) {
    var option = { exact: true };
    var query = { COACH_ID: coachId, BERTH_NO: berthNo };
    this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE, query).then((res: any[]) => {

      //this.storage.findPassenger(query).then((res) => {
      res[0].json.NEW_COACH_ID = res[0].json.COACH_ID;
      res[0].json.NEW_BERTH_NO = res[0].json.BERTH_NO;
      res[0].json.REMARKS = 'CNF';
      this.storage.replace(this.storage.collectionName.PASSENGER_TABLE, res).then((success) => {
        console.log("passenger updated successfully" + JSON.stringify(success));
      }, (fail) => {
        console.log("failed to update passenger " + JSON.stringify(fail));
      });
    }, (fail) => {

    });
  }


  showAlertPopup(item) {
    try {

  /**********************BOTH PASSENGERS NOT PRESENT******************************/    
      if (item.value[0].ATTENDANCE_MARKER === 'A' && item.value[1].ATTENDANCE_MARKER === 'A') {
        if ((JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO)) > (JSON.stringify(this.islArray).indexOf(item.value[1].RES_UPTO))) {
          this.vacBerth.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[0].RES_UPTO,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[1].RES_UPTO,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });

        }
        else if ((JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO)) < (JSON.stringify(this.islArray).indexOf(item.value[1].RES_UPTO))) {
          this.vacBerth.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[1].RES_UPTO,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[0].RES_UPTO,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });

        }
        else if ((JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO)) === (JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO))) {
          this.vacBerth.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[0].RES_UPTO,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[0].RES_UPTO,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });

        }
        var query = { COACH_ID: this.vacBerth[0].COACH_ID, BERTH_NO: this.vacBerth[0].BERTH_NO, SRC: this.vacBerth[0].SRC, DEST: this.vacBerth[0].DEST };
        var option = { exact: true };
        this.storage.getDocuments(this.storage.collectionName.VACANT_BERTH_TABLE, query, option).then((res) => {
          if (res.length > 0) {
            alert("this vacant berth already exists !!!");
          } else {
            this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE, this.vacBerth).then((success) => {
              console.log("Vacant berth added successfully:: " + JSON.stringify(success));
            }, (fail) => {
              console.log("Failed to add vacant berth :: " + JSON.stringify(fail));

            });
          }
        }, (fail) => {
          console.log("Failed to find vacant berth :: " + JSON.stringify(fail));
        });


      }

  /**********************SECOND PASSENGERS NOT PRESENT******************************/    

      if (item.value[0].ATTENDANCE_MARKER === 'P' && item.value[1].ATTENDANCE_MARKER === 'A') {
        if ((JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO)) < (JSON.stringify(this.islArray).indexOf(item.value[1].RES_UPTO))) {
          this.vacBerth.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[1].RES_UPTO,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[0].RES_UPTO,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });
          this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE, this.vacBerth).then((success) => {
            console.log("Vacant berth added successfully:: " + JSON.stringify(success));
          }, (fail) => {
            console.log("Failed to add vacant berth :: " + JSON.stringify(fail));

          });
        }

        if ((JSON.stringify(this.islArray).indexOf(item.value[0].BOARDING_PT)) > (JSON.stringify(this.islArray).indexOf(item.value[1].BOARDING_PT))) {
          this.vacArr.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[0].BOARDING_PT,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[1].BOARDING_PT,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });
          this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE, this.vacArr).then((success) => {
            console.log("Vacant berth added successfully:: " + JSON.stringify(success));
          }, (fail) => {
            console.log("Failed to add vacant berth :: " + JSON.stringify(fail));

          });
        }
        this.replacePassenger(item.value[0].COACH_ID, item.value[0].BERTH_NO);
        item.value[0].REMARKS = 'CNF';
        item.value[0].NEW_PRIMARY_QUOTA = "CNF";

      }


  /**********************FIRST PASSENGERS NOT PRESENT******************************/    

      if (item.value[0].ATTENDANCE_MARKER === 'A' && item.value[1].ATTENDANCE_MARKER === 'P') {
        if ((JSON.stringify(this.islArray).indexOf(item.value[1].RES_UPTO)) < (JSON.stringify(this.islArray).indexOf(item.value[0].RES_UPTO))) {
          this.vacBerth.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[0].RES_UPTO,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[1].RES_UPTO,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });
          this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE, this.vacBerth).then((success) => {
            console.log("Vacant berth added successfully:: " + JSON.stringify(success));
          }, (fail) => {
            console.log("Failed to add vacant berth :: " + JSON.stringify(fail));

          });
        }

         if ((JSON.stringify(this.islArray).indexOf(item.value[1].BOARDING_PT)) > (JSON.stringify(this.islArray).indexOf(item.value[0].BOARDING_PT))) {
          this.vacArr.push({
            CLASS: item.value[0].CLASS,
            CAB_CP_ID: item.value[0].CAB_CP_ID,
            COACH_ID: item.value[0].COACH_ID,
            REASON: 'V',
            ALLOTED: 'N',
            DEST: item.value[1].BOARDING_PT,
            REMOTE_LOC_NO: item.value[0].REMOTE_LOC_NO,
            SYSTIME: item.value[0].SYSTIME,
            SUB_QUOTA: item.value[0].SUB_QUOTA,
            BERTH_INDEX: item.value[0].BERTH_INDEX,
            SRC: item.value[0].BOARDING_PT,
            TRAIN_ID: item.value[0].TRAIN_ID,
            PRIMARY_QUOTA: '-',
            CH_NUMBER: item.value[0].CH_NUMBER,
            BERTH_NO: item.value[0].BERTH_NO,
            CAB_CP: item.value[0].CAB_CP
          });
          this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE, this.vacArr).then((success) => {
            console.log("Vacant berth added successfully:: " + JSON.stringify(success));
          }, (fail) => {
            console.log("Failed to add vacant berth :: " + JSON.stringify(fail));

          });
        }
        this.replacePassenger(item.value[1].COACH_ID, item.value[1].BERTH_NO);
        item.value[1].REMARKS = 'CNF';
        item.value[1].NEW_PRIMARY_QUOTA = "CNF";

      }

  /**********************BOTH PASSENGERS PRESENT******************************/    

      if (item.value[0].ATTENDANCE_MARKER === 'P' && item.value[1].ATTENDANCE_MARKER === 'P') {
        this.psgnArr = item;
        let myModal = this.modalCtrl.create(RacmodalPage, item);
        myModal.onDidDismiss(data => {
          if (data[0][0].json.PNR_NO === item.value[0].PNR_NO && data[0][0].json.REL_POS === item.value[0].REL_POS) {
            item.value[1].REMARKS = "CNF";
            item.value[1].NEW_PRIMARY_QUOTA = "CNF";
            item.value[0].COACH_ID = data[0][0].json.COACH_ID;
            item.value[0].BERTH_NO = data[0][0].json.BERTH_NO;
            item.value[0].REMARKS = "CNF";
            item.value[0].NEW_PRIMARY_QUOTA = "CNF";

            item.berthNo = data[0][0].json.BERTH_NO;
          }
          else if (data[0][0].json.PNR_NO === item.value[1].PNR_NO && data[0][0].json.REL_POS === item.value[1].REL_POS) {
            item.value[0].REMARKS = "CNF";
            item.value[0].NEW_PRIMARY_QUOTA = "CNF";

            item.value[1].COACH_ID = data[0][0].json.COACH_ID;
            item.value[1].BERTH_NO = data[0][0].json.BERTH_NO;
            item.value[1].REMARKS = "CNF";
            item.value[1].NEW_PRIMARY_QUOTA = "CNF";

            item.berthNo = data[0][0].json.BERTH_NO;

          }

        });
        myModal.present();

      }



    } catch (ex) {
      alert(ex);
    }


  }


  ionViewDidEnter() {
    console.log("page loaded---");
    var temp = this.racBerth;
    this.racBerth = [];
    this.racBerth = temp;
  }

}
