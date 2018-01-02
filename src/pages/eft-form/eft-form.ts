import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
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

  coachArr : any;
  islArr : any;
  berthArr : any;
  msg : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage : StorageProvider, private pdsp: PsngDataServiceProvider) {
      this.EFT.PSGNLIST.push({
        NAME : '',
        SEX : 'M',
        AGE : '',
        BSD : ''
      });
      this.storage.getTrainAssignment().then((result:any)=>{
        this.EFT.TRAIN_ID = result.TRAIN_ID,
        this.EFT.CH_NUMBER = result.CH_NUMBER;
        this.EFT.USER_ID = result.USER_ID;
      });
      this.storage.getAssignedCoaches().then(res=>{
        this.coachArr = res;
      });
      this.storage.getISL().then(res=>{
        this.islArr = res;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EftFormPage');
  }

  updateBerth(){
    if(this.islArr.indexOf(this.EFT.COACH_ID.trim().length>0 && this.EFT.TO)>this.islArr.indexOf(this.EFT.FROM) && this.islArr.indexOf(this.EFT.FROM)>-1){
      let srcArr = this.islArr.slice(0,this.islArr.indexOf(this.EFT.FROM)+1);
      let destArr = this.islArr.slice(this.islArr.indexOf(this.EFT.TO));

      this.storage.getAdvancedVacantBerthInCoach(srcArr,destArr, this.EFT.COACH_ID).then(res=>{
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

  makeEFT(){
    this.msg = '';
    this.checkEFT();
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

  checkEFT(){
    if(this.EFT.EFT_NO.trim().length==0){
      this.msg = "Provide the EFT number";
    }else{
      this.storage.getEftMaster().then((res:any)=>{
        if(res.length>0){
          this.msg = "EFT against this number has already been issued";
        }
      });
    }
  }

  checkStationPairs(){
    if(this.EFT.FROM.trim().length==0){
      this.msg = "Select source station";
    }else if(this.EFT.FROM.trim().length==0){
      this.msg = "Select destination station";
    }else if(this.islArr.indexOf(this.EFT.FROM)>this.islArr.indexOf(this.EFT.TO)){
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
      
      let obj = {
        BERTH_INDEX : row.BSD=='S'? 0 : row.BSD.json.BERTH_INDEX,
        WAITLIST_NO : 0,
        RES_UPTO : this.EFT.TO,
        SYSTIME : this.storage.getCurrentDate(),
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
        BERTH_DEST : row.BSD=='S'? '-' : row.BSD.json.DEST
      };
      this.storage.appendPassengers(obj).then(res=>{
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
        this.storage.replaceVacantBerth(obj).then(res=>{
          if(this.EFT.TO.trim()!=obj.json.DEST.trim()){ 
          /* if(this.islArr.indexOf(this.EFT.TO)<this.islArr.indexOf(obj.json.DEST)){ */
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
            this.storage.appendVacantBerth(berthObj).then(res=>{
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

  /* addBerthToBackend(index){
    return new Promise(resolve=>{
      if(index<this.EFT.PSGNLIST.length){
        let row = this.EFT.PSGNLIST[index];
        let obj = row.BSD;
        if(obj!='S'){
          obj.json.ALLOTED = 'Y';
          obj.json.REASON = 'X';
          this.storage.replaceVacantBerth(obj).then(res=>{
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
              this.storage.appendVacantBerth(berthObj).then(res=>{
                this.addBerthToBackend(index+1);
                resolve(true);
              });
            }
          });

        }else{
          this.addBerthToBackend(index+1);
          resolve(true);
        }
      }else{
        resolve(true);
      }
    });
  } */

  addEftToBackend(){
    var obj = {
      TRAIN_ID : this.EFT.TRAIN_ID,
      REMOTE_LOC_NO : 1,
      USER_ID : this.EFT.USER_ID,
      EFT_NO : this.EFT.EFT_NO,
      SRC : this.EFT.FROM,
      DEST : this.EFT.TO,
      FARE : this.EFT.FARE,
      FINE :  this.EFT.EXCESS_FARE,
      NUM_OF_PSGN : this.EFT.PSGNLIST.length,
      CLASS : '',
      TICKET_NO : this.EFT.EFT_NO,
      EFT_DATE : this.storage.getCurrentDate()
    };
    this.storage.appendEftMaster(obj).then(res=>{
      this.navCtrl.pop();
    });
  }

}
/* let d = Number.parseInt(this.EFT.EFT_NO);   
    if(Number.isNaN(d)){
      this.msg = 'key in eft number';
    }else{

    } */