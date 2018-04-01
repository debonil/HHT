import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { UtilProvider } from '../../providers/util/util';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the EftFormPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-eft-form',
  templateUrl: 'eft-form.html',
})
export class EftFormPage {
  EFT = {
    EFT_NO: '',
    COACH_ID: '',
    FROM: '',
    TO: '',
    REASON: '',
    FARE: '',
    EXCESS_FARE: '',
    GST: '',
    TOTAL: 0,
    PSGNLIST: [],
    TRAIN_ID: '',
    CH_NUMBER: 1,
    USER_ID: ''
  };

  FARE = {
    ADULT_FARE: "NA",
    CHILD_FARE: "NA",
    DISTANCE: "NA"
  };
  trainAssignmentObject: any;

  berthArr: any;
  msg: any;
  coach_id: any;
  berth_id: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private util: UtilProvider,
    private storageService: StorageServiceProvider, private pdsp: PsngDataServiceProvider, public alertCtrl: AlertController) {
    this.EFT.PSGNLIST.push({
      NAME: '',
      SEX: '',
      AGE: '',
      BSD: ''
    });
    //'M'
    if(pdsp.trainAssignmentObject.TRAIN_ID){
      this.trainAssignmentObject = pdsp.trainAssignmentObject;
      this.EFT.TRAIN_ID = this.trainAssignmentObject.TRAIN_ID;
      this.EFT.CH_NUMBER = this.trainAssignmentObject.CH_NUMBER;
      this.EFT.USER_ID = this.trainAssignmentObject.USER_ID;
    }else{
      this.storageService.getDocuments(this.storageService.collectionName.TRAIN_ASSNGMNT_TABLE).then(res=>{
        this.trainAssignmentObject = res[0].json;
        this.EFT.TRAIN_ID = this.trainAssignmentObject.TRAIN_ID;
        this.EFT.CH_NUMBER = this.trainAssignmentObject.CH_NUMBER;
        this.EFT.USER_ID = this.trainAssignmentObject.USER_ID;
      });
    }
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad EftFormPage');
    this.pdsp.findAll().subscribe(data => {
      this.trainAssignmentObject = data.trainAssignmentObj;
      this.EFT.CH_NUMBER = data.trainAssignmentObj.CH_NUMBER;
      this.EFT.USER_ID = data.trainAssignmentObj.USER_ID;
    });
  }

  showFare() {
    if (this.EFT.FROM.length > 0 && this.EFT.TO.length > 0 && this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) < this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.TO)) {
      this.storageService.getDocuments(this.storageService.collectionName.DYNAMIC_FARE_TABLE,
        { FROM_STN: this.EFT.FROM, TO_STN: this.EFT.TO }, { exact: true }).then((res: any) => {

          /* this.FARE.ADULT_FARE = res.length==0?'NA' : res[0].json.ADULT_FARE;
          this.FARE.CHILD_FARE = res.length==0?'NA' :res[0].json.CHILD_FARE; */

          if (res.length > 0) {
            this.FARE.DISTANCE = res[0].json.DISTANCE + " Km";
            this.FARE.ADULT_FARE = "";
            this.FARE.CHILD_FARE = "";
            res.forEach((element, i) => {
              this.FARE.ADULT_FARE += res[i].json.ADULT_FARE + "(" + res[i].json.CLASS + ") ";
              this.FARE.CHILD_FARE += res[i].json.ADULT_FARE + "(" + res[i].json.CLASS + ") ";
            });
          }
          console.log(res);

        });
    }
  }

  keypressevt(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      return false;
    }
  }

  updateBerth() {
    if (this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.COACH_ID.trim().length > 0 && this.EFT.TO) > this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) && this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) > -1) {

      let srcArr = this.trainAssignmentObject.ISL_ARR.slice(0, this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) + 1);
      let destArr = this.trainAssignmentObject.ISL_ARR.slice(this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.TO));

      var query = {
        $inside: [{ 'SRC': srcArr }, { 'DEST': destArr }],
        $equal: [{ 'ALLOTED': 'N' }, { 'COACH_ID': this.EFT.COACH_ID }]
      };
      var option = { exact: true };
      this.storageService.getDocumentsAdvanced(this.storageService.collectionName.VACANT_BERTH_TABLE, query, option).then(res => {
        //alert(JSON.stringify(query) + 'berth Arr' + res);
        this.berthArr = res;
      });
    } else {
      this.berthArr = [];
    }
  }

  updateTotal() {
    this.EFT.TOTAL = Number.parseInt(this.EFT.FARE) + Number.parseInt(this.EFT.EXCESS_FARE) + Number.parseInt(this.EFT.GST);
  }

  addRow(index) {
    // index for berth
    this.setBerthId("Standing", index);
    if (this.EFT.PSGNLIST.length < 6) {
      var obj = {
        NAME: '',
        SEX: '',//'M'
        AGE: '',
        BSD: ''
      };
      this.EFT.PSGNLIST.push(obj);
    }
  }

  deleteRow() {
    if (this.EFT.PSGNLIST.length > 1) {
      this.EFT.PSGNLIST.pop();
    }
  }


  eftCoachAlertList() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Coach List');
    console.log(JSON.stringify(this.trainAssignmentObject.ASSIGNED_COACHES));
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
        for(let i=0;i<this.EFT.PSGNLIST.length;i++){
          this.EFT.PSGNLIST[i].BSD = '';
        }

        this.EFT.COACH_ID = '';
        this.EFT.COACH_ID = data;
        this.setCoachId(data);
        //BRD = data;
        this.updateBerth();
      }
    });
    alert.present();
  }

  genderAlertList(index) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Gender List');
    /*  alert.addInput({
       type: 'radio',
       label: 'Select ',
       value: 'select',
       checked: true
     }); */
    alert.addInput({ type: 'radio', label: 'Select Gender', value: 'Select Gender', checked: true });
    alert.addInput({ type: 'radio', label: 'M', value: 'M' });
    alert.addInput({ type: 'radio', label: 'F', value: 'F' });
    alert.addInput({ type: 'radio', label: 'O', value: 'O' });
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.EFT.PSGNLIST[index].SEX = [];
        console.log(data);
        this.EFT.PSGNLIST[index].SEX = data

      }

    });
    alert.present();

  }
  stationFromAlertList(identity) {

    let alert = this.alertCtrl.create();
    alert.setTitle('Station List');
    /* alert.addInput({
      type: 'radio',
      label: 'Select station',
      value: identity == 'F' ? 'FROM' : 'TO',
      checked: true
    }); */
    console.log(this.trainAssignmentObject.ISL_ARR.length);
    //this.trainAssignmentObject.ISL_ARR
    for (var i = 0; i < this.trainAssignmentObject.ISL_ARR.length; i++) {

      alert.addInput({
        type: 'radio',
        label: this.trainAssignmentObject.ISL_ARR[i],
        value: this.trainAssignmentObject.ISL_ARR[i],
        checked: false
      });

    }
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log(data);
        if (identity == 'F') {
          if (data != 'FROM') {
            this.EFT.FROM = data
          } else {
            this.EFT.FROM = '';
          }

        }
        if (identity == 'T') {
          if (data != 'TO') {
            this.EFT.TO = data
          } else {
            this.EFT.TO = '';
          }

        }

      }
    });
    alert.present();
  }

  waitBerthList(waitListData, index) {
    console.log(JSON.stringify(waitListData));
    let alert = this.alertCtrl.create();
    alert.setTitle('Vacant Berth List');
    alert.addInput({
      type: 'radio',
      label: 'Standing',
      value: 'S',
      checked: true
    });
    try {
      if (this.berthArr.length != 0) {
        for (var i = 0; i < this.berthArr.length; i++) {
          alert.addInput({
            type: 'radio',
            label: this.berthArr[i].json.COACH_ID + " "
              + this.berthArr[i].json.BERTH_NO + " "
              + this.berthArr[i].json.SRC + " "
              + this.berthArr[i].json.DEST,
            value: this.berthArr[i],
            checked: false
          });
        }
        alert.addButton({
          text: 'Okay',
          handler: data => {


            console.log(JSON.stringify(data));

            if (data != 'S') {
              var tempStr = data.json.COACH_ID + " "
                + data.json.BERTH_NO + " "
                + data.json.SRC + " "
                + data.json.DEST;
              this.setBerthId(tempStr, index);

              this.EFT.PSGNLIST[index].BSD = data;
            } else {
              var standStr = "Standing";
              this.EFT.PSGNLIST[index].BSD = 'S';
              this.setBerthId(standStr, index);
            }

          }
        });
        alert.present();
      } else {
        //console.log("else");

        let alert = this.alertCtrl.create();
        alert.setTitle('Vacant Berth List');
        alert.addInput({
          type: 'radio',
          label: 'Standing',
          value: 'S',
          checked: true
        });
        alert.addButton({
          text: 'Okay',
          handler: data => {
            //this.setBerthId('Standing',index);
            //this.EFT.PSGNLIST[index].BSD = 'S';
            this.berthArr = [];
            var standStr = "Standing";
            this.EFT.PSGNLIST[index].BSD = 'S';
            this.setBerthId(standStr, index);
          }
        });
        alert.present();
      }
    } catch (ex) {

      console.log("hi");

    }
    //alert.addButton('Cancel');


  }
  getCoachId() {
    return this.coach_id;
  }
  setCoachId(coach_id) {
    this.coach_id = coach_id;
  }
  getBerthId() {
    return this.berth_id;
  }
  setBerthId(berth_id, index) {
    this.berth_id[index] = berth_id;
    // this.berth_id = berth_id;
  }

  issueEFT() {
    this.msg = '';
    if (this.EFT.EFT_NO.trim().length == 0) {
      this.msg = "Provide the EFT number";
      alert('WARNING : ' + this.msg);
    } else {
      this.searchEFT().then((res: any) => {
        if (res == '') {
          this.makeEFT();
        } else {
          alert('WARNING : ' + this.msg);
          this.msg = 'do not issue eft';
        }
      });
    }
  }

  searchEFT() {
    return new Promise(resolve => {
      var query = { EFT_NO: this.EFT.EFT_NO };
      var option = { exact: true };
      this.storageService.getDocuments(this.storageService.collectionName.EFT_MASTER_TABLE,
        query, option).then((res: any) => {
          if (res.length > 0) {
            this.msg = "EFT against this number has already been issued";
            resolve(this.msg);
          } else {
            resolve('');
          }
        });
    });
  }

  makeEFT() {
    this.msg = '';
    this.checkStationPairs();
    this.checkFare();

    if (this.EFT.EFT_NO.trim().length == 0) {
      this.msg = "Provide the EFT number";
    }
    if (this.EFT.COACH_ID.trim().length == 0) {
      this.msg = "Select coach";
    }
    if (this.EFT.REASON.trim().length == 0) {
      this.msg = "Give reason";
    }
    if (this.msg.length != 0) {
      alert('Warning : ' + this.msg);
    } else {
      //alert('NO Warning : ' + this.msg);
      this.checkPassengerList();
      if (this.msg.length != 0) {
        alert('Warning : ' + this.msg);
      } else {
        this.addPassengerToBackend(0);
        this.addBerthToBackend(0);
        this.addEftToBackend();
      }
    }

  }

  checkStationPairs() {
    if (this.EFT.FROM.trim().length == 0) {
      this.msg = "Select source station";
    } else if (this.EFT.FROM.trim().length == 0) {
      this.msg = "Select destination station";
    } else if (this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) > this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.TO)) {
      this.msg = "Source station shall not be greater than destination station";
    }
  }

  checkFare() {
    if (this.EFT.FARE.trim().length == 0) {
      this.msg = 'Give fare';
    } else if (this.EFT.EXCESS_FARE.trim().length == 0) {
      this.msg = 'Give excess fare';
    } else if (this.EFT.GST.trim().length == 0) {
      this.msg = 'Give GST';
    }
  }

  checkPassengerList() {
    for (let i = 0; i < this.EFT.PSGNLIST.length; i++) {
      if (this.EFT.PSGNLIST[i].NAME.length == 0) {
        this.msg = "Passenger name can't be left blank";
        return false;
      } else if (this.EFT.PSGNLIST[i].AGE.length == 0) {
        this.msg = "Passenger age can't be left blank";
        return false;
      } else if (this.EFT.PSGNLIST[i].BSD.length == 0) {
        this.msg = "Passenger berth can't be left blank";
        return false;
      }

      for (let j = 0; j < i; j++) {

        if (this.EFT.PSGNLIST[i].BSD == this.EFT.PSGNLIST[j].BSD && this.EFT.PSGNLIST[i].BSD != 'S') {
          this.msg = "same seat can't be alocated to multiple passengers";
          return false;
        }
      }
    }
  }

  addPassengerToBackend(index) {
    if (index < this.EFT.PSGNLIST.length) {
      let row = this.EFT.PSGNLIST[index];
      let currentTime = this.util.getCurrentDateString();
      let classVal = this.util.getClassObject(this.EFT.COACH_ID,this.trainAssignmentObject.CLASS);
      //alert('classVal : ' + JSON.stringify(classVal));
      let obj = {
        BERTH_INDEX: row.BSD == 'S' ? 0 : row.BSD.json.BERTH_INDEX,
        WAITLIST_NO: 0,
        RES_UPTO: this.EFT.TO,
        SYSTIME: currentTime,
        JRNY_TO: this.EFT.TO,
        NEW_COACH_ID: '-',
        FOOD_FLAG: '-',
        REMARKS: 'EFT',
        /* CLASS: row.BSD == 'S' ? '-' : row.BSD.json.CLASS, */
        CLASS : classVal.CLASS,
        TICKET_NO: this.EFT.EFT_NO,
        PRIMARY_QUOTA: row.BSD == 'S' ? '-' : row.BSD.json.PRIMARY_QUOTA,
        PSGN_NO: index,
        REMOTE_LOC_NO: row.BSD == 'S' ? 1 : row.BSD.json.REMOTE_LOC_NO,
        NEW_BERTH_NO: '-',
        BERTH_NO: row.BSD == 'S' ? '0' : row.BSD.json.BERTH_NO,
        MSG_STN: '-',
        JRNY_FROM: this.EFT.FROM,
        CAB_CP: row.BSD == 'S' ? '-' : row.BSD.json.CAB_CP,
        NEW_CLASS: '-',
        BOARDING_PT: this.EFT.FROM,
        VIP_MARKER: '-',
        NEW_PRIMARY_QUOTA: '-',
        PENDING_AMT: 0,
        TRAIN_ID: this.EFT.TRAIN_ID,
        BERTH_SRC: row.BSD == 'S' ? '-' : row.BSD.json.SRC,
        TICKET_TYPE: 'X',
        ATTENDANCE_MARKER: 'P',
        CANCEL_PASS_FLAG: '-',
        CAB_CP_ID: row.BSD == 'S' ? '-' : row.BSD.json.CAB_CP_ID,
        SUB_QUOTA: row.BSD == 'S' ? '-' : row.BSD.json.SUB_QUOTA,
        AGE_SEX: row.AGE + row.SEX,
        REL_POS: index,
        PSGN_NAME: row.NAME,
        COACH_ID: this.EFT.COACH_ID,
        DUP_TKT_MARKER: '-',
        PNR_NO: this.EFT.EFT_NO,
        CH_NUMBER: this.EFT.CH_NUMBER,
        BERTH_DEST: row.BSD == 'S' ? '-' : row.BSD.json.DEST,
        UPDATE_TIME: currentTime,
        SYNC_TIME: ''
      };

      this.storageService.add(this.storageService.collectionName.PASSENGER_TABLE, obj).then(res => {
        if (res) {
          /* this.pdsp.addPsngBerth(obj); */
          if(row.BSD!='S'){this.pdsp.addPsngBerth(obj);}
          this.addPassengerToBackend(index + 1);
        }
      });
    }
  }

  addBerthToBackend(index) {
    if (index < this.EFT.PSGNLIST.length) {
      let row = this.EFT.PSGNLIST[index];
      let obj = row.BSD;
      let currentTime = this.util.getCurrentDateString();

      if (obj != 'S') {
        obj.json.ALLOTED = 'Y';
        obj.json.REASON = 'X';
        this.storageService.replace(this.storageService.collectionName.VACANT_BERTH_TABLE, obj).then(res => {
          if (this.EFT.TO.trim() != obj.json.DEST.trim()) {
            var berthObj = {
              BERTH_INDEX: obj.json.BERTH_INDEX,
              CAB_CP: obj.json.CAB_CP,
              TRAIN_ID: obj.json.TRAIN_ID,
              SRC: this.EFT.TO,
              CLASS: obj.json.CLASS,
              PRIMARY_QUOTA: obj.json.PRIMARY_QUOTA,
              CAB_CP_ID: obj.json.CAB_CP_ID,
              SUB_QUOTA: obj.json.SUB_QUOTA,
              REMOTE_LOC_NO: obj.json.REMOTE_LOC_NO,
              BERTH_NO: obj.json.BERTH_NO,
              COACH_ID: obj.json.COACH_ID,
              CH_NUMBER: obj.json.CH_NUMBER,
              ALLOTED: 'N',
              REASON: 'V',
              DEST: obj.json.DEST,
              SYSTIME: currentTime,
              UPDATE_TIME: currentTime,
              SYNC_TIME: ''
            }
            this.storageService.add(this.storageService.collectionName.VACANT_BERTH_TABLE, berthObj).then(res => {
              this.addBerthToBackend(index + 1);
            });
          } else {
            this.addBerthToBackend(index + 1);
          }
        });
      } else {
        this.addBerthToBackend(index + 1);
      }
    }
  }

  addEftToBackend() {
    let classVal = this.util.getClassObject(this.EFT.COACH_ID,this.trainAssignmentObject.CLASS);
    //alert('classVal : ' + JSON.stringify(classVal));
    let currentTime = this.util.getCurrentDateString();
    var obj = {
      TRAIN_ID: this.EFT.TRAIN_ID,
      REMOTE_LOC_NO: 1,
      USER_ID: this.EFT.USER_ID,
      EFT_NO: this.EFT.EFT_NO,
      SRC: this.EFT.FROM,
      DEST: this.EFT.TO,
      FARE: Number(this.EFT.FARE),
      FINE: Number(this.EFT.EXCESS_FARE),
      GST: Number(this.EFT.GST),
      NUM_OF_PSGN: this.EFT.PSGNLIST.length,
      CLASS: classVal.CLASS,
      TICKET_NO: this.EFT.EFT_NO,
      EFT_DATE: currentTime,
      SYSTIME: currentTime,
      UPDATE_TIME: currentTime,
      SYNC_TIME: '',
      REASON : this.EFT.REASON
    };
    this.storageService.add(this.storageService.collectionName.EFT_MASTER_TABLE, obj).then(res => {
      //alert('POP THE NAVIGATION');
      this.navCtrl.pop();
    });
  }

}
/* let d = Number.parseInt(this.EFT.EFT_NO);   
    if(Number.isNaN(d)){
      this.msg = 'key in eft number';
    }else{

    } */