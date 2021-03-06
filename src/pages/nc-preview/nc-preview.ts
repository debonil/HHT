import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

declare var WL;
declare var WLResourceRequest;

@IonicPage()
@Component({
  selector: 'page-nc-preview',
  templateUrl: 'nc-preview.html',
})
export class NcPreviewPage {
  NC_ROWS          = new Array();
  NC_TU_PREVIEW    : any;
  NC_NT_PREVIEW    : any;
  NC_TU_SUMMARY    = new Array();
  NC_NT_SUMMARY    = new Array();
  NC_TU_PSGN_UPDT  = new Array();
  NC_NT_BERTH_ADD  = new Array();
  NC_NT_PSGN_UPDT  = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    
    this.NC_ROWS          = this.navParams.data;

    for(let item of this.NC_ROWS){
      this.NC_TU_PREVIEW = item.TU;
      this.NC_NT_PREVIEW = item.NT;
    }
  }

  CNF_SUBMIT(){
    try{
      this.NC_TU_SUMMARY    = [];
      this.NC_NT_SUMMARY    = [];
      this.NC_TU_PSGN_UPDT  = [];
      this.NC_NT_PSGN_UPDT  = [];
      this.NC_NT_BERTH_ADD  = [];

      for(let item of this.NC_NT_PREVIEW){
        var obj = {
          COACH_ID 	: item.json.COACH_ID,
          BERTH 		: item.json.BERTH_NO,
          PNR 		  : item.json.PNR_NO,
          NAME 		  : item.json.PSGN_NAME,
          BRD_PT 		: item.json.BOARDING_PT,
          RES_UPTO 	: item.json.RES_UPTO,
          QUOTA 		: item.json.PRIMARY_QUOTA,
          REL_POS 	: item.json.REL_POS,
          STATUS 		: item.json.REMARKS,
          VAC_BERTH : 'Y',
          UPDT_PSGN : 'NT',
          RAC_TYPE  : 'N' 
       }
      this.NC_NT_SUMMARY.push(obj);
      console.log('this.NC_NT_SUMMARY : ' +JSON.stringify(this.NC_NT_SUMMARY));
      }
      for(let item of this.NC_TU_PREVIEW){
        var obj2 = {
          COACH_ID 	: item.json.COACH_ID,
          BERTH 		: item.json.BERTH_NO,
          PNR 		  : item.json.PNR_NO,
          NAME 		  : item.json.PSGN_NAME,
          BRD_PT 		: item.json.BOARDING_PT,
          RES_UPTO 	: item.json.RES_UPTO,
          QUOTA 		: item.json.PRIMARY_QUOTA,
          REL_POS 	: item.json.REL_POS,
          STATUS 		: item.json.REMARKS,
          VAC_BERTH : 'N',
          UPDT_PSGN : 'TU',
          RAC_TYPE  : 'N' 
       }
      this.NC_TU_SUMMARY.push(obj2);
      }
      this.EXECUTE_SUMMARY_NC_TO_NT();
      this.EXECUTE_SUMMARY_NC_TO_TU();
      this.modal_Close();
    }catch(ex){
      alert('EXCEPTION CNF_SUBMIT @ NC_PREVIEW.ts : ' +ex);
    }
  }

  EXECUTE_SUMMARY_NC_TO_NT(){
    try {
      var query = [];
      var options = {
        exact 	  : true
      };
      this.NC_NT_SUMMARY.forEach(val => {
        query.push({
            PNR_NO  : val.PNR,
            REL_POS : val.REL_POS
        });
      });
      //alert('QUERY EXECUTE_SUMMARY_NC_TO_NT : ' +JSON.stringify(query));
      WL.JSONStore.get('passenger').find(query,options).then((res)=>{
        res.forEach(psgn => {
          this.NC_NT_SUMMARY.forEach(NTPsgn => {
            if(NTPsgn.PNR==psgn.json.PNR_NO && NTPsgn.REL_POS==psgn.json.REL_POS){
              psgn.json.ATTENDANCE_MARKER = 'A';
              psgn.json.REMARKS = 'PDNTU';
              
              this.NC_NT_PSGN_UPDT.push(psgn);
              console.log('psgn : ' +JSON.stringify(this.NC_NT_PSGN_UPDT))

              if(NTPsgn.VAC_BERTH=='Y'){
                var berth = {
                    CAB_CP 			  :	psgn.json.CAB_CP,
                    TRAIN_ID		  :	psgn.json.TRAIN_ID,
                    SRC				    : psgn.json.BOARDING_PT,
                    SYSTIME			  : psgn.json.SYSTIME,
                    CLASS			    :	psgn.json.CLASS,
                    PRIMARY_QUOTA	:	psgn.json.PRIMARY_QUOTA,
                    CAB_CP_ID		  : psgn.json.CAB_CP_ID,
                    SUB_QUOTA		  :	psgn.json.SUB_QUOTA,
                    REMOTE_LOC_NO	: psgn.json.REMOTE_LOC_NO,
                    BERTH_NO		  :	psgn.json.BERTH_NO,
                    COACH_ID		  :	psgn.json.COACH_ID,
                    CH_NUMBER		  :	psgn.json.CH_NUMBER,
                    ALLOTED			  :	'N',
                    REASON			  : 'V',
                    DEST			    : psgn.json.JRNY_TO,
                    BERTH_INDEX 	: psgn.json.BERTH_INDEX
                };
                this.NC_NT_BERTH_ADD.push(berth);
              }
            }
          });
        });
        console.log(JSON.stringify(this.NC_NT_BERTH_ADD));
        this.UPDT_PSGN_IN_COLLECTION(this.NC_NT_PSGN_UPDT);
        this.ADD_BERTHS_IN_COLLECTION(this.NC_NT_BERTH_ADD);
      });
    } catch (ex) {
      alert('EXCEPTION EXECUTE_SUMMARY_NC_TO_NT @NC_PREVIEW.ts : ' +ex);
    }
  }

  EXECUTE_SUMMARY_NC_TO_TU(){
    try {
      var query = [];
      var options = {
        exact 	  : true
      };
      this.NC_TU_SUMMARY.forEach(val => {
        query.push({
            PNR_NO  : val.PNR,
            REL_POS : val.REL_POS
        });
      });
      //alert('QUERY NC_TU_SUMMARY : ' +JSON.stringify(query));
      WL.JSONStore.get('passenger').find(query,options).then((res)=>{
        res.forEach(psgn => {
          this.NC_TU_SUMMARY.forEach(NCPsgn => {
            if(NCPsgn.PNR==psgn.json.PNR_NO && NCPsgn.REL_POS==psgn.json.REL_POS){
              psgn.json.ATTENDANCE_MARKER = 'P';
              psgn.json.REMARKS           = '-';

              this.NC_TU_PSGN_UPDT.push(psgn);
            }
          });
        });
        this.UPDT_PSGN_IN_COLLECTION(this.NC_TU_PSGN_UPDT);
      });
    } catch (ex) {
      alert('EXCEPTION EXECUTE_SUMMARY_NC_TO_TU @NC_PREVIEW.ts : ' +ex);
    }
  }

  UPDT_PSGN_IN_COLLECTION(psgn){
    try{
      console.log('TOOL_PSGN_UPDT : ' +JSON.stringify(psgn));
      var option = {
          push : true,
      };
      WL.JSONStore.get('passenger').replace(psgn,option).then((res)=>{
        alert(res + ' DOCS UPDATED IN PSGN ');
      }).fail(function(res){
        alert('FAILED TO UPDATE PSGN IN TOOLS ' + JSON.stringify(res));
      });
    }catch(ex){	
      alert( 'EXCEPTION AT UPDATE PSGN IN TOOLS @NC_PREVIEW.ts' + ex);	
    }
  }

  ADD_BERTHS_IN_COLLECTION(berth){
    try{
      console.log('TOOL_BERTHS_ADD : ' +JSON.stringify(berth));
      var option = {
          push : true
      };
      WL.JSONStore.get('vacantberth').add(berth,option).then((res)=>{
        alert(res + ' DOCS ADDED IN BERTHS ');
      }).fail(function(res){
        alert('FAILED TO add Berth : ' + JSON.stringify(res));
      });
    }catch(ex){
      alert( 'EXCEPTION ADD_BERTH_IN_COLLECTION @ NC_PREVIEW.ts' + ex);
    }
  }

  modal_Close(){
    this.viewCtrl.dismiss(); 
  }

}
