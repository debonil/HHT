import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';
import { UtilProvider } from '../../providers/util/util';
import { ViewController } from 'ionic-angular';
/**
 * Generated class for the EftWithPnrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-eft-with-pnr',
  templateUrl: 'eft-with-pnr.html',
})
export class EftWithPnrPage {
  psgnObj:any = {};
  trainAssignmentObject: any = [];

  eftNo;
  eftAmt;
  eftType:any = ['Upgrade','Luggage','FreeEFT','JourneyExtend'];
  eftString = 'Type';
  coachString = 'Coach';
  berthString = 'Berth';
  berthObj;
  eftFrom:any = 'From';
  eftTo: any = 'To';
  stnArr:any = [];
  stnFrom: any = [];
  stnTo: any = []; 

  weight;
  reason;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private pdsp: PsngDataServiceProvider,
    private storage : StorageServiceProvider,
    private util : UtilProvider,
    private view: ViewController
  ) {
    this.psgnObj = navParams.data[0].dbObj;
    this.trainAssignmentObject = pdsp.trainAssignmentObject;
    //alert(JSON.stringify(this.trainAssignmentObject.ISL_ARR.pop()));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EftWithPnrPage');
  }

  alertEFTtype(){
    console.log(this.eftString);
    let alert = this.alertCtrl.create();
    alert.setTitle('EFT Type');
    for(var i=0;i<this.eftType.length;i++){
      alert.addInput({
        type: 'radio',
        label: this.eftType[i],
        value: this.eftType[i],
        checked: false
      });
    }
    alert.addButton({
      text: 'Okay',
      handler: data=>{
        console.log('type: '+JSON.stringify(data));
        this.eftString = data;
      }
    });
    alert.present();
  }

  alertFrom(){
    let alert = this.alertCtrl.create();
    alert.setTitle('From');
    for(var i=0;i<this.trainAssignmentObject.ISL_ARR.length-1;i++){
      alert.addInput({
        type: 'radio',
        label: this.trainAssignmentObject.ISL_ARR[i],
        value: this.trainAssignmentObject.ISL_ARR[i],
        checked: false
      });
    }
    alert.addButton({
      text: 'Okay',
      handler: data=>{
        console.log('type: '+JSON.stringify(data));
        this.eftFrom = data;
      }
    });
    alert.present();
  }

  alertTo(){
    let alert = this.alertCtrl.create();
    alert.setTitle('To');
    for(var i=0;i<this.trainAssignmentObject.ISL_ARR.length-1;i++){
      alert.addInput({
        type: 'radio',
        label: this.trainAssignmentObject.ISL_ARR[i],
        value: this.trainAssignmentObject.ISL_ARR[i],
        checked: false
      });
    }
    alert.addButton({
      text: 'Okay',
      handler: data=>{
        console.log('type: '+JSON.stringify(data));
        this.eftTo = data;
      }
    });
    alert.present();
  }

  alertCoach(){
    this.berthString = 'Berth';
    let alert = this.alertCtrl.create();
    alert.setTitle('Coach');
    for(var i=0;i<this.trainAssignmentObject.ASSIGNED_COACHES.length;i++){
      alert.addInput({
        type: 'radio',
        label: this.trainAssignmentObject.ASSIGNED_COACHES[i],
        value: this.trainAssignmentObject.ASSIGNED_COACHES[i],
        checked: false
      });
    }
    alert.addButton({
      text: 'Okay',
      handler: data=>{
        console.log('type: '+JSON.stringify(data));
        this.coachString = data;
        //this.alertBerth();
      }
    });
    alert.present();
  }

  alertBerth(){
    //alert(this.coachString);
    if(this.coachString!='Coach'){
      var query = {
        COACH_ID : this.coachString,
        ALLOTED : 'N'
      };
      this.storage.getDocuments(this.storage.collectionName.VACANT_BERTH_TABLE,query).then((res:any)=>{
        let alert = this.alertCtrl.create();
        alert.setTitle('Berth');
        for(var i=0;i<res.length;i++){
          alert.addInput({
            type: 'radio',
            label: res[i].json.BERTH_NO + '-' + res[i].json.SRC + '-' + res[i].json.DEST ,
            value: res[i],
            checked: false
          });
        }
        alert.addButton({
          text: 'Okay',
          handler: data=>{
            console.log('type: '+JSON.stringify(data));
            if(data && data.json){
              this.berthString = data.json.BERTH_NO + '-' + data.json.SRC + '-' + data.json.DEST;
              this.berthObj = data;
            }
          }
        });
        alert.present();
      });
    }
  }

  back(){
    //this.navCtrl.pop();
    this.view.dismiss();
  }

  issueEFT(){
    if(this.eftNo==undefined){
      alert('Warning: provide EFT no');
      return;
    }
    var query = {EFT_NO: this.eftNo.trim()};
    var option = {exact: true}
    this.storage.getDocumentCount(this.storage.collectionName.EFT_MASTER_TABLE,query,option).then(res=>{
     if(res==0){
        var object = {
          NAME : this.psgnObj.json.PSGN_NAME,
          FROM : this.psgnObj.json.COACH_ID + '-' + this.psgnObj.json.BERTH_NO + '-' + 
                this.psgnObj.json.JRNY_FROM + '-' + this.psgnObj.json.JRNY_TO,
          TO : this.coachString + '-' + this.eftFrom + '-' + this.eftTo,
          BERTH : this.berthString,
          WEIGHT :  this.weight,
          CLASS : this.psgnObj.json.CLASS,
          NEWCLASS : this.berthString!='Berth'? this.berthObj.json.CLASS : '',
          AMOUNT : this.eftAmt
        };
        switch(this.eftString){
          case 'Type' : {
            alert('Warning: select EFT type');
            break;
          }
          case 'Upgrade' : {
            this.eftUpgrade(object);
            break;
          }
          case 'Luggage' : {
            this.eftLuggage(object);
            break;
          }
          case 'FreeEFT' : {
            this.eftFree(object);
            break;
          }
          case 'JourneyExtend' : {
            this.eftJourneyExtend(object);
            break;
          }
          default :{
            alert('Warning: select EFT type');
            break;
          }
        }
      }else{
        alert('Warning: this eftno has already been issued');
      }
    });
  }

  eftUpgrade(object){
    if(this.eftNo==undefined || this.eftNo==''){
      alert('Warning: Provide EFT No');
      return;
    }
    if(this.eftAmt==undefined || this.eftAmt==''){
      alert('Warning: Provide Amount');
      return;
    }
    if(this.eftFrom=='From'){
      alert('Warning: Provide From');
      return;
    }
    if(this.eftTo=='To'){
      alert('Warning: Provide To');
      return;
    }
    if(this.coachString=='Coach'){
      alert('Warning: Provide Coach');
      return;
    }
    if(this.berthString=='Berth'){
      alert('Warning: Provide Berth');
      return;
    }
    if(object.CLASS == object.NEWCLASS){
      alert('Warning: upgrade in same class is not allowed');
      return;
    }

    this.presentConfirm('Upgrade',object).then(res=>{
      if(res){
        let obj  = JSON.parse(JSON.stringify(this.psgnObj ));

        obj.json.JRNY_TO = this.eftTo;
        obj.json.NEW_COACH_ID = obj.json.COACH_ID;
        obj.json.COACH_ID = this.coachString;
        obj.json.NEW_BERTH_NO = obj.json.BERTH_NO;
        obj.json.BERTH_NO = this.berthObj.json.BERTH_NO;
        obj.json.BERTH_INDEX = this.berthObj.json.BERTH_INDEX;
        obj.json.NEW_CLASS = obj.json.CLASS;
        obj.json.CLASS = object.NEWCLASS;
        obj.json.REMARKS = 'UPG-'+this.psgnObj.json.COACH_ID+'-'+this.psgnObj.json.BERTH_NO+ '-'+
          this.psgnObj.json.JRNY_FROM +'-' + this.psgnObj.json.JRNY_TO + 'TO-'+
          this.coachString+'-'+this.berthString.split('-')[0]+'-' + this.eftFrom+ '-'+this.eftTo ;

        console.log('update passenger ' + JSON.stringify(obj));

        var berthAdd = [];
        berthAdd.push({
          BERTH_INDEX : this.psgnObj.json.BERTH_INDEX,
          CAB_CP : this.psgnObj.json.CAB_CP,
          TRAIN_ID : this.psgnObj.json.TRAIN_ID,
          SYNC_TIME : this.psgnObj.json.SYNC_TIME,
          SRC : this.psgnObj.json.JRNY_FROM,
          SYSTIME : this.psgnObj.json.SYSTIME,
          CLASS : this.psgnObj.json.CLASS,
          UPDATE_TIME : this.psgnObj.json.UPDATE_TIME,
          PRIMARY_QUOTA : this.psgnObj.json.PRIMARY_QUOTA,
          CAB_CP_ID : this.psgnObj.json.CAB_CP_ID,
          SUB_QUOTA : this.psgnObj.json.SUB_QUOTA,
          REMOTE_LOC_NO : this.psgnObj.json.REMOTE_LOC_NO,
          BERTH_NO : this.psgnObj.json.BERTH_NO,
          COACH_ID : this.psgnObj.json.COACH_ID,
          CH_NUMBER : this.psgnObj.json.CH_NUMBER,
          ALLOTED : 'N',
          REASON : 'C',
          DEST : this.psgnObj.json.JRNY_TO,
        });

        if(this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.eftTo)<
          this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.berthObj.json.DEST)){
            berthAdd.push({
              BERTH_INDEX : this.berthObj.json.BERTH_INDEX,
              CAB_CP : this.berthObj.json.CAB_CP,
              TRAIN_ID : this.berthObj.json.TRAIN_ID,
              SYNC_TIME : this.berthObj.json.SYNC_TIME,
              SRC : this.eftTo,
              SYSTIME : this.berthObj.json.SYSTIME,
              CLASS : this.berthObj.json.CLASS,
              UPDATE_TIME : this.berthObj.json.UPDATE_TIME,
              PRIMARY_QUOTA : this.berthObj.json.PRIMARY_QUOTA,
              CAB_CP_ID : this.berthObj.json.CAB_CP_ID,
              SUB_QUOTA : this.berthObj.json.SUB_QUOTA,
              REMOTE_LOC_NO : this.berthObj.json.REMOTE_LOC_NO,
              BERTH_NO : this.berthObj.json.BERTH_NO,
              COACH_ID : this.berthObj.json.COACH_ID,
              CH_NUMBER : this.berthObj.json.CH_NUMBER,
              ALLOTED : 'N',
              REASON : 'C',
              DEST : this.berthObj.json.DEST,
            });
        }
        console.log('add berth ' + JSON.stringify(berthAdd));

        this.berthObj.json.ALLOTED = 'Y';
        this.berthObj.json.REASON = 'C';

        console.log('update berth ' + JSON.stringify(this.berthObj));

        var eftMaster = {
          TRAIN_ID : obj.json.TRAIN_ID,
          SYNC_TIME : obj.json.SYNC_TIME,
          SRC : this.eftFrom,
          SYSTIME : obj.json.SYSTIME,
          USER_ID : this.pdsp.trainAssignmentObject.USER_ID,
          GST : 0,
          CLASS : obj.json.CLASS,
          UPDATE_TIME : obj.json.UPDATE_TIME,
          NUM_OF_PSGN : 1,
          EFT_NO : this.eftNo,
          EFT_DATE : this.util.getCurrentDateString(),
          FARE : this.eftAmt,
          TICKET_NO : obj.json.PNR_NO,
          REMOTE_LOC_NO : obj.json.REMOTE_LOC_NO,
          FINE : 0,
          DEST : this.eftTo,
          REASON : 'UPG'
        };

        console.log('EFT MASTER ' + JSON.stringify(eftMaster));
        this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,obj).then(res=>{
          this.storage.replace(this.storage.collectionName.VACANT_BERTH_TABLE,this.berthObj).then(res=>{
            this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,berthAdd).then(res=>{
              this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,eftMaster).then(res=>{
                //this.navCtrl.pop();
                obj.EFT_TYPE = 'Upgrade';
                this.view.dismiss(obj);
              });
            });
          });
        });
      }
    });
  }

  eftLuggage(object){
    if(object.WEIGHT==undefined || object.WEIGHT<=0){
      alert('Warning: Provide weight in kgs');
      return;
    }
    if(object.AMOUNT==undefined || object.AMOUNT<=0){
      alert('Warning: Provide correct amount of eft ');
      return;
    }
    this.presentConfirm('Luggage',object).then(res=>{
      if(res){
        let obj  = JSON.parse(JSON.stringify(this.psgnObj ));
        obj.json.REMARKS = 'U LUG Rs-'+object.AMOUNT +'-Wt'+object.WEIGHT;

        var eftMaster = {
          TRAIN_ID : obj.json.TRAIN_ID,
          SYNC_TIME : obj.json.SYNC_TIME,
          SRC : obj.json.JRNY_FROM,
          SYSTIME : obj.json.SYSTIME,
          USER_ID : this.pdsp.trainAssignmentObject.USER_ID,
          GST : 0,
          CLASS : obj.json.CLASS,
          UPDATE_TIME : obj.json.UPDATE_TIME,
          NUM_OF_PSGN : 1,
          EFT_NO : this.eftNo,
          EFT_DATE : this.util.getCurrentDateString(),
          FARE : this.eftAmt,
          TICKET_NO : obj.json.PNR_NO,
          REMOTE_LOC_NO : obj.json.REMOTE_LOC_NO,
          FINE : 0,
          DEST : obj.json.JRNY_TO,
          REASON : 'U LUG-'+this.weight+'Kg'
        };
        this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,obj).then(res=>{
          this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,eftMaster).then(res=>{
            //this.navCtrl.pop();
            obj.EFT_TYPE = 'Luggage';
            this.view.dismiss(obj);
          });
        });
      }
    });
  }

  eftFree(object){
    this.presentConfirm('FreeEFT',object).then(res=>{
      if(res){
        let obj  = JSON.parse(JSON.stringify(this.psgnObj ));
        obj.json.REMARKS = 'FreeEFT';
        var eftMaster = {
          TRAIN_ID : obj.json.TRAIN_ID,
          SYNC_TIME : obj.json.SYNC_TIME,
          SRC : obj.json.JRNY_FROM,
          SYSTIME : obj.json.SYSTIME,
          USER_ID : this.pdsp.trainAssignmentObject.USER_ID,
          GST : 0,
          CLASS : obj.json.CLASS,
          UPDATE_TIME : obj.json.UPDATE_TIME,
          NUM_OF_PSGN : 1,
          EFT_NO : this.eftNo,
          EFT_DATE : this.util.getCurrentDateString(),
          FARE : 0,
          TICKET_NO : obj.json.PNR_NO,
          REMOTE_LOC_NO : obj.json.REMOTE_LOC_NO,
          FINE : 0,
          DEST : obj.json.JRNY_TO,
          REASON : this.reason
        };
        this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,obj).then(res=>{
          this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,eftMaster).then(res=>{
            obj.EFT_TYPE = 'FreeEFT';
            this.view.dismiss(obj);
          });
        });
      }
    });
  }

  eftJourneyExtend(object){
    if(this.trainAssignmentObject.ISL_ARR.indexOf(this.berthObj.json.DEST)<
      this.trainAssignmentObject.ISL_ARR.indexOf(this.eftTo)){
      alert('Warning: Such a brth allotment is not allowed');
      return;
    }
    if(this.eftNo==undefined || this.eftNo==''){
      alert('Warning: Provide EFT No');
      return;
    }
    if(this.eftAmt==undefined || this.eftAmt==''){
      alert('Warning: Provide Amount');
      return;
    }
    if(this.eftFrom=='From'){
      alert('Warning: Provide From');
      return;
    }
    if(this.eftTo=='To'){
      alert('Warning: Provide To');
      return;
    }
    if(this.coachString=='Coach'){
      alert('Warning: Provide Coach');
      return;
    }
    if(this.berthString=='Berth'){
      alert('Warning: Provide Berth');
      return;
    }
    if(object.CLASS != object.NEWCLASS){
      alert('Warning: extension in different class is not allowed');
      return;
    }
    if(this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.psgnObj.json.JRNY_TO)!=
      this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.eftFrom)){
      alert('Warning: such an extension is not allowed');
      return;
    }

    this.presentConfirm('JourneyExtend',object).then(res=>{
      if(res){
        let obj  = JSON.parse(JSON.stringify(this.psgnObj ));
        obj.json.JRNY_TO = this.eftTo;
        obj.json.NEW_COACH_ID = obj.json.COACH_ID;
        obj.json.COACH_ID = this.coachString;
        obj.json.NEW_BERTH_NO = obj.json.BERTH_NO;
        obj.json.BERTH_NO = this.berthObj.json.BERTH_NO;
        obj.json.BERTH_INDEX = this.berthObj.json.BERTH_INDEX;
        obj.json.NEW_CLASS = obj.json.CLASS;
        obj.json.CLASS = object.NEWCLASS;
        obj.json.REMARKS = 'PSG-'+this.psgnObj.json.COACH_ID+'-'+this.psgnObj.json.BERTH_NO +'-'+
          this.psgnObj.json.JRNY_FROM +'-' + this.psgnObj.json.JRNY_TO +'-JE-UPTO-'+
          this.eftTo +'-'+this.coachString+'-'+this.berthString.split('-')[0];
        var berthAdd;
        if(this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.eftTo)<
        this.pdsp.trainAssignmentObject.ISL_ARR.indexOf(this.berthObj.json.DEST)){
          berthAdd = {
            BERTH_INDEX : this.berthObj.json.BERTH_INDEX,
            CAB_CP : this.berthObj.json.CAB_CP,
            TRAIN_ID : this.berthObj.json.TRAIN_ID,
            SYNC_TIME : this.berthObj.json.SYNC_TIME,
            SRC : this.eftTo,
            SYSTIME : this.berthObj.json.SYSTIME,
            CLASS : this.berthObj.json.CLASS,
            UPDATE_TIME : this.berthObj.json.UPDATE_TIME,
            PRIMARY_QUOTA : this.berthObj.json.PRIMARY_QUOTA,
            CAB_CP_ID : this.berthObj.json.CAB_CP_ID,
            SUB_QUOTA : this.berthObj.json.SUB_QUOTA,
            REMOTE_LOC_NO : this.berthObj.json.REMOTE_LOC_NO,
            BERTH_NO : this.berthObj.json.BERTH_NO,
            COACH_ID : this.berthObj.json.COACH_ID,
            CH_NUMBER : this.berthObj.json.CH_NUMBER,
            ALLOTED : 'N',
            REASON : 'J',
            DEST : this.berthObj.json.DEST
          };
          console.log('add berth ' + JSON.stringify(berthAdd));
        }
        this.berthObj.json.ALLOTED = 'Y';
        this.berthObj.json.REASON = 'J';
        console.log('update berth ' + JSON.stringify(this.berthObj));
        var eftMaster = {
          TRAIN_ID : obj.json.TRAIN_ID,
          SYNC_TIME : obj.json.SYNC_TIME,
          SRC : this.eftFrom,
          SYSTIME : obj.json.SYSTIME,
          USER_ID : this.pdsp.trainAssignmentObject.USER_ID,
          GST : 0,
          CLASS : obj.json.CLASS,
          UPDATE_TIME : obj.json.UPDATE_TIME,
          NUM_OF_PSGN : 1,
          EFT_NO : this.eftNo,
          EFT_DATE : this.util.getCurrentDateString(),
          FARE : this.eftAmt,
          TICKET_NO : obj.json.PNR_NO,
          REMOTE_LOC_NO : obj.json.REMOTE_LOC_NO,
          FINE : 0,
          DEST : this.eftTo,
          REASON : 'JEX'
        };
        console.log('EFT MASTER ' + JSON.stringify(eftMaster));
        this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,obj).then(res=>{
          this.storage.replace(this.storage.collectionName.VACANT_BERTH_TABLE,this.berthObj).then(res=>{
            this.storage.add(this.storage.collectionName.EFT_MASTER_TABLE,eftMaster).then(res=>{
              if(berthAdd!=undefined){
                this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,berthAdd).then(res=>{
                  obj.EFT_TYPE = 'JourneyExtend';
                  this.view.dismiss(obj);
                });
              }else{
                obj.EFT_TYPE = 'JourneyExtend';
                this.view.dismiss(obj);
              }
            });
          });
        });
      }
    });
  }

  presentConfirm(action, object){
    return new Promise(resolve=>{
      if(action=='Upgrade'){
        var alert = this.alertCtrl.create({
          title: 'Confirm: class upgradation',
          message: 'Do you want to upgrade <br/>'+ object.NAME + ' <br/> FROM : ' + object.FROM 
            + ' <br/> TO : ' + object.TO + ' <br/> AT BERTH: ' + object.BERTH + 
            ' <br/> AMOUNT : ' + object.AMOUNT,
          buttons : [
            {
              text: 'Agree',
              role: 'Agree',
              handler: () => {
                console.log('agree clicked');
                resolve(true);
              }
            },{
              text: 'Disagree',
              role: 'cancel',
              handler: () => {
                console.log('disagree clicked');
                resolve(false);
              }
            }
          ]
        });
        alert.present();
      }
      if(action=='JourneyExtend'){
        var alertJE = this.alertCtrl.create({
          title: 'Confirm: journey extension',
          message: 'Do you want journey extension for <br/>'+ object.NAME + ' <br/> FROM : ' + object.FROM 
            + ' ?<br/> TO : ' + object.TO,
          buttons : [
            {
              text: 'Agree',
              role: 'Agree',
              handler: () => {
                console.log('agree clicked');
                resolve(true);
              }
            },{
              text: 'Disagree',
              role: 'cancel',
              handler: () => {
                console.log('disagree clicked');
                resolve(false);
              }
            }
          ]
        });
        alertJE.present();
      }
      if(action=='Luggage'){
        var alertLU = this.alertCtrl.create({
          title: 'Confirm: excess luggage EFT',
          message: 'Do you want to issue excess luggage EFT to <br/>'+ object.NAME +
            ' <br/> Weight : ' + object.WEIGHT + ' kg.'+
            ' <br/> AMOUNT : ' + object.AMOUNT,
          buttons : [
            {
              text: 'Agree',
              role: 'Agree',
              handler: () => {
                console.log('agree clicked');
                resolve(true);
              }
            },{
              text: 'Disagree',
              role: 'cancel',
              handler: () => {
                console.log('disagree clicked');
                resolve(false);
              }
            }
          ]
        });
        alertLU.present();
      }
      if(action=='FreeEFT'){
        var alertFree = this.alertCtrl.create({
          title: 'Confirm: free EFT',
          message: 'Do you want to issue free EFT to <br/>'+ object.NAME +
            ' <br/> From : ' + object.FROM,
          buttons : [
            {
              text: 'Agree',
              role: 'Agree',
              handler: () => {
                console.log('agree clicked');
                resolve(true);
              }
            },{
              text: 'Disagree',
              role: 'cancel',
              handler: () => {
                console.log('disagree clicked');
                resolve(false);
              }
            }
          ]
        });
        alertFree.present();
      }
    });
  }

}
