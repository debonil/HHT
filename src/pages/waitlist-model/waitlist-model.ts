import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//import { StorageProvider } from '../../providers/storage/storage';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { WaitlistPage } from '../waitlist/waitlist';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the WaitlistModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waitlist-model',
  templateUrl: 'waitlist-model.html',
})
export class WaitlistModelPage {
  wlPsgn: any;
  berth: any;
  wlSrc: any;
  wlDest: any;
  berthSrc: any;
  berthDest: any;
  /* bsd: any; */
  bsd: any = []; 
  isl: any = [];
  srcArr: any = [];
  destArr: any = [];
  coaches: any = [];

  trainAssignmentObject: any;
  selectedData: any = "Select Berth";
  /* dataSetArray: any[] = []; */
  dataSetArray: any = {};
  selectedCoach: any = "Select Coaches";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController,
    private storageService: StorageServiceProvider, private pdsp: PsngDataServiceProvider, public alertCtrl: AlertController) {
    console.log(navParams.data);
    this.trainAssignmentObject = this.pdsp.trainAssignmentObject;
    this.isl = this.trainAssignmentObject.ISL_ARR;
    this.coaches = this.trainAssignmentObject.ASSIGNED_COACHES;

    this.wlPsgn = { _id: navParams.data._id, json: navParams.data.json };
    this.srcArr = this.isl.slice(0, this.isl.indexOf(navParams.data.json.JRNY_FROM) + 1);
    this.destArr = this.isl.slice(this.isl.indexOf(navParams.data.json.JRNY_TO));

    /* var query = {
      $inside: [{ 'SRC': this.srcArr }, { 'DEST': this.destArr }],
      $equal: [{ 'ALLOTED': 'N' }]
    };
    var option = { exact: true };
    this.storageService.getDocumentsAdvanced(this.storageService.collectionName.VACANT_BERTH_TABLE, query, option).then(res => {
      this.berth = res;
    }); */

    this.wlSrc = {
      STN_CODE: navParams.data.json.JRNY_FROM,
      STN_SRL_NO: this.isl.indexOf(navParams.data.json.JRNY_FROM) + 1
    };
    this.wlDest = {
      STN_CODE: navParams.data.json.JRNY_TO,
      STN_SRL_NO: this.isl.indexOf(navParams.data.json.JRNY_TO) + 1
    };
  }

  getCoaches(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Coach List');
    for (var i = 0; i < this.trainAssignmentObject.ASSIGNED_COACHES.length; i++) {
      alert.addInput({
        type: 'radio',
        label: this.trainAssignmentObject.ASSIGNED_COACHES[i],
        value: this.trainAssignmentObject.ASSIGNED_COACHES[i],
        checked: false
      });
    }
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data Boarding Psgn At: ', data);
        this.selectedCoach = data;
        this.getVacantBerth();
      }
    });
    alert.present();
  }

  getVacantBerth(){
    if(this.selectedCoach!='Select Coaches'){
      var query = {
        $inside: [{ 'SRC': this.srcArr }, { 'DEST': this.destArr }],
        $equal: [{ 'ALLOTED': 'N' },{'COACH_ID' : this.selectedCoach}]
      };
      var option = { exact: true };
      this.storageService.getDocumentsAdvanced(this.storageService.collectionName.VACANT_BERTH_TABLE, query, option).then(res => {
        this.berth = res;
      });
    }else{
      this.berth = [];
    }
  }

  waitVacantBerthList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Vacant Berth List');
    alert.addInput({
      type: 'radio',
      label: 'Standing',
      value: 'S',
      checked: true
    });

    for (var i = 0; i < this.berth.length; i++) {
      alert.addInput({
        type: 'radio',
        label: this.berth[i].json.COACH_ID + "-"
          + this.berth[i].json.BERTH_NO + "-"
          + this.berth[i].json.SRC + "-"
          + this.berth[i].json.DEST,
        value: this.berth[i],
        checked: false
      });
    }

    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data Boarding Psgn At: ', data);
        this.dataSetArray = [];
        if(data!='S'){
          console.log('Vacant Berth : ');
          console.log(data);
          let tmpString = data.json.COACH_ID + " "
            + data.json.BERTH_NO + " "
            + data.json.SRC + " "
            + data.json.DEST;
          this.setSeletedData(tmpString);
          this.dataSetArray = data;
        }else{
          let tmpString = 'Standing';
          this.setSeletedData(tmpString);
          this.dataSetArray.push('S');
        }
      }
    });
    alert.present();
  }
  getSelected() {
    return this.selectedData;
  }
  setSeletedData(data) {
    this.selectedData = data;
  }
 
  /* onSubmit() {
    this.bsd = this.dataSetArray;

    if (this.bsd != undefined) {
      this.berthSrc = {
        STN_CODE: this.bsd.json.SRC,
        STN_SRL_NO: this.isl.indexOf(this.bsd.json.SRC) + 1
      };

      this.berthDest = {
        STN_CODE: this.bsd.json.DEST,
        STN_SRL_NO: this.isl.indexOf(this.bsd.json.DEST) + 1
      };

      if (this.berthDest.STN_SRL_NO < this.wlDest.STN_SRL_NO || this.berthSrc.STN_SRL_NO >= this.wlDest.STN_SRL_NO) {
        alert(JSON.stringify(this.berthDest) + ':' + JSON.stringify(this.wlDest) + '**' + JSON.stringify(this.berthSrc) + ' : ' + JSON.stringify(this.wlDest) + 'such an allotment is not aollwed' + this.berthDest.STN_SRL_NO + ':' + this.wlDest.STN_SRL_NO + '**' + this.berthSrc.STN_SRL_NO + ' : ' + this.wlDest.STN_SRL_NO);

      } else {
        this.assignWaitlist();
      }
    } else {
      alert('such an allotment is not allowed null');
    }
  } */
  onSubmit() {
    if(!this.dataSetArray.json && this.dataSetArray!='S'){
      alert('Warning! select berth');
    }else{
      if(this.dataSetArray=='S'){
        this.assignWaitlist();
      }else{
          //alert(JSON.stringify(this.dataSetArray));
          if((this.isl.indexOf(this.dataSetArray.json.DEST) + 1)<(this.isl.indexOf(this.wlDest.STN_CODE)+1)){
            alert('Warning! such an allotment is not allowed');
          }else{
            this.assignWaitlist();
          }
        }
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'passenger berth alloted successfully!!',
      duration: 3000,
      position: 'bottom'
    });
  }

  close() {
    this.navCtrl.pop();
  }

  assignWaitlist() {
    //alert('berth ' + JSON.stringify(this.dataSetArray));
    var addBerth = {};
    this.wlPsgn.json.BERTH_INDEX = this.dataSetArray=='S'? 0 : this.dataSetArray.json.BERTH_INDEX;
    this.wlPsgn.json.BERTH_NO = this.dataSetArray=='S'? '0' :this.dataSetArray.json.BERTH_NO;
    this.wlPsgn.json.COACH_ID = this.selectedCoach;
    this.wlPsgn.json.ATTENDANCE_MARKER = 'P';
    this.wlPsgn.json.BOARDING_PT = this.wlPsgn.json.JRNY_FROM;
    this.wlPsgn.json.REMARKS = this.dataSetArray=='S'? "WLSTND" :"WLCNF";

    if(this.dataSetArray!='S'){
      if(this.isl.indexOf(this.dataSetArray.json.DEST)>this.isl.indexOf(this.wlDest.STN_CODE)){
        addBerth = {
          BERTH_INDEX : this.dataSetArray.json.BERTH_INDEX,
          CAB_CP : this.dataSetArray.json.CAB_CP,
          TRAIN_ID: this.dataSetArray.json.TRAIN_ID,
          SRC: this.wlDest.STN_CODE,
          SYSTIME: this.dataSetArray.json.SYSTIME,
          CLASS: this.dataSetArray.json.CLASS,
          PRIMARY_QUOTA: this.dataSetArray.json.PRIMARY_QUOTA,
          CAB_CP_ID: this.dataSetArray.json.CAB_CP_ID,
          SUB_QUOTA: this.dataSetArray.json.SUB_QUOTA,
          REMOTE_LOC_NO: this.dataSetArray.json.REMOTE_LOC_NO,
          BERTH_NO: this.dataSetArray.json.BERTH_NO,
          COACH_ID: this.dataSetArray.json.COACH_ID,
          CH_NUMBER: this.dataSetArray.json.CH_NUMBER,
          ALLOTED: 'N',
          REASON: 'V',
          DEST: this.dataSetArray.json.DEST,
          UPDATE_TIME: this.dataSetArray.json.UPDATE_TIME,
          SYNC_TIME: ''
        };
      }
      this.dataSetArray.json.ALLOTED = 'Y';
      this.dataSetArray.json.REASON = 'W';
      this.addVacantBerth(addBerth).then(res=>{
        if(res){
          this.updateVacantBerth(this.dataSetArray);
        }
      });
    }

    this.storageService.replace(this.storageService.collectionName.PASSENGER_TABLE, [this.wlPsgn]).then(res=>{
      if(res){
        this.pdsp.addPsngBerth(this.wlPsgn);
        this.navCtrl.pop();
      }else{
        alert('Warning! fails to update passenger');
      }
    });
  }

  addVacantBerth(berth){
    return new Promise(resolve=>{
      //alert(berth.BERTH_INDEX + 'addVacantBerth' + JSON.stringify(berth));
      if(berth.BERTH_INDEX){
        this.storageService.add(this.storageService.collectionName.VACANT_BERTH_TABLE, berth).then(res=>{
          resolve(res);
        });
      }else{
        resolve(true);
      }
    });
  }

  updateVacantBerth(berth){
    //alert('berth to be updated : ' + JSON.stringify(berth));
    return new Promise(resolve=>{
      if(berth.json){
        this.storageService.replace(this.storageService.collectionName.VACANT_BERTH_TABLE, berth).then(res=>{
          resolve(res);
        });
      }else{
        resolve(true);
      }
    });
  }
}
