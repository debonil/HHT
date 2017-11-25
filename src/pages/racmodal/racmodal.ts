import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

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
 vacArr :any=[];
 islArray :any=[];
 psgnArr;
 newVacBerth :any[]=[];
 psgnVal:any[]=[];
 psgnData:any[]=[];
 vacBerth;
 stn1:any=[];
 stn2:any=[];
 racArr:any[]=[];
 PSGN_UPDT = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
    this.psgnArr = this.navParams.data;
    alert("psgn array "+JSON.stringify(this.psgnArr));
    this.psgnData.push(this.psgnArr);
        alert("psgn array "+JSON.stringify(this.psgnData));

    this.populateVacantBerth();
    this.populateISL();
  }

  populateISL(){
    WL.JSONStore.get('isldtlTable').findAll().then((res)=>{
      alert("stn code : "+JSON.stringify(res));
      for(let i=0;i<res.length;i++)
        {
          this.islArray.push({
               STN_CODE:res[i].json.STN_CODE
        
                  });
              //alert("stn code is : "+JSON.stringify(this.islArray));
               }
    });
  }

   populateVacantBerth(){
     var query={ALLOTED:'N'};
     WL.JSONStore.get('vacantberth').find(query).then((res)=>{
      alert("got vacant berth "+JSON.stringify(res));
      for(let i=0;i<res.length;i++){
        this.vacArr= res;
      }
    });
  }


  submit(){
    try{
      this.stn1.push({
       STN_CODE:this.psgnData[0].json.RES_UPTO
      });
      this.stn2.push({
       STN_CODE:this.vacBerth.json.DEST
      });
      if((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST))>(JSON.stringify(this.islArray).indexOf(this.psgnData[0].json.RES_UPTO))){
        this.newVacBerth.push({
          CLASS               :this.vacBerth.json.CLASS,
          CAB_CP_ID           :this.vacBerth.json.CAB_CP_ID,
          COACH_ID            :this.vacBerth.json.COACH_ID,
          REASON              :this.vacBerth.json.REASON,
          ALLOTED             :'N',
          DEST                :this.vacBerth.json.DEST,
          REMOTE_LOC_NO       :this.vacBerth.json.REMOTE_LOC_NO,
          SYSTIME             :this.vacBerth.json.SYSTIME,
          SUB_QUOTA           :this.vacBerth.json.SUB_QUOTA,
          BERTH_INDEX         :this.vacBerth.json.BERTH_INDEX,
          SRC                 :this.psgnData[0].json.RES_UPTO,
          TRAIN_ID            :this.vacBerth.json.TRAIN_ID,
          PRIMARY_QUOTA       :this.vacBerth.json.PRIMARY_QUOTA,
          CH_NUMBER           :this.vacBerth.json.CH_NUMBER,
          BERTH_NO            :this.vacBerth.json.BERTH_NO,
          CAB_CP              :this.vacBerth.json.CAB_CP
        });
      }
    //  alert("new vacant berth is ::"+JSON.stringify(this.newVacBerth));
      if(this.newVacBerth.length>0){
        var options={exact:false};
        WL.JSONStore.get('vacantberth').add(this.newVacBerth[0],options).then((res)=>{
         // alert("new vacant berth added " + JSON.stringify(this.newVacBerth));
          this.vacBerth.json.ALLOTED='Y';
          WL.JSONStore.get('vacantberth').replace(this.vacBerth).then(()=>{
           // alert('call addPasgn');
            this.addFirstPassenger();
          }).fail((f)=>{
             alert("fail to replace vacant berth " + f);
          });
        }).fail((f)=>{
          alert("failed to add new vacant berth");
        });
      }
      else{
        this.vacBerth.json.ALLOTED='Y';
          WL.JSONStore.get('vacantberth').replace(this.vacBerth).then(()=>{
         //   alert('call addPasgn');
            this.addFirstPassenger();
          }).fail((f)=>{
             alert("fail to replace vacant berth " + f);
          });
      }
    }catch(ex){
      alert('in submit ' + JSON.stringify(ex));
    }
     
  }

 /* submit2(){
    
     this.stn1.push({
       STN_CODE:this.psgnData[0].json.RES_UPTO
     });
      this.stn2.push({
       STN_CODE:this.vacBerth.json.DEST
      });
    if((JSON.stringify(this.islArray).indexOf(this.vacBerth.json.DEST))>(JSON.stringify(this.islArray).indexOf(this.psgnData[0].json.RES_UPTO))){
     try{
      this.newVacBerth.push({
        CLASS               :this.vacBerth.json.CLASS,
        CAB_CP_ID           :this.vacBerth.json.CAB_CP_ID,
        COACH_ID            :this.vacBerth.json.COACH_ID,
        REASON              :this.vacBerth.json.REASON,
        ALLOTED             :'N',
        DEST                :this.vacBerth.json.DEST,
        REMOTE_LOC_NO       :this.vacBerth.json.REMOTE_LOC_NO,
        SYSTIME             :this.vacBerth.json.SYSTIME,
        SUB_QUOTA           :this.vacBerth.json.SUB_QUOTA,
        BERTH_INDEX         :this.vacBerth.json.BERTH_INDEX,
        SRC                 :this.psgnData[0].json.RES_UPTO,
        TRAIN_ID            :this.vacBerth.json.TRAIN_ID,
        PRIMARY_QUOTA       :this.vacBerth.json.PRIMARY_QUOTA,
        CH_NUMBER           :this.vacBerth.json.CH_NUMBER,
        BERTH_NO            :this.vacBerth.json.BERTH_NO,
        CAB_CP              :this.vacBerth.json.CAB_CP
      });
      if(this.newVacBerth.length>0){
        var options={exact:false};
        WL.JSONStore.get('Vacantberth').add(this.newVacBerth[0],options).then((res)=>{
          alert("new vacant berth added " + JSON.stringify(this.newVacBerth));
        }).fail((f)=>{
          alert("failed to add new vacant berth");
        });
      }
      }catch(ex){
        alert(ex);
      }
    }
      this.racArr.push(this.vacBerth);
      this.vacBerth.json.ALLOTED='Y';
      WL.JSONStore.get('Vacantberth').replace(this.vacBerth).then(()=>{
      this.addFirstPassenger();
        }).fail((f)=>{
          alert("fail to replace vacant berth");
        });
   
  }*/

  addFirstPassenger(){
    this.PSGN_UPDT = [];
    var query = [];
    var options ={
      exact : true
    };  
      this.psgnVal.push(this.psgnArr);
      this.psgnVal.forEach(element => {
      query.push({
          REL_POS  : element.json.REL_POS,
          PNR_NO   : element.json.PNR_NO
        });
          WL.JSONStore.get('passenger').find(query,options).then((res)=>{
            res.forEach(psgn => {
              if(element.json.PNR_NO== psgn.json.PNR_NO && element.json.REL_POS == psgn.json.REL_POS){
                psgn.json.REMARKS='RAC_CNF';
                psgn.json.COACH_ID=this.vacBerth.json.COACH_ID;
                psgn.json.BERTH_INDEX=this.vacBerth.json.BERTH_INDEX;
                psgn.json.BERTH_NO=this.vacBerth.json.BERTH_NO;
              this.PSGN_UPDT.push(psgn)
              }
            });
            this.replaceValue();
        });

      });

  }

  replaceValue(){
    console.log('PSGN UPDT : ' +JSON.stringify(this.PSGN_UPDT));
      WL.JSONStore.get('passenger').replace(this.PSGN_UPDT).then((res)=>{
          this.getSecondPassenger(this.psgnData[0].json.COACH_ID,this.psgnData[0].json.BERTH_NO);
      });
  }
  
  getSecondPassenger(coach,berthNo){
      var query=[{COACH_ID:coach, BERTH_NO: berthNo}];
      WL.JSONStore.get('passenger').find(query).then((res)=>{
        this.updateSecondPassenger(res);
      }).fail((f)=>{
        alert("failed to find second passenger");
      });
  }

  updateSecondPassenger(result){
    result[0].json.REMARKS='RAC CNF';   
    WL.JSONStore.get('passenger').replace(result).then(()=>{
        this.getRAC();
      }).fail((f)=>{
     alert("failed to update passenger");
   });
  }

  getRAC(){
   var query=[{COACH_ID:this.psgnData[0].json.COACH_ID,BERTH_NO:this.psgnData[0].json.BERTH_NO}]
   WL.JSONStore.get('RAC').find(query).then((res)=>{
        this.updateRAC(res);
      }).fail((f)=>{
     alert("failed to find passenger");
   });
   
  }

  updateRAC(res){
    res[0].json.REMARKS="RAC CNF";
    res[1].json.REMARKS="RAC CNF";
    WL.JSONStore.get('RAC').replace(res).then(()=>{
     // alert("Updated RAC collection");
      this.closeModal();
    }).fail((f)=>{
      alert("failed to update RAC Collection");
    });
  }

  closeModal() {
   // alert("closing modal");
      this.viewCtrl.dismiss();
  }


}
