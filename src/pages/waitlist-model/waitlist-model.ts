import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { WaitlistPage } from '../waitlist/waitlist';
import { ShowChartPage } from '../chart/showChart/showChart';

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
  wlPsgn : any;
  berth : any;
  wlSrc : any;
  wlDest : any;
  berthSrc : any;
  berthDest : any;
  bsd : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController,
  private storage : StorageProvider) {
    this.wlPsgn = {
      _id : navParams.data._id,
      json : navParams.data.json
    };
    console.log('this.wlPsgn : '+JSON.stringify(this.wlPsgn));
    this.storage.getVacantBerth({ALLOTED : 'N'},{exact : true}).then(res=>{
      this.berth = res;
      this.storage.getStationSerialNumber(navParams.data.json.JRNY_FROM, navParams.data.json.JRNY_TO).then((res:any)=>{
        this.wlSrc = {
          STN_CODE : navParams.data.json.JRNY_FROM,
          STN_SRL_NO : res.SRC_SRL_NO
        };
        this.wlDest = {
          STN_CODE : navParams.data.json.JRNY_TO,
          STN_SRL_NO : res.DEST_SRL_NO
        };
      });
    });
  }

  onSubmit(){
    alert('add waitlist '+(this.bsd));
    if(this.bsd!=undefined){
      this.storage.getStationSerialNumber(this.bsd.json.SRC, this.bsd.json.DEST).then((res:any)=>{
        this.berthSrc = {
          STN_CODE : this.bsd.json.SRC,
          STN_SRL_NO : res.SRC_SRL_NO
        };
        this.berthDest = {
          STN_CODE : this.bsd.json.DEST,
          STN_SRL_NO : res.DEST_SRL_NO
        };
        
        if(this.berthDest.STN_SRL_NO<this.wlDest.STN_SRL_NO || this.berthSrc.STN_SRL_NO>=this.wlDest.STN_SRL_NO){
          alert('such an allotment is not aollwed');
        }else{
          this.assignWaitlist();
        }
      });
    }else{
      alert('such an allotment is not allowed');
    }
  }

  close(){
    this.navCtrl.pop();
  }

  assignWaitlist(){
    var berthAdd = [];
    this.wlPsgn.json.BERTH_INDEX = this.bsd.json.BERTH_INDEX;
    this.wlPsgn.json.BERTH_NO = this.bsd.json.BERTH_NO;
    this.wlPsgn.json.COACH_ID = this.bsd.json.COACH_ID;
    this.wlPsgn.json.ATTENDANCE_MARKER = 'P';
    //this.wlPsgn.json.WAITLIST_NO = 0;

    if(this.berthSrc.STN_SRL_NO< this.wlSrc.STN_SRL_NO){
      var berth = {
        BERTH_INDEX : this.bsd.json.BERTH_INDEX,
        CAB_CP : this.bsd.json.CAB_CP,
        TRAIN_ID : this.bsd.json.TRAIN_ID,
        SRC : this.berthSrc.STN_CODE,
        SYSTIME : this.bsd.json.SYSTIME,
        CLASS : this.bsd.json.CLASS,
        PRIMARY_QUOTA : this.bsd.json.PRIMARY_QUOTA,
        CAB_CP_ID : this.bsd.json.CAB_CP_ID,
        SUB_QUOTA : this.bsd.json.SUB_QUOTA,
        REMOTE_LOC_NO : this.bsd.json.REMOTE_LOC_NO,
        BERTH_NO : this.bsd.json.BERTH_NO,
        COACH_ID : this.bsd.json.COACH_ID,
        CH_NUMBER : this.bsd.json.CH_NUMBER,
        ALLOTED : 'N',
        REASON : 'V',
        DEST : this.wlSrc.STN_CODE
      };
      berthAdd.push(berth);
    }

    if(this.berthDest.STN_SRL_NO>this.wlDest.STN_SRL_NO){
      var berth1 = {
        BERTH_INDEX : this.bsd.json.BERTH_INDEX,
        CAB_CP : this.bsd.json.CAB_CP,
        TRAIN_ID : this.bsd.json.TRAIN_ID,
        SRC : this.wlDest.STN_CODE,
        SYSTIME : this.bsd.json.SYSTIME,
        CLASS : this.bsd.json.CLASS,
        PRIMARY_QUOTA : this.bsd.json.PRIMARY_QUOTA,
        CAB_CP_ID : this.bsd.json.CAB_CP_ID,
        SUB_QUOTA : this.bsd.json.SUB_QUOTA,
        REMOTE_LOC_NO : this.bsd.json.REMOTE_LOC_NO,
        BERTH_NO : this.bsd.json.BERTH_NO,
        COACH_ID : this.bsd.json.COACH_ID,
        CH_NUMBER : this.bsd.json.CH_NUMBER,
        ALLOTED : 'N',
        REASON : 'V',
        DEST : this.berthDest.STN_CODE
      };
      berthAdd.push(berth1);
    }

    this.bsd.json.ALLOTED = 'Y';
    this.bsd.json.REASON = 'W';

    this.storage.appendVacantBerth(berthAdd).then(berthAdded=>{
      if(berthAdded){
        this.storage.replaceVacantBerth(this.bsd).then(berthReplaced=>{
          if(berthReplaced){
            this.storage.replacePassenger(this.wlPsgn).then(psgnUpdate=>{
              if(psgnUpdate){
                //this.viewCtrl.dismiss();
                //this.navCtrl.push(WaitlistPage);
                this.navCtrl.pop();
                //this.navCtrl.pop();
                //this.navCtrl.push(WaitlistPage);
              }else{
                alert('FAILS TO UPDATE PASSENGER');
              }
            });
          }else{
            alert('FAILS TO REPLACE PSGN');
          }
        });
      }else{
        alert('FAILS TO ADD BERTH');
      }
    });
  }
}
