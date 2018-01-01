import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, ViewController } from 'ionic-angular';
import { RacTabPage } from "../rac-tab/rac-tab";
import { RacPage } from "../rac/rac";
import { StorageProvider } from '../../providers/storage/storage';

declare var WL;
/**
 * Generated class for the RacModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-racmodal',
  templateUrl: 'racmodal.html',
})
export class RacmodalPage {
  @ViewChild('nav') nav: NavController;

  vacArr: any = [];
  islArray: any = [];
  psgnArr;
  newVacBerth: any[] = [];
  psgnVal: any[] = [];
  psgnData: any[] = [];
  vacBerth;
  resArr;
  stn1: any = [];
  stn2: any = [];
  racArr: any[] = [];
  PSGN_UPDT = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public appCtrl: App, private storage: StorageProvider) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr);
    this.populateVacantBerth();
    this.populateISL();
  }

  populateISL() {
    try {
      this.storage.getTrainAssignmentDocument().then((res: any) => {
        this.resArr = res.json.ISL;
        alert("loading stations: " + JSON.stringify(this.resArr));
        for (let i = 0; i < this.resArr.length; i++) {
          this.islArray.push({
            STN_CODE: this.resArr[i].STN_CODE

          });
        }
      });
    } catch (ex) {
      alert(ex);
    }
  }

  populateVacantBerth() {
    try {
      var query = { ALLOTED: 'N' };
      var options = { exact: true };
      this.storage.getVacantBerth(query, options).then((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.vacArr = res;
        }
      });
    } catch (ex) {
      alert(ex);
    }
  }


  submit() {
    try {
      this.stn1.push({
        STN_CODE: this.psgnData[0].RES_UPTO
      });
      this.stn2.push({
        STN_CODE: this.vacBerth.json.DEST
      });
      alert("index of vacant berth : " + JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST))
      alert("index of passenger: " + JSON.stringify(this.islArray).indexOf(this.psgnData[0].RES_UPTO));
      if ((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST)) >= (JSON.stringify(this.islArray).indexOf(this.psgnData[0].RES_UPTO))) {
        console.log("greater ");
        if ((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST)) > (JSON.stringify(this.islArray).indexOf(this.psgnData[0].RES_UPTO))) {

          this.newVacBerth.push({
            CLASS: this.vacBerth.json.CLASS,
            CAB_CP_ID: this.vacBerth.json.CAB_CP_ID,
            COACH_ID: this.vacBerth.json.COACH_ID,
            REASON: this.vacBerth.json.REASON,
            ALLOTED: 'N',
            DEST: this.vacBerth.json.DEST,
            REMOTE_LOC_NO: this.vacBerth.json.REMOTE_LOC_NO,
            SYSTIME: this.vacBerth.json.SYSTIME,
            SUB_QUOTA: this.vacBerth.json.SUB_QUOTA,
            BERTH_INDEX: this.vacBerth.json.BERTH_INDEX,
            SRC: this.psgnData[0].RES_UPTO,
            TRAIN_ID: this.vacBerth.json.TRAIN_ID,
            PRIMARY_QUOTA: this.vacBerth.json.PRIMARY_QUOTA,
            CH_NUMBER: this.vacBerth.json.CH_NUMBER,
            BERTH_NO: this.vacBerth.json.BERTH_NO,
            CAB_CP: this.vacBerth.json.CAB_CP
          });
        }
        else {
          this.vacBerth.json.ALLOTED = 'Y';
          this.storage.replaceVacantBerth(this.vacBerth).then(() => {
            //     WL.JSONStore.get('vacantberth').replace(this.vacBerth).then(() => {
            this.addFirstPassenger();
          }, (f) => {
            alert("fail to replace vacant berth " + f);
          });
        }
      } else {
        alert("passenger Destination Cannot be after vacant berth destination");
        alert(this.newVacBerth.length);
        this.closeModal();
      }
      if (this.newVacBerth.length > 0) {
        //  var options = { exact: false };
        this.storage.appendVacantBerth(this.newVacBerth[0]).then((res) => {
          // WL.JSONStore.get('vacantberth').add(this.newVacBerth[0], options).then((res) => {
          this.vacBerth.json.ALLOTED = 'Y';
         this.storage.replaceVacantBerth(this.vacBerth).then(() => {
            this.addFirstPassenger();
          },(f) => {
            alert("fail to replace vacant berth " + f);
          });
        },(f) => {
          alert("failed to add new vacant berth");
        });
      }

    } catch (ex) {
      console.log('failed to submit:: ' + JSON.stringify(ex));
    }

  }

  addFirstPassenger() {
    try {
      var query = { REL_POS: this.psgnData[0].REL_POS, PNR_NO: this.psgnData[0].PNR_NO };
     // var options = { exact: true };
      this.storage.findPassenger(query).then((res)=>{
   //   WL.JSONStore.get('passenger').find(query, options).then((res) => {
        res[0].json.NEW_COACH_ID = res[0].json.COACH_ID
        res[0].json.NEW_BERTH_NO = res[0].json.BERTH_NO
        res[0].json.COACH_ID = this.vacBerth.json.COACH_ID;
        res[0].json.BERTH_NO = this.vacBerth.json.BERTH_NO;
        res[0].json.BERTH_INDEX = this.vacBerth.json.BERTH_INDEX;
        res[0].json.CLASS = this.vacBerth.json.CLASS;
        res[0].json.REMARKS = 'RAC_CNF';
        this.storage.replacePassenger(res).then((success)=> {
      //  WL.JSONStore.get('passenger').replace(res).then((success) => {
          console.log("first passenger updated successfully" + JSON.stringify(success));
          this.updateSecondPsgn();
        }, (fail) => {
          console.log("failed to update first passenger " + JSON.stringify(fail));

        })
      }, (fail) => {
        console.log("failed to find first passenger" + JSON.stringify(fail));

      });
    } catch (ex) {
      alert(ex);
    }

  }

  updateSecondPsgn() {
    try {
      var query = { COACH_ID: this.psgnData[0].COACH_ID, BERTH_NO: this.psgnData[0].BERTH_NO, REMARKS: this.psgnData[0].REMARKS };
      var options = { exact: true };
      console.log(JSON.stringify(query));
            this.storage.findPassenger(query).then((res)=>{

     // WL.JSONStore.get('passenger').find(query, options).then((res) => {
        res[0].json.REMARKS = 'RAC_CNF';
        this.storage.replacePassenger(res).then((success)=> {
     //   WL.JSONStore.get('passenger').replace(res).then((success) => {
          console.log("second passenger updated successfully " + JSON.stringify(success));
          this.closeModal();
        }, (fail) => {
          console.log("failed to update second passenger" + JSON.stringify(fail));
        })
      }, (fail) => {
        console.log("failed to find second passenger" + JSON.stringify(fail));

      });
    } catch (ex) {
      alert(ex);
    }
  }


  closeModal() {
    //this.navCtrl.setRoot(RacTabPage);
    this.viewCtrl.dismiss();
   console.log(this.appCtrl.getRootNav()); 
   // this.nav.push(RacTabPage, {});
  }


}
