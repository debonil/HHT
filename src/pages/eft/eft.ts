import { Component  , OnInit , } from '@angular/core';
import { NgForm} from '@angular/forms';
import { IonicPage, NavController, NavParams,ViewController , LoadingController , MenuController ,AlertController} from 'ionic-angular';
import { CoachDetails , DynamicFare, EftMaster, IsldtlTable, VacantBerth, Passenger} from '../../entities/map';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { ShowChartPage } from '../chart/showChart/showChart';
import {Logs} from '../../entities/messages';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
//import { ChartPsngPage } from '../chart-psng/chart-psng';

//declare var WL;
/**
 * Generated class for the EftPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eft',
  templateUrl: 'eft.html',
})
export class EftPage {
  //rootPage : ChartPsngPage;
  EFT = {
    TRAIN_ID : '',
    PNR_NO : '',
    COACH_ID : '',
    FARE : '',
    EXCESS_FARE : '',
    TOTAL : '',
    FROM : '',
    TO : '',
    REASON : '',
    PSGNLIST : [],
    CH_NUMBER : '',
    IS_CLEAN : true,
    PSGN_ADD : [],
    BERTH_ADD : [],
    BERTH_REPLACE : [],
    ERRORS : {
      COACH_ID : '',
      PNR_NO : '',
      FARE : '',
      EXCESS_FARE : '',
      SELECT_STATION : '',
      REASON : ''
    }
  };
  validationMessages = {
    'COACH_ID': {
      'required': 'Required field'
    },
    'PNR_NO': {
      'required': 'Required field'
    },
    'EXCESS_FARE': {
      'required': 'Required field'
    },
    'FARE': {
      'required': 'Required field'
    },
    'TOTAL': {
      'required': 'Required field'
    },
    'FROM': {
      'required': 'Required field'
    },
    'TO': {
      'required': 'Required field'
    },
    'REASON' : {
      'required': 'Required field'
    },
    'AGE' : {
      'required': 'Required field'
    },
    'BERTH':{
      'invalid' :'Invalid berth allocation'
    },
    'NAME' : {
      'required':'Required field'
    },
    'SELECT_STATION' :{
      'required' : 'Select station',
      'invalid' : 'Invalid station range'
    }
  };



  coachArr : CoachDetails[] = [];
  islArr : IsldtlTable[] = [];
  berthArr : VacantBerth[] = [];
  sex : string = 'M';
  form : NgForm;
  total : number;
  formErrors = {
    'PNR_NO': '',
    'EXCESS_FARE': '',
    'FARE' : '',
    'FROM' : '',
    'TO' : '',
    'REASON' : '',
    'AGE' : '',
    'BERTH' : '',
    'NAME' : '',
    'SELECT_STATION' : ''
  };
  gender = ['F','M' ,'O'];
  username: string;
  
  fromStn : any;
  toStn : any;
  coachId : string;

  berthSrc_srlno;
  berthDest_srlno;
  isClean : boolean;
  //eftList : any[];

  constructor(public navCtrl: NavController, private viewCtrl : ViewController ,
    public params : NavParams , private loadCtrl : LoadingController  , 
    private storage : StorageProvider , private menu : MenuController,
    private alert : AlertController , private logger : LoggerProvider,private pdsp: PsngDataServiceProvider) {
    //this.menu.get('menu1').enable(false);
    //this.menu.get('menu2').enable(true);
  }

  ngOnInit(){
    this.storage.getTrainAssignment().then((result:any)=>{
      this.EFT.TRAIN_ID = result.TRAIN_ID,
      this.EFT.CH_NUMBER = result.CH_NUMBER;
      this.coachArr = result.ASSIGNED_COACH;
      this.islArr = result.ISL;
      this.username = result.USER_ID;
      console.log('EFT USER : ' + JSON.stringify(this.username));
      console.log('EFT ISL : ' + JSON.stringify(this.islArr));
      console.log('EFT ASSIGNED COACH : ' + JSON.stringify(this.coachArr));

      for(let i=0;i<6;i++){
        this.EFT.PSGNLIST.push({
          NAME : '',
          SEX : 'M',
          AGE : 0,
          BSD : ''
        });
      }
    });
  }

  updateCoach() {
    //this.coachId = coach.trim();
    //this.storage.getVacantBerth({COACH_ID : this.coachId.trim()},{exact : true}).then((berth)=>{
    this.storage.getVacantBerth({
      COACH_ID : this.EFT.COACH_ID.trim(),
      ALLOTED : 'N'},{exact : true}).then((berth)=>{
      this.berthArr = berth;
    });
  }

  updateFromStn(stnCode){
    this.fromStn = {
      SRL_NO : stnCode.STN_SRL_NO,
      CODE : stnCode.STN_CODE
    };
  }

  updateToStn(stnCode){
    this.toStn = {
      SRL_NO : stnCode.STN_SRL_NO,
      CODE : stnCode.STN_CODE
    };
  }

  updateGender(sex) {
      this.sex = sex;
  }

  getTotal(fare, excessfare){
    this.total = fare + excessfare;
  }

  ionViewWillEnter() {
      this.viewCtrl.showBackButton(false);
  }

  resetEFTErrors(){
    return new Promise(resolve=>{
      this.EFT.IS_CLEAN = true;
      this.EFT.ERRORS.COACH_ID = '';
      this.EFT.ERRORS.PNR_NO = '';
      this.EFT.ERRORS.FARE = '';
      this.EFT.ERRORS.EXCESS_FARE = '';
      this.EFT.ERRORS.SELECT_STATION = '';
      this.EFT.ERRORS.REASON = '';

      resolve(true);
    });
  }

  scanEFT(){
    this.resetEFTErrors().then(reset=>{
      if(this.EFT.COACH_ID==''){
        this.EFT.ERRORS.COACH_ID = this.validationMessages.COACH_ID.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }
      if(this.EFT.PNR_NO==''){
        this.EFT.ERRORS.PNR_NO = this.validationMessages.PNR_NO.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }
      if(this.EFT.FARE=='' && this.EFT.IS_CLEAN){
        this.EFT.ERRORS.FARE = this.validationMessages.FARE.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }
      if(this.EFT.EXCESS_FARE=='' && this.EFT.IS_CLEAN){
        this.EFT.ERRORS.EXCESS_FARE = this.validationMessages.EXCESS_FARE.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }
      if( (JSON.parse(JSON.stringify(this.EFT.FROM))=='' || JSON.parse(JSON.stringify(this.EFT.TO))=='') && this.EFT.IS_CLEAN){
        this.EFT.ERRORS.SELECT_STATION = this.validationMessages.SELECT_STATION.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }else{
        if(JSON.parse(JSON.stringify(this.EFT.FROM)).STN_SRL_NO > JSON.parse(JSON.stringify(this.EFT.TO)).STN_SRL_NO && this.EFT.IS_CLEAN){
          this.EFT.ERRORS.SELECT_STATION = this.validationMessages.SELECT_STATION.invalid;
          this.EFT.IS_CLEAN = false;
          return false;
        }
      }
      if(this.EFT.REASON=='' && this.EFT.IS_CLEAN){
        this.EFT.ERRORS.REASON = this.validationMessages.REASON.required;
        this.EFT.IS_CLEAN = false;
        return false;
      }
      if(this.EFT.PSGNLIST[0].NAME=='' && this.EFT.IS_CLEAN){
        alert('GIVE FIRST PASSENGER NAME ');
        this.EFT.IS_CLEAN = false;
        return false;
      }

      for(let i=0; i<this.EFT.PSGNLIST.length;i++){
        if(this.EFT.PSGNLIST[i].BSD!='S' && this.EFT.PSGNLIST[i].BSD!='' ){
          for(let j=0; j<i;j++){
            if(this.EFT.PSGNLIST[i].BSD == this.EFT.PSGNLIST[j].BSD){
              alert('SAME SEAT CAN NOT BE ALLOTED TO MULTIPLE PASSENGERS');
              this.EFT.IS_CLEAN = false;
              return false;
            }
          }
          this.islArr.forEach(res=>{
            if(res.STN_CODE.trim()==this.EFT.PSGNLIST[i].BSD.json.DEST.trim()){
              if(res.STN_SRL_NO< JSON.parse(JSON.stringify(this.EFT.TO)).STN_SRL_NO){
                alert('such an allotment is not allowed++++++++++++++++++');
                this.EFT.IS_CLEAN = false;
                return false;
              }
            }
          });
        }
      }
      if(this.EFT.IS_CLEAN){
       // alert('issue EFT');
        this.issueEFT(0);
      }
    });
  }

  issueEFT(index){
    //alert('********' + index);
    if(index<this.EFT.PSGNLIST.length){
      //if(element.NAME!='' && element.BSD!=''){
      if(this.EFT.PSGNLIST[index].NAME!='' && this.EFT.PSGNLIST[index].BSD!=''){
        this.addEFTPassenger(this.EFT.PSGNLIST[index],index).then(res=>{
          if(res){
            if(this.EFT.PSGNLIST[index].BSD!='S'){
              this.EFT.PSGNLIST[index].BSD.json.ALLOTED = 'Y';
              this.EFT.PSGNLIST[index].BSD.json.REASON = 'X';
              this.storage.replaceVacantBerth(this.EFT.PSGNLIST[index].BSD).then(res=>{
                console.log(res + 'replaceVacantBerth' + JSON.stringify(this.EFT.PSGNLIST[index].BSD));
                if(res){
                  this.addEFTBerth(this.EFT.PSGNLIST[index].BSD).then(res=>{
                    if(res){
                      this.issueEFT(index+1);
                    }
                  });
                }
              });
            }else{
              this.issueEFT(index+1);//-------------------
            }
          }
        });
      }else{
        this.issueEFT(index+1);
      }  
    }else{
      this.addEFTMaster().then(res=>{
        if(res){
          //alert('EFT GENERATED ');
          //this.navCtrl.pop();
          //this.navCtrl.setRoot(EftPage);
          this.navCtrl.pop();
        }
      });
    }
  }

  close(){
    this.navCtrl.pop();
  }

  addEFTPassenger(row, index){
    return new Promise(resolve=>{
      var psgnObj = {
        BERTH_INDEX : row.BSD=='S'? 0 : row.BSD.json.BERTH_INDEX,
        WAITLIST_NO : "0",
        RES_UPTO : JSON.parse(JSON.stringify(this.EFT.TO)).STN_CODE,
        SYSTIME : this.storage.getCurrentDate(),
        JRNY_TO : JSON.parse(JSON.stringify(this.EFT.TO)).STN_CODE,
        NEW_COACH_ID : '-',
        FOOD_FLAG : 'V',
        REMARKS : 'EFT',
        CLASS : row.BSD=='S'?'-' : row.BSD.json.CLASS,
        TICKET_NO : this.EFT.PNR_NO,
        PRIMARY_QUOTA : row.BSD=='S'?'-' : row.BSD.json.PRIMARY_QUOTA,
        PSGN_NO : index,
        REMOTE_LOC_NO : row.BSD=='S'? 1 : row.BSD.json.REMOTE_LOC_NO,
        NEW_BERTH_NO : '-',
        BERTH_NO : row.BSD=='S'? '0' : row.BSD.json.BERTH_NO,
        MSG_STN : '-',
        JRNY_FROM : JSON.parse(JSON.stringify(this.EFT.FROM)).STN_CODE,
        CAB_CP : row.BSD=='S'? '-' : row.BSD.json.CAB_CP,
        NEW_CLASS : '-',
        BOARDING_PT : JSON.parse(JSON.stringify(this.EFT.FROM)).STN_CODE,
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
        //COACH_ID : row.BSD=='S'? '-' : row.BSD.json.COACH_ID,
        COACH_ID : this.EFT.COACH_ID,
        DUP_TKT_MARKER : '-' ,
        PNR_NO : this.EFT.PNR_NO,
        CH_NUMBER : this.EFT.CH_NUMBER,
        BERTH_DEST : row.BSD=='S'? '-' : row.BSD.json.DEST
      };
      
      this.storage.appendPassengers(psgnObj).then(res=>{
        console.log(res + 'Appended PSGN : ' + JSON.stringify(psgnObj));
        if(res){
          this.pdsp.addPsngBerth(psgnObj);
          resolve(true);
        }else{
          //alert('PASSENGER APPEND FAILS....');
          resolve(false);
        }
      });
    });
  }

  addEFTBerth(berth){
    return new Promise(resolve=>{
      this.storage.getStationSerialNumber2(berth.json.DEST).subscribe(srlNo=>{
        if(srlNo>JSON.parse(JSON.stringify(this.EFT.TO)).STN_SRL_NO){
          var berthObj = {
            BERTH_INDEX : berth.json.BERTH_INDEX,
            CAB_CP : berth.json.CAB_CP,
            TRAIN_ID : berth.json.TRAIN_ID,
            SRC : JSON.parse(JSON.stringify(this.EFT.TO)).STN_CODE,
            SYSTIME : berth.json.SYSTIME,
            CLASS : berth.json.CLASS,
            PRIMARY_QUOTA : berth.json.PRIMARY_QUOTA,
            CAB_CP_ID : berth.json.CAB_CP_ID,
            SUB_QUOTA : berth.json.SUB_QUOTA,
            REMOTE_LOC_NO : berth.json.REMOTE_LOC_NO,
            BERTH_NO : berth.json.BERTH_NO,
            COACH_ID : berth.json.COACH_ID,
            CH_NUMBER : berth.json.CH_NUMBER,
            ALLOTED : 'N',
            REASON : 'V',
            DEST : berth.json.DEST
          };
          this.storage.appendVacantBerth(berthObj).then(res=>{
            if(res){
              resolve(true);
            }else{
              //alert('BERTH APPEND FAILS');
              resolve(false);
            }
          });
        }else{
          resolve(true);
        }
      });
    });
  }

  replaceEFTBerth(berth){
    berth.json.REASON = 'X';
    berth.json.ALLOTED = 'Y';
    this.storage.replaceVacantBerth(berth).then(res=>{
      if(!res){
        //alert('BERTH REPLACE FAILS');
      }
    });
  }

  addEFTMaster(){
    //alert('add eft master');
    return new Promise(resolve=>{
      var eftMaster = {
        TRAIN_ID : this.EFT.TRAIN_ID,
        REMOTE_LOC_NO : 1,
        USER_ID : '--',
        EFT_NO : this.EFT.PNR_NO,
        SRC : JSON.parse(JSON.stringify(this.EFT.FROM)).STN_CODE,
        DEST : JSON.parse(JSON.stringify(this.EFT.TO)).STN_CODE,
        FARE : this.EFT.FARE,
        FINE :  this.EFT.EXCESS_FARE,
        NUM_OF_PSGN : 1,
        CLASS : '',
        TICKET_NO : this.EFT.PNR_NO,
        EFT_DATE : this.storage.getCurrentDate()
      };
      this.storage.appendEftMaster(eftMaster).then(res=>{
        if(res){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

}


