import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, ViewController } from 'ionic-angular';
import { RacTabPage } from "../rac-tab/rac-tab";
import { RacPage } from "../rac/rac";
//import { StorageProvider } from '../../providers/storage/storage';
import { StorageServiceProvider } from "../../providers/storage-service/storage-service";

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
dataArr:any[]=[];
  vacArr: any = [];
  islArray: any = [];
  psgnArr;
  newVacBerth: any[] = [];
  psgnVal: any[] = [];
  psgnData: any[] = [];
  vacBerth;
  data;
  resArr;
  stn1: any = [];
  stn2: any = [];
  racArr: any[] = [];
  PSGN_UPDT = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public appCtrl: App, private storage: StorageServiceProvider) {
    this.psgnArr = this.navParams.data;
    this.psgnData.push(this.psgnArr);

    this.populateISL();
  }

  populateISL() {
    try {
       this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((res:any)=>{
       console.log(JSON.stringify(res));
     // this.storage.getTrainAssignmentDocument().then((res: any) => {
        this.resArr = res[0].json.ISL;
       // alert("loading stations: " + JSON.stringify(this.resArr));
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
    this.storage.getDocuments(this.storage.collectionName.VACANT_BERTH_TABLE,query,options).then((res:any[])=>{

    //  this.storage.getVacantBerth(query, options).then((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.vacArr = res;
        }
      });
    } catch (ex) {
      alert(ex);
    }
  }
  submit() {
    //console.log(JSON.stringify(this.data));
    this.populateVacantBerth();
  }

  submit1() {
    try {
      this.stn2.push({
        STN_CODE: this.vacBerth.json.DEST
      });
      if (this.data == 'item.value[0]') {
        this.stn1.push({
          STN_CODE: this.psgnData[0].value[0].RES_UPTO
        });
        this.updateVacantBerth(this.psgnData[0].value[0],this.psgnData[0].value[1]);
      } else if (this.data == 'item.value[1]') {
        this.stn1.push({
          STN_CODE: this.psgnData[0].value[1].RES_UPTO
        });
         this.updateVacantBerth(this.psgnData[0].value[1],this.psgnData[0].value[0]);

      }
      
    }
    catch (ex) {

    }
  }
  updateVacantBerth(psg,psg1) {
    try {
     // alert("index of vacant berth : " + JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST))
     // alert("index of passenger: " + JSON.stringify(this.islArray).indexOf(psg.RES_UPTO));
      if ((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST)) >= (JSON.stringify(this.islArray).indexOf(psg.RES_UPTO))) {
      //  console.log("greater ");
        if ((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST)) > (JSON.stringify(this.islArray).indexOf(psg.RES_UPTO))) {

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
            SRC: psg.RES_UPTO,
            TRAIN_ID: this.vacBerth.json.TRAIN_ID,
            PRIMARY_QUOTA: this.vacBerth.json.PRIMARY_QUOTA,
            CH_NUMBER: this.vacBerth.json.CH_NUMBER,
            BERTH_NO: this.vacBerth.json.BERTH_NO,
            CAB_CP: this.vacBerth.json.CAB_CP
          });
        }
        else {
          this.vacBerth.json.ALLOTED = 'Y';
           this.storage.replace(this.storage.collectionName.VACANT_BERTH_TABLE,this.vacBerth).then((success) => {

        //  this.storage.replaceVacantBerth(this.vacBerth).then(() => {
            this.addFirstPassenger(psg,psg1);
          }, (f) => {
            alert("fail to replace vacant berth " + f);
          });
        }
      } else {
        alert("passenger Destination Cannot be after vacant berth destination");
      //  alert(this.newVacBerth.length);
        this.closeModal(psg,psg1);
      }
      if (this.newVacBerth.length > 0) {
        this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,this.newVacBerth[0]).then((res) => {

      //  this.storage.appendVacantBerth(this.newVacBerth[0]).then((res) => {
          this.vacBerth.json.ALLOTED = 'Y';
         this.storage.replace(this.storage.collectionName.VACANT_BERTH_TABLE,this.vacBerth).then((success) => {

        //  this.storage.replaceVacantBerth(this.vacBerth).then(() => {
            this.addFirstPassenger(psg,psg1);
          }, (f) => {
            alert("fail to replace vacant berth " + f);
          });
        }, (f) => {
          alert("failed to add new vacant berth");
        });
      }

    } catch (ex) {
      console.log('failed to submit:: ' + JSON.stringify(ex));
    }

  }

  addFirstPassenger(psg,psg1) {
    try {
      var query = { REL_POS: psg.REL_POS, PNR_NO: psg.PNR_NO };
      var option ={exact:true};
   this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query,option).then((res:any)=>{

     // this.storage.findPassenger(query).then((res) => {
        res[0].json.NEW_COACH_ID = res[0].json.COACH_ID
        res[0].json.NEW_BERTH_NO = res[0].json.BERTH_NO
        res[0].json.COACH_ID = this.vacBerth.json.COACH_ID;
        res[0].json.BERTH_NO = this.vacBerth.json.BERTH_NO;
        res[0].json.BERTH_INDEX = this.vacBerth.json.BERTH_INDEX;
        res[0].json.CLASS = this.vacBerth.json.CLASS;
        res[0].json.REMARKS = 'CNF';
        res[0].json.NEW_PRIMARY_QUOTA='CNF';
       this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,res).then((success) => {

       // this.storage.replacePassenger(res).then((success) => {
          console.log("first passenger updated successfully" + JSON.stringify(success));
          this.updateSecondPsgn(res,psg1);
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

  updateSecondPsgn(res,psg1) {
    try {
      var query = { COACH_ID: psg1.COACH_ID, BERTH_NO: psg1.BERTH_NO, REMARKS: psg1.REMARKS };
      var options = { exact: true };
         this.storage.getDocuments(this.storage.collectionName.PASSENGER_TABLE,query,options).then((opt:any)=>{

     // this.storage.findPassenger(query).then((opt) => {
        opt[0].json.REMARKS = 'CNF';
        opt[0].json.NEW_PRIMARY_QUOTA='CNF';
               this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,opt).then((success) => {

     //   this.storage.replacePassenger(opt).then((success) => {
          console.log("second passenger updated successfully " + JSON.stringify(success));
          this.closeModal(res,opt);
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


  closeModal(psg,psg1) {
    //this.navCtrl.setRoot(RacTabPage);
    this.dataArr.push(psg);
        this.dataArr.push(psg1);

    this.viewCtrl.dismiss(this.dataArr);
    //console.log(this.appCtrl.getRootNav());
    // this.nav.push(RacTabPage, {});
  }


}
