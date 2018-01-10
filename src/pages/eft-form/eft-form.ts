import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StorageServiceProvider} from '../../providers/storage-service/storage-service';
import {UtilProvider} from '../../providers/util/util';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';

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
    EFT_NO : '',
    COACH_ID : '',
    FROM : '',
    TO : '',
    REASON : '',
    FARE : '',
    EXCESS_FARE : '',
    TOTAL : 0,
    PSGNLIST : [],
    TRAIN_ID : '',
    CH_NUMBER : 1,
    USER_ID : ''
  };
  trainAssignmentObject : any;

  berthArr : any;
  msg : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private util:UtilProvider,
    private storageService: StorageServiceProvider, private pdsp: PsngDataServiceProvider) {
      this.EFT.PSGNLIST.push({
        NAME : '',
        SEX : 'M',
        AGE : '',
        BSD : ''
      });

      this.trainAssignmentObject = pdsp.trainAssignmentObject;
      this.EFT.TRAIN_ID = this.trainAssignmentObject.TRAIN_ID;
      this.EFT.CH_NUMBER = this.trainAssignmentObject.CH_NUMBER;
      this.EFT.USER_ID = this.trainAssignmentObject.USER_ID;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EftFormPage');
  }

  updateBerth(){
    if(this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.COACH_ID.trim().length>0 && this.EFT.TO)>this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM) && this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM)>-1){
      let srcArr = this.trainAssignmentObject.ISL_ARR.slice(0,this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM)+1);
      let destArr = this.trainAssignmentObject.ISL_ARR.slice(this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.TO));

      var query = {
        $inside : [{'SRC':srcArr},{'DEST':destArr}],
        $equal : [{'ALLOTED':'N'},{'COACH_ID':this.EFT.COACH_ID}]
      };
      var option = {exact : true};
      this.storageService.getDocumentsAdvanced(this.storageService.collectionName.VACANT_BERTH_TABLE,query, option).then(res=>{
        this.berthArr = res;
      });
    }else{
      this.berthArr = [];
    }
  }

  updateTotal(){
    this.EFT.TOTAL = Number.parseInt(this.EFT.FARE) + Number.parseInt(this.EFT.EXCESS_FARE);
  }

  addRow(){
    if(this.EFT.PSGNLIST.length<6){
      var obj = { 
        NAME : '',
        SEX : 'M',
        AGE : '',
        BSD : ''};
      this.EFT.PSGNLIST.push(obj);
    }
  }

  deleteRow(){
    if(this.EFT.PSGNLIST.length>1){
      this.EFT.PSGNLIST.pop();
    }
  }

  issueEFT(){
    this.msg ='';
    if(this.EFT.EFT_NO.trim().length==0){
      this.msg = "Provide the EFT number";
    }else{
      this.searchEFT().then((res:any)=>{
        if(res==''){
          this.makeEFT();
        }else{
          alert('WARNING : ' + this.msg);
          this.msg = 'do not issue eft';
        }
      });
    }
  }

  searchEFT(){
    return new Promise(resolve=>{
      var query = {EFT_NO : this.EFT.EFT_NO};
      var option = {exact : true};
      this.storageService.getDocuments(this.storageService.collectionName.EFT_MASTER_TABLE, 
      query, option).then((res:any)=>{
        if(res.length>0){
          this.msg = "EFT against this number has already been issued";
          resolve(this.msg);
        }else{
          resolve('');
        }
      });
    });
  }

  makeEFT(){
    this.msg = '';
    this.checkStationPairs();
    this.checkFare();

    if(this.EFT.COACH_ID.trim().length==0){
      this.msg = "Select coach";
    }
    if(this.EFT.REASON.trim().length==0){
      this.msg = "Give reason";
    }
    if(this.msg.length!=0){
      alert('Warning : ' + this.msg);
    }else{
      this.checkPassengerList();
      if(this.msg.length!=0){
        alert('Warning : ' + this.msg);
      }else{
        this.addPassengerToBackend(0);
        this.addBerthToBackend(0);
        this.addEftToBackend();
      }
    }

  }

  checkStationPairs(){
    if(this.EFT.FROM.trim().length==0){
      this.msg = "Select source station";
    }else if(this.EFT.FROM.trim().length==0){
      this.msg = "Select destination station";
    }else if(this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.FROM)>this.trainAssignmentObject.ISL_ARR.indexOf(this.EFT.TO)){
      this.msg = "Source station shall not be greater than destination station";
    }
  }

  checkFare(){
    if(this.EFT.FARE.trim().length==0){
      this.msg = 'Give fare';
    }else if(this.EFT.EXCESS_FARE.trim().length==0){
      this.msg = 'Give excess fare';
    }
  }

  checkPassengerList(){
    for(let i=0; i<this.EFT.PSGNLIST.length;i++){
      if(this.EFT.PSGNLIST[i].NAME.length==0){
        this.msg = "Passenger name can't be left blank";
        return false;
      }else if(this.EFT.PSGNLIST[i].AGE.length==0){
        this.msg = "Passenger age can't be left blank";
        return false;
      }
      for(let j=0; j<i;j++){
        if(this.EFT.PSGNLIST[i].BSD==this.EFT.PSGNLIST[j].BSD && this.EFT.PSGNLIST[i].BSD!='S'){
          this.msg = "same seat can't be alocated to multiple passengers";
          return false;
        }
      }
    }
  }

  addPassengerToBackend(index){
    if(index<this.EFT.PSGNLIST.length){
      let row = this.EFT.PSGNLIST[index];
      let currentTime =  this.util.getCurrentDateString();
      
      let obj = {
        BERTH_INDEX : row.BSD=='S'? 0 : row.BSD.json.BERTH_INDEX,
        WAITLIST_NO : 0,
        RES_UPTO : this.EFT.TO,
        SYSTIME : currentTime,
        JRNY_TO : this.EFT.TO,
        NEW_COACH_ID : '-',
        FOOD_FLAG : '-',       
        REMARKS : 'EFT',
        CLASS : row.BSD=='S'?'-' : row.BSD.json.CLASS,
        TICKET_NO : this.EFT.EFT_NO,
        PRIMARY_QUOTA : row.BSD=='S'?'-' : row.BSD.json.PRIMARY_QUOTA,
        PSGN_NO : index,
        REMOTE_LOC_NO : row.BSD=='S'? 1 : row.BSD.json.REMOTE_LOC_NO,
        NEW_BERTH_NO : '-',
        BERTH_NO : row.BSD=='S'? '0' : row.BSD.json.BERTH_NO,
        MSG_STN : '-',
        JRNY_FROM : this.EFT.FROM,
        CAB_CP : row.BSD=='S'? '-' : row.BSD.json.CAB_CP,
        NEW_CLASS : '-',
        BOARDING_PT : this.EFT.FROM,
        VIP_MARKER : '-',
        NEW_PRIMARY_QUOTA : '-',
        PENDING_AMT : 0,
        TRAIN_ID : this.EFT.TRAIN_ID,
        BERTH_SRC : row.BSD=='S'? '-' : row.BSD.json.SRC,
        TICKET_TYPE : 'X',
        ATTENDANCE_MARKER : 'P',
        CANCEL_PASS_FLAG : '-',
        CAB_CP_ID : row.BSD=='S'? '-' : row.BSD.json.CAB_CP_ID,
        SUB_QUOTA : row.BSD=='S'?'-' : row.BSD.json.SUB_QUOTA,
        AGE_SEX : row.AGE+row.SEX,
        REL_POS : index,
        PSGN_NAME : row.NAME,
        COACH_ID : this.EFT.COACH_ID,
        DUP_TKT_MARKER : '-',
        PNR_NO : this.EFT.EFT_NO,
        CH_NUMBER : this.EFT.CH_NUMBER,
        BERTH_DEST : row.BSD=='S'? '-' : row.BSD.json.DEST,
        UPDATE_TIME : currentTime,
        SYNC_TIME : ''
      };
      
      this.storageService.add(this.storageService.collectionName.PASSENGER_TABLE,obj).then(res=>{
        if(res){
          this.pdsp.addPsngBerth(obj);
          this.addPassengerToBackend(index+1);
        }
      });
    }
  }

  addBerthToBackend(index){
    if(index<this.EFT.PSGNLIST.length){
      let row = this.EFT.PSGNLIST[index];
      let obj = row.BSD;

      if(obj!='S'){
        obj.json.ALLOTED = 'Y';
        obj.json.REASON = 'X';
        this.storageService.replace(this.storageService.collectionName.VACANT_BERTH_TABLE,obj).then(res=>{
          if(this.EFT.TO.trim()!=obj.json.DEST.trim()){
            var berthObj = {
              BERTH_INDEX : obj.json.BERTH_INDEX,
              CAB_CP : obj.json.CAB_CP,
              TRAIN_ID : obj.json.TRAIN_ID,
              SRC : this.EFT.TO,
              SYSTIME : obj.json.SYSTIME,
              CLASS : obj.json.CLASS,
              PRIMARY_QUOTA : obj.json.PRIMARY_QUOTA,
              CAB_CP_ID : obj.json.CAB_CP_ID,
              SUB_QUOTA : obj.json.SUB_QUOTA,
              REMOTE_LOC_NO : obj.json.REMOTE_LOC_NO,
              BERTH_NO : obj.json.BERTH_NO,
              COACH_ID : obj.json.COACH_ID,
              CH_NUMBER : obj.json.CH_NUMBER,
              ALLOTED : 'N',
              REASON : 'V',
              DEST : obj.json.DEST
            }
            this.storageService.add(this.storageService.collectionName.VACANT_BERTH_TABLE,berthObj).then(res=>{
              this.addBerthToBackend(index+1);
            });
          }else{
            this.addBerthToBackend(index+1);
          }
        });
      }else{
        this.addBerthToBackend(index+1);
      }
    }
  }

  addEftToBackend(){
    
    var obj = {
      TRAIN_ID : this.EFT.TRAIN_ID,
      REMOTE_LOC_NO : 1,
      USER_ID : this.EFT.USER_ID,
      EFT_NO : this.EFT.EFT_NO,
      SRC : this.EFT.FROM,
      DEST : this.EFT.TO,
      FARE : Number(this.EFT.FARE),
      FINE :  Number(this.EFT.EXCESS_FARE),
      NUM_OF_PSGN : this.EFT.PSGNLIST.length,
      CLASS : '',
      TICKET_NO : this.EFT.EFT_NO,
      EFT_DATE : this.util.getCurrentDateString()
    };
    this.storageService.add(this.storageService.collectionName.EFT_MASTER_TABLE,obj).then(res=>{
      this.navCtrl.pop();
    });
  }
}
/* let d = Number.parseInt(this.EFT.EFT_NO);   
    if(Number.isNaN(d)){
      this.msg = 'key in eft number';
    }else{

    } */