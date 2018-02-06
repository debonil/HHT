import { Injectable } from '@angular/core';
import { CoachDetails ,CoachTime, DropEticketPassenger, DynamicFare, EftMaster, IsldtlTable, 
  VacantBerth, Passenger, NewCoaches} from '../../entities/map';
import {Observable} from 'rxjs/Observable';

declare var WL;
/*
  Generated class for the StorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageProvider {
  data : any  = null;
  dirtyDocs = [];
  dirtyPassengerData : Passenger[] =[];
  coachData : CoachDetails[] = [];

  constructor() {
    console.log('Hello StorageProvider Provider');
  }

  init(){
    console.log('--> StorageProvider init called');
    return new Promise(resolve=>{
      var collections = {
        trainAssignment :{},
        coachTime : {
          searchFields    : {COACH_ID : 'string', SRC : 'string'}
        },
        droptEticketPassenger : {
          searchFields    : {TRAIN_ID : 'integer',REMOTE_LOC_NO : 'integer',PNR_NO : 'string', REL_POS : 'integer'}
        },
        dynamicFare : {
          searchFields    : {TRAIN_ID : 'integer', FROM_STN : 'string', TO_STN : 'string'}
        },
        eftMaster : {
          searchFields    : { EFT_NO : 'string',TRAIN_ID : 'integer'}
        },
        vacantberth : {
          searchFields : { TRAIN_ID : 'integer',COACH_ID : 'string',BERTH_NO : 'string',CLASS : 'string',
                           REMOTE_LOC_NO : 'string',BERTH_INDEX : 'string', DEST : 'string', 
					                 SRC : 'string',ALLOTED : 'string',REASON : 'string'}
        },
        passenger : {
          searchFields : {TRAIN_ID : 'integer', COACH_ID : 'string', BOARDING_PT : 'string', BERTH_INDEX : 'integer',
                          PSGN_NAME : 'string', PNR_NO : 'string',ATTENDANCE_MARKER : 'string', JRNY_FROM : 'string', 
                          JRNY_TO : 'string',VIP_MARKER : 'string', TICKET_TYPE : 'string', REL_POS : 'integer',
                          REMARKS : 'string',RES_UPTO : 'string',BERTH_NO :'string', PRIMARY_QUOTA : 'string', 
                          CANCEL_PASS_FLAG : 'string', WAITLIST_NO : 'string', CLASS : 'string'}
        }
      };
      console.log('--> collections'+JSON.stringify(collections));
      WL.JSONStore.init(collections).then((success)=>{
        WL.Logger.info("JSONStore initialised");
        resolve(true);
      },(failure)=>{
        WL.Logger.error("Failed to initialise JSONStore");
        resolve(false);
      });
    });
  }

  clear(collectionName){
    //alert('clear ' + collectionName);
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).clear().then((success) =>{
        WL.Logger.info('Data cleared succesfully');
        resolve(true);
      },(failure) =>{
        WL.Logger.error('Not cleared ...');
        resolve(false);
      });
    });
  }

  markClean(collectionName, dirtyDocs){
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).markClean(dirtyDocs).then((docs)=>{
        WL.Logger.info('clensed records' + docs);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('could not cleanse');
        resolve(false);
      });
    });
  }

  getCurrentDate(){
    var dd = '' + (new Date()).getDate();
    if(dd.length<2){
      dd = '0' + dd;
    }
    var mm = '' + ((new Date()).getMonth()+1);
    if(mm.length<2){
      mm = '0' + mm;
    }
    var yyyy = (new Date()).getFullYear();
    var hh = '' + (new Date()).getHours();
    if(hh.length<2){
      hh = '0' + hh;
    }
    var mi = '' + (new Date()).getMinutes();
    if(mi.length<2){
      mi = '0' + mi;
    }
    var ss = '' + (new Date()).getSeconds();
    if(ss.length<2){
      ss = '0' + ss;
    }
    //(new Date()).getMilliseconds();
    return yyyy + '-' + mm + '-' + dd +' ' + hh + ':' + mi + ':' + ss + '.' + (new Date()).getMilliseconds();
  }

  getTrainAssignment(){
    return new Promise(resolve=>{
      //WL.JSONStore.get('trainAssignment').findAll().then(success=>{
      WL.JSONStore.get('trainAssignment').findAll().then(success=>{
        if(success.length !== 0){
          resolve(success[0].json);
        }else{
          resolve('');
        }
      });
    });
  }

  getTrainAssignmentDocument(){
    return new Promise(resolve=>{
      WL.JSONStore.get('trainAssignment').findAll().then(success=>{
        resolve(success[0]);
      });
    });
  }

  getTrainAssignmentCount(){
    return new Promise(resolve=>{
      let collectionName = 'trainAssignment';
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  replaceTrainAssignment(doc){
    console.log(doc);
    return new Promise(resolve=>{
      let collectionName = 'trainAssignment';
      let dbObj =[];
      if(!doc["_id"]){
        dbObj["json"]=doc;
        dbObj["_id"]=1;
      }else{
        dbObj=doc;
      }
      WL.JSONStore.get(collectionName).replace(dbObj).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  addTrainAssignment(data){
    return new Promise(resolve=>{
      let collectionName = 'trainAssignment';
      let options = {
        addNew : true,
        markDirty : false
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then(success=>{
        resolve(true);
      },failure=>{
        resolve(false);
      });
    });
  }

  getStationSerialNumber(src,dest){
    return new Promise(resolve=>{
      var obj = {
        SRC_SRL_NO : -1,
        DEST_SRL_NO : -1 
      };
      WL.JSONStore.get('trainAssignment').findAll().then(res=>{
        var isl = res[0].json.ISL;
        //alert(src + '*' + dest +' ----- '+ JSON.stringify(isl));
        for(var i=0; i<isl.length; i++){
          if(isl[i].STN_CODE.trim()==src.trim()){
            obj.SRC_SRL_NO = isl[i].STN_SRL_NO;
          }
          if(isl[i].STN_CODE.trim()==dest.trim()){
            obj.DEST_SRL_NO = isl[i].STN_SRL_NO;
          }
          if(i==isl.length-1){
            //alert('resolve ' + JSON.stringify(obj));
            resolve(obj);
          }
        }
      });
    });
  }

  getStationSerialNumber2(stnCode){
    return Observable.create(observer=>{
      WL.JSONStore.get('trainAssignment').findAll().then(res=>{
        let isl = res[0].json.ISL;
        isl.forEach(element=>{
          if(element.STN_CODE.trim()==stnCode.trim()){
            observer.next(element.STN_SRL_NO);
            observer.complete();
          }
        });
      });
    });
  }

  addCoachTime(data){
    return new Promise(resolve=>{
      let collectionName = 'coachTime';
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          addNew : true,
          markDirty : true
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        WL.Logger.info('replaced coaches' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('replace failed for coaches');
        resolve(false);
      });
    });
  }

  getCoachtimeCount(){
    return new Promise(resolve=>{
      let collectionName = 'coachTime';
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  addDroppedEticketPassenger(data){
    return new Promise(resolve=>{
      let collectionName = 'droptEticketPassenger';
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          addNew : true,
          markDirty : true
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        WL.Logger.info('replaced coaches' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('replace failed for coaches');
        resolve(false);
      });
    });
  }

  getDroppedEticketPassengerCount(){
    return new Promise(resolve=>{
      let collectionName = 'droptEticketPassenger';
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  putWaitListPassenger(data){
     return new Promise(resolve=>{
      let collectionName = 'passenger';
      let options = {
        addNew : true,
        markDirty : false
      };
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        //alert('WL PSGN ADDED ' + success);
        resolve(true);
      },(failure)=>{
        alert('putWaitListPassenger fails'+JSON.stringify(failure));
        resolve(false);
      });
    });
  }

  getWaitlistCount(query:any, option:any){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      WL.JSONStore.get(collectionName).count(query, option).then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  getDropEticketPassenger(collectionName){
    return new Promise(resolve=>{
      let options = { };
      WL.JSONStore.get(collectionName).findAll(options).then((success)=>{
        var dropEtktPsgn = [];
        success.forEach(element=>{
          dropEtktPsgn.push(element.json);
        });
        resolve(dropEtktPsgn);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getPassenger(collectionName){
    return new Promise(resolve=>{
      let options = { };
      WL.JSONStore.get(collectionName).findAll(options).then((success)=>{
        var dropEtktPsgn = [];
        success.forEach(element=>{
          dropEtktPsgn.push(element.json);
        });
        resolve(dropEtktPsgn);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  addDynamicFare(data){
    return new Promise(resolve=>{
      let collectionName = 'dynamicFare';
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          addNew : true,
          markDirty : true
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        WL.Logger.info('added dynamic fare' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('replace failed for dynamic fare');
        resolve(false);
      });
    });
  }

  getDynamicFareCount(){
    return new Promise(resolve=>{
      let collectionName = 'dynamicFare';
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  addEftMaster(data){
    return new Promise(resolve=>{
      let collectionName = 'eftMaster';
      let options = {
          addNew : true,
          markDirty : true
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  appendEftMaster(data){
    return new Promise(resolve=>{
      let collectionName = 'eftMaster';
      let options = {
          addNew : true,
          markDirty : true
      };
      //this.clear(collectionName);
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  getEftMasterCount(){
    return new Promise(resolve=>{
      let collectionName = 'eftMaster';
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }

  getEftMaster(){
    return new Promise(resolve=>{
      let collectionName = 'eftMaster';
      WL.JSONStore.get(collectionName).findAll().then((res)=>{
        resolve(res);
      },(failure)=>{
        resolve("failure");
      });
    });
  }

  findEftMaster(eftno){
    return new Promise(resolve=>{
      let collectionName = 'eftMaster';
      let query = {EFT_NO : eftno};
      let option = {exact : true};
      WL.JSONStore.get(collectionName).find(query,option).then((res)=>{
        resolve(res);
      },(failure)=>{
        resolve("failure");
      });
    });
  }

  getVacantBerthCount(query:any, option:any){
    return new Promise(resolve=>{
      let collectionName = 'vacantberth';
      WL.JSONStore.get(collectionName).count(query,option).then((noOfDocs)=>{
        WL.Logger.info('total vacantberth count is...' + noOfDocs);
        resolve(noOfDocs);
      },(failure)=>{
        WL.Logger.error('vacantberth count not retrieved');
        resolve(failure);
      });
    });
  }

  getVacantBerth(query, options):any{
    return new Promise(resolve=>{
      let collectionName = 'vacantberth';
      WL.JSONStore.get(collectionName).find(query, options).then((berth)=>{
        resolve(berth);
      });
    });
  }

  addVacantBerth(data){
    return new Promise(resolve=>{
      let collectionName = 'vacantberth';
      let options = {
          addNew : true,
          markDirty : false
      };
        WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
          resolve(true);
        },(failure)=>{
          resolve(false);
        });
    });
  }

  appendVacantBerth(data){
    return new Promise(resolve=>{
      let collectionName = 'vacantberth';
      let options = {
          addNew : false,
          markDirty : true
      };
        WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
          resolve(true);
        },(failure)=>{
          resolve(false);
        });
    });
  }

  replaceVacantBerth(data){
    console.log('STORE BERTH REPLACE ' + data);
    return new Promise(resolve=>{
      let collectionName = 'vacantberth';
      WL.JSONStore.get(collectionName).replace(data,{markDirty : true}).then((success)=>{
        //alert(success + 'replaced'+JSON.stringify(data));
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  getPassengerCount(query:any, option:any){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      WL.JSONStore.get(collectionName).count(query,option).then((noOfDocs)=>{
        WL.Logger.info('total count is...' + noOfDocs);
        resolve(noOfDocs);
      },(failure)=>{
        WL.Logger.error('Count not retrieved');
        resolve(failure);
      });
    });
  }

  addPassengers(data){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      let options = {
        addNew : true,
        markDirty : false
      };
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  appendPassengers(data){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      let options = {
        addNew : false,
        markDirty : true
      };
      WL.JSONStore.get(collectionName).add(data,options).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

  replacePassenger(data){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      WL.JSONStore.get(collectionName).replace(data).then((success)=>{
        resolve(true);
      },(failure)=>{
        resolve(false);
      });
    });
  }

   findPassenger(data){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      let options={exact:true};
      WL.JSONStore.get(collectionName).find(data,options).then((success)=>{
        resolve(success);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getDirtyRecords(collectionName) {
    //alert('getDirtyRecords ' + collectionName);
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).getAllDirty().then((docs)=>{
        this.dirtyDocs = docs;
        console.log(JSON.stringify(this.dirtyDocs));
        resolve(docs);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getClasswiseWaitlistPassenger(classType){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().notEqual('WAITLIST_NO', 0);
      var queryPart2 = WL.JSONStore.QueryPart().equal('CLASS', classType).notEqual('WAITLIST_NO', 0);

      //CLASS : classType
      var option = {
        exact : true
      };
      //var queryPart = WL.JSONStore.QueryPart().notEqual('WAITLIST_NO', 0).equal('BERTH_NO', '-1');
      WL.JSONStore.get('passenger').advancedFind([queryPart2],option).then(res=>{
        console.log(classType);
        console.log(res); 
       resolve(res);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getConfirmedWaitlistPassenger(classType){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().equal('CLASS', classType).greaterThan('BERTH_INDEX', 0).greaterThan("WAITLIST_NO",0);//WL_NO 
      var option = {
        exact : true
      };
      WL.JSONStore.get('passenger').advancedFind([queryPart],option).then(res=>{
       resolve(res);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getNonConfirmedWaitlistPassenger(classType){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().equal('CLASS', classType).equal('BERTH_INDEX', -1);
      var option = {
        exact : true
      };
      WL.JSONStore.get('passenger').advancedFind([queryPart],option).then(res=>{
       resolve(res);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getWaitlistPassenger(collectionName){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().notEqual('WAITLIST_NO', 0);
      //var queryPart = WL.JSONStore.QueryPart().notEqual('WAITLIST_NO', 0).equal('BERTH_NO', '-1');
      WL.JSONStore.get('passenger').advancedFind([queryPart]).then(res=>{
       resolve(res);
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  getCount(collectionName){
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).count().then((noOfDocs)=>{
        WL.Logger.info('total count is...' + noOfDocs);
        resolve(noOfDocs);
      },(failure)=>{
        WL.Logger.error('Count not retrieved');
      });
    });
  }

  /*replaceDoc(doc ,options){
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      WL.JSONStore.get(collectionName).replace(doc,options).then((success)=>{
        WL.Logger.info('succesfully replaced');
        WL.Logger.info(success);
        WL.Analytics.log({"Passenger Data" : success},success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error(failure);
        resolve(false);
      });
    });
  }*/
 

  ///ADDED BY DEBONIL GHOSH
  getDocumentById(collectionName:string,id:number){
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).findById(id).then(function (arrayResults) {
       resolve(arrayResults[0]);
      }).fail(function (errorObject) {
          //handle failure
      });
    });
  }

updateAttendanceMarker(id:number,tu_nt:boolean,is_checked:boolean){
  console.log("updateAttendanceMarker called id=> "+id+"; tu_nt=> "+tu_nt+"; is_checked=>"+is_checked);
    return new Promise(resolve=>{
      let collectionName = 'passenger';
      var options = {
        markDirty: true
      };
      WL.JSONStore.get(collectionName).findById(id).then(function (arrayResults) {
        console.log("updateAttendanceMarker after getObj id=> "+id+"; tu_nt=> "+tu_nt+"; is_checked=>"+is_checked);
        // console.log(arrayResults);
        // console.log("id=>"+id);
        // console.log("ATTENDANCE_MARKER=>"+ATTENDANCE_MARKER);
        arrayResults[0].json.ATTENDANCE_MARKER=is_checked?(tu_nt?"P":"A"):"-";
        WL.JSONStore.get(collectionName).replace(arrayResults,options).then((success)=>{
          console.log("updateAttendanceMarker after replaced id=> "+id+"; tu_nt=> "+tu_nt+"; is_checked=>"+is_checked);
          // console.log(arrayResults[0]._id);
          // console.log("id=>"+arrayResults[0]._id);
          // console.log("ATTENDANCE_MARKER=>"+arrayResults[0].json.ATTENDANCE_MARKER);
          console.log(arrayResults);
          WL.Logger.info('succesfully replaced');
          WL.Logger.info(success);
          WL.Analytics.log({"Passenger Data" : success},success);
          console.log("updateAttendanceMarker before resolve id=> "+id+"; tu_nt=> "+tu_nt+"; is_checked=>"+is_checked);
          resolve(true);
        },(failure)=>{
          WL.Logger.error(failure);
          resolve(false);
        });
      })
      
      .fail(function (errorObject) {
          //handle failure
      });

      console.log("updateAttendanceMarker end id=> "+id+"; tu_nt=> "+tu_nt+"; is_checked=>"+is_checked);
    });
  }

  ////
///Not Used
  loadCoachwiseChartData() {
    return new Promise(resolve=>{
      // alert('stn : ' +JSON.stringify(this.STN_CODE));
      var coachwiseChartData = new Array();
      var query = [];
      var rows = [];
      
      query.push({
        //BOARDING_PT : this.FROM.STN_CODE,//'NDLS',
        COACH_ID    : 'C1'
      });
      //alert('--> QUERY ' + JSON.stringify(query));
      var options = {
        exact : true
      };
      // WL.JSONStore.get('Passenger').findAll().then( (res)=> {
        WL.JSONStore.get('passenger').find(query).then( (res)=> {
          //alert(res.length);
          if(res.length>0){
            res.forEach(element => {
              rows.push({
                BN              : element.json.BERTH_NO,
                QT              : element.json.PRIMARY_QUOTA,
                RS              : element.json.REL_POS,
                TU_NT           : element.json.ATTENDANCE_MARKER,
                PNR             : element.json.PNR_NO,
                NAME            : element.json.PSGN_NAME,
                S_A             : element.json.AGE_SEX,
                SRC             : element.json.JRNY_FROM,
                BRD             : element.json.BOARDING_PT,
                DEST            : element.json.JRNY_TO,
                TKT             : element.json.TICKET_TYPE,
                MEAL            : element.json.FOOD_FLAG,
                P_AMT           : element.json.PENDING_AMT,
                REMARKS         : element.json.REMARKS,
                COACH		        : element.json.COACH_ID, 
                CAB_CP_ID		    : element.json.CAB_CP_ID,
                CAB_CP			    : element.json.CAB_CP, 
                BERTH_INDEX	    : element.json.BERTH_INDEX,
                REMOTE_LOC_NO   : element.json.REMOTE_LOC_NO,
                CH_NUMBER		    : element.json.CH_NUMBER,
                SYSTIME		      : element.json.SYSTIME,
                VIP_MARKER      : element.json.VIP_MARKER,
                IS_CHECKED      : element.json.ATTENDANCE_MARKER=='A'?true:false
              });
            });
          }else{
            alert('THERE IS NO PASSENGERS FOR THIS BOARDING RANGE : ');
          }
          coachwiseChartData.push({key:"C1",value:rows});
          resolve(coachwiseChartData);
        }).fail(function(failure){
           alert('Fail to get passengers details : ' +failure);
           WL.Logger.error(failure);
            resolve('failure');
      });
    });
  }

  getStn_Code(){
    return new Promise(resolve=>{
        WL.JSONStore.get('isldtlTable').findAll().then((res)=>{
         var STN_CODE=[];
          res.forEach(element => {
            STN_CODE.push({
              STN_CODE    : element.json.STN_CODE,
              STN_SRL_NO  : element.json.STN_SRL_NO
            });
          });
          resolve(STN_CODE);
        },(failure)=>{
        WL.Logger.error(failure);
        resolve('failure');
      });
    });  
  }

  getISL(){
    return new Promise(resolve=>{
      let isl = [];
      WL.JSONStore.get('trainAssignment').findAll().then(res=>{
        resolve(res[0].json.ISL_ARR);
      });
    });
  }

  getAdvancedVacantBerth(src, dest){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().inside('SRC',src ).inside('DEST',dest ).equal('ALLOTED','N');
      WL.JSONStore.get('vacantberth').advancedFind([queryPart]).then(res=>{
        resolve(res);
      });
    });
  }

  getAdvancedVacantBerthInCoach(src, dest, coach){
    return new Promise(resolve=>{
      var queryPart = WL.JSONStore.QueryPart().inside('SRC',src ).inside('DEST',dest ).equal('ALLOTED','N').equal('COACH_ID',coach.trim());
      WL.JSONStore.get('vacantberth').advancedFind([queryPart]).then(res=>{
        resolve(res);
      });
    });
  }

  getAssignedCoaches(){
    return new Promise(resolve=>{
      WL.JSONStore.get('trainAssignment').findAll().then(res=>{
        resolve(res[0].json.ASSIGNED_COACHES);
      });
    });
  }

 /* 
  get_COACHES(){
   try{
     //alert('getcoaches');
     this.COACHES = new Array();
     WL.JSONStore.get('coachDetails').findAll().then( (res)=> {
        res.forEach(element => {
          this.COACHES.push({
             COACH_ID  : element.json.COACH_ID
          });
        });
         this.get_PSGN_COACHWISE();
     }).fail(function(error){
       alert('Erroe  @ get_COACHES  : ' +error);
     });
   }catch(ex){
     alert('EXCEPTION get_COACHES @ CHART PAGE : ' +DOMException);
   }
  }
 
/*  get_PSGN_COACHWISE(){
   console.log('--> get_PSGN_COACHWISE');
   this.coachwiseChartData = new Array();
   var query;
   this.rows = [];
   //console.log('COACHES : ' +JSON.stringify(this.COACHES));
   this.COACHES.forEach(element => {
     query = {
       COACH_id          : element.COACH_ID,
       ATTENDANCE_MARKER : 'P',
     };
     var options = {
         exact : true
       };
       WL.JSONStore.get('passenger').find(query,options).then( (res)=> {
         if(res.length > 0){
           res.forEach(element => {
             this.rows.push({
               BN              : element.json.BERTH_NO,
               QT              : element.json.PRIMARY_QUOTA,
               RS              : element.json.REL_POS,
               TU_NT           : element.json.ATTENDANCE_MARKER,
               PNR             : element.json.PNR_NO,
               NAME            : element.json.PSGN_NAME,
               S_A             : element.json.AGE_SEX,
               SRC             : element.json.JRNY_FROM,
               BRD             : element.json.BOARDING_PT,
               DEST            : element.json.JRNY_TO,
               TKT             : element.json.TICKET_TYPE,
               MEAL            : element.json.FOOD_FLAG,
               P_AMT           : element.json.PENDING_AMT,
               REMARKS         : element.json.REMARKS,
               COACH		        : element.json.COACH_ID, 
               CAB_CP_ID		    : element.json.CAB_CP_ID,
               CAB_CP			    : element.json.CAB_CP, 
               BERTH_INDEX	    : element.json.BERTH_INDEX,
               REMOTE_LOC_NO   : element.json.REMOTE_LOC_NO,
               CH_NUMBER		    : element.json.CH_NUMBER,
               SYSTIME		      : element.json.SYSTIME,
               VIP_MARKER      : element.json.VIP_MARKER       
             });
           });
           this.coachwiseChartData.push({
             key   : element.COACH_ID,
             value : this.rows
           });
           console.log('coachwiseChartData after : ' +JSON.stringify(this.coachwiseChartData));
         }
       }).fail(function(error){
         alert('Fail to get passengers details : ' +error);                                                                                              
       });
       /*this.coachwiseChartData.push({
         key   : element.COACH_ID,
         value : this.rows
       });
      // console.log('coachwiseChartData after : ' +JSON.stringify(this.coachwiseChartData));
   });
 } 
 

 
   cancelPsgnSearch(ev){
     var val = ev.target.value;
     //alert('--> cancelPsgnSearch : ' + val);
     this.listitems  = [];
   }
 
   getItems(ev) {
     // Reset items back to all of the items
     //this.initializeItems();
 
     // set val to the value of the ev target
     var val = ev.target.value;
     
     console.log('============== : '+val);
     if(val==undefined){
       this.listitems  = [];
     }else{
       if(val.length>=5){
        WL.JSONStore.get('passenger').find({PNR_NO : val}).then((res)=>{
           this.listitems = res;
           if(res.length==0){
             WL.JSONStore.get('passenger').find({PSGN_NAME : val}).then((res2)=>{
               this.listitems = res2;
             }).fail(()=>{
               alert('Fails to search passenger by name ');
             });
           }
         }).fail((f)=>{
           alert('Fails to find PNR ' + JSON.stringify(f));
         });
       }else{
         this.listitems  = [];
       }
     }
   }
 

   ///ADDED AGAIN BY DEBONIL GHOSH
   updateBatch(id) {
    try {
      alert('updateBatch ' + this.BATCH.PSGN.DOC.length + ' - ' + this.BATCH.BERTH.DOC.length + ' - ' + this.BATCH.WAITLIST.DOC.length);
      console.log('updateBatch ' + this.BATCH.PSGN.DOC.length + ' - ' + this.BATCH.BERTH.DOC.length + ' - ' + this.BATCH.WAITLIST.DOC.length);
      if (this.BATCH.PSGN.DOC.length == 0 && this.BATCH.BERTH.DOC.length == 0 && this.BATCH.WAITLIST.DOC.length == 0) {
        this.BATCH.sync = 1;
        if (this.PIPELINE == 1) {
          this.PIPELINE = 0;
          this.batchSync();
        } else {
          var resource = new WLResourceRequest('/adapters/HHTAdapter/getCurrenttime', WLResourceRequest.GET);
          resource.setQueryParameter('params', []);
          resource.send().then((success) => {
            if (success.errorCode == 200) {
              this.loadDifferentialData(success.responseJSON.MESSAGE, id);
            }
            if (success.errorCode == 500) {
              alert('NETWORK CONNECTION LOST');
              this.updateBatch(id);
            }
          }).fail((f) => {
            alert('getCurrenttime service fails : ' + JSON.stringify(f));
          });
        }
      }
    } catch (ex) {
      alert('Exception in updateBatch: ' + JSON.stringify(ex));
    }
  }

  pushPassengers() {
    try {
      console.log('-- > pushPassengers');
      WL.JSONStore.get('passenger').getAllDirty().then((dirtyDocs) => {
        this.BATCH.PSGN.DOC = dirtyDocs;
        var resource = new WLResourceRequest('/adapters/HHTAdapter/pushPassenger', WLResourceRequest.GET);
        resource.setQueryParameter('params', [dirtyDocs]);
        resource.send().then((res) => {
          console.log(' pushPassenger service response : ' + JSON.stringify(res));
          console.log(' pushPassengers errorCode : ' + res.errorMsg + '--' + res.errorCode);
          if (res.errorCode == 200) {
            console.log("res.responseJSON : " + JSON.stringify(res.responseJSON));
            console.log("PSGN PAYLOAD : " + JSON.stringify(this.PAYLOAD));
            if (!res.responseJSON.isSuccessful) {
              this.PAYLOAD.PSGN.DOC.push(res.responseJSON.PAYLOAD);
            }
            this.cleanCollections(1, dirtyDocs);
          }
          if (res.errorCode == 500)
            this.pushPassengers();
        }).fail((f) => {
          alert('Fail to send Passengers : ' + JSON.stringify(f));
        });
      });
    } catch (ex) {
      alert('Exception in pushPassengers : ' + ex);
    }
  }

  pushVacantberth() {
    try {
      console.log('-- > pushVacantberth');
      WL.JSONStore.get('Vacantberth').getAllDirty().then((dirtyDocs) => {
        this.BATCH.BERTH.DOC = dirtyDocs;
        var resource = new WLResourceRequest('/adapters/HHTAdapter/pushVacantberth', WLResourceRequest.GET);
        resource.setQueryParameter('params', [dirtyDocs]);
        resource.send().then((res) => {
          console.log(' pushVacantberth service response : ' + JSON.stringify(res));
          console.log(' pushVacantberth errorCode : ' + res.errorMsg + '--' + res.errorCode);
          if (res.errorCode == 200) {
            console.log("res.responseJSON : " + JSON.stringify(res.responseJSON));
            console.log("BERTH PAYLOAD : " + JSON.stringify(this.PAYLOAD));
            if (!res.responseJSON.isSuccessful) {
              this.PAYLOAD.BERTH.DOC.push(res.responseJSON.PAYLOAD);
            }
            this.cleanCollections(2, dirtyDocs);
          }
          if (res.errorCode == 500)
            this.pushVacantberth();
        }).fail((f) => {
          alert('Fail to send berths ' + JSON.stringify(f));
        });
      });
    } catch (ex) {
      alert('Exception in pushVacantberth : ' + ex);
    }
  }

  pushWaitlist() {
    try {
      console.log('-- > pushWaitlist');
      WL.JSONStore.get('Waitlist').getAllDirty().then((dirtyDocs) => {
        this.BATCH.WAITLIST.DOC = dirtyDocs;
        var resource = new WLResourceRequest('/adapters/HHTAdapter/pushWaitlist', WLResourceRequest.GET);
        resource.setQueryParameter('params', [dirtyDocs]);
        resource.send().then((res) => {
          console.log(' pushWaitlist service response : ' + JSON.stringify(res));
          console.log(' pushWaitlist errorCode : ' + res.errorMsg + '--' + res.errorCode);
          if (res.errorCode == 200) {
            console.log("res.responseJSON : " + JSON.stringify(res.responseJSON));
            console.log("WAITLIST PAYLOAD : " + JSON.stringify(this.PAYLOAD));
            if (!res.responseJSON.isSuccessful) {
              this.PAYLOAD.WAITLIST.DOC.push(res.responseJSON.PAYLOAD);
            }
            this.cleanCollections(3, dirtyDocs)
          }
          if (res.errorCode == 500)
            this.pushWaitlist();
        }).fail((f) => {
          alert('Fail to send waitlist ' + JSON.stringify(f));
        });
      });
    } catch (ex) {
      alert('Exception in pushWaitlist : ' + ex);
    }
  }

  cleanCollections(id, dirtyDocs) {
    try {
      console.log('-- > cleanCollections ' + id);
      if (id == 1) {
        WL.JSONStore.get('Passenger').markClean(dirtyDocs).then((res) => {
          this.BATCH.PSGN.DOC = [];
          this.updateBatch(1);
        }).fail((f) => {
          alert('Fails to clean Passenger ' + JSON.stringify(f));
        });
      }
      if (id == 2) {
        WL.JSONStore.get('Vacantberth').markClean(dirtyDocs).then((res) => {
          this.BATCH.BERTH.DOC = [];
          this.updateBatch(2);
        }).fail((f) => {
          alert('Fails to clean Vacantberth ' + JSON.stringify(f));
        });
      }
      if (id == 3) {
        WL.JSONStore.get('Waitlist').markClean(dirtyDocs).then((res) => {
          this.BATCH.WAITLIST.DOC = [];
          this.updateBatch(3);
        }).fail((f) => {
          alert('Fails to aclean Waitlist ' + JSON.stringify(f));
        });
      }
    } catch (ex) {
      alert(id + ' Exception in cleanCollections : ' + ex);
    }
  }

  loadDifferentialData(serverTime, id) {
    try {
      alert('loadDifferentialData ' + serverTime);
      console.log('--> loadDifferentialData ' + id);
      WL.JSONStore.get('Stage').findAll().then((res) => {
        this.STAGE = res[0];
        if (this.STAGE.json.DIFFERENTIAL_STAGE[0] == 0) {
          if (id == 1)
            this.loadDifferentialPassengers(this.STAGE.json.LOAD_TIME, serverTime);
        } else {
          if (this.STAGE.json.DIFFERENTIAL_STAGE[1] == 0) {
            if (id == 2)
              this.loadDifferentialVacantberths(this.STAGE.json.LOAD_TIME, serverTime);
          } else {
            if (this.STAGE.json.DIFFERENTIAL_STAGE[2] == 0) {
              if (id == 3)
                this.loadDifferentialWaitlist(this.STAGE.json.LOAD_TIME, serverTime);
            } else {
              if (this.STAGE.json.DIFFERENTIAL_STAGE[0] == 1 && this.STAGE.json.DIFFERENTIAL_STAGE[1] == 1 && this.STAGE.json.DIFFERENTIAL_STAGE[2] == 1)
                alert('Differential sync completes now update Loadtime in the stage as ' + serverTime);
            }
          }
        }
      });
    } catch (ex) {
      alert('EXCEPTION IN loadDifferentialData : ' + JSON.stringify(ex));
    }
  }

  loadDifferentialPassengers(loadTime, serverTime) {
    try {
      console.log('--> loadDifferentialPassengers between ' + loadTime + ' and ' + serverTime);
      var resource = new WLResourceRequest('/adapters/HHTAdapter/getDifferentialPassengers', WLResourceRequest.GET);
      resource.setQueryParameter('params', [this.STAGE.json.TRAIN.TRAIN_ID, loadTime, serverTime]);
      resource.send().then((res) => {
        if (res.errorCode == 200) {
          if (res.responseJSON.isSuccessful) {
            this.STAGE.json.DIFFERENTIAL_STAGE[0] = 1;
            WL.JSONStore.get('Passenger').add(res.responseJSON.resultSet, { markDirty: false }).then(() => {
              this.updateDifferentialStage(1, serverTime);
            });
          }
          else {
            alert('loadDifferentialPassengers Fails : ' + res.responseJSON.MESSAGE + ' add it to payload');
          }
        }
        if (res.errorCode == 500) {
          alert('NETWORK CONNECTION LOST');
          this.loadDifferentialPassengers(loadTime, serverTime);
        }
      }).fail((f) => {
        alert('getDifferentialPassengers Service fails ' + JSON.stringify(f));
      });
    } catch (ex) {
      alert('Exception in loadDifferentialPassengers ' + JSON.stringify(ex));
    }
  }

  loadDifferentialVacantberths(loadTime, serverTime) {
    try {
      console.log('--> loadDifferentialVacantberths between ' + loadTime + ' and ' + serverTime);
      var resource = new WLResourceRequest('/adapters/HHTAdapter/getDifferentialVacantberth', WLResourceRequest.GET);
      resource.setQueryParameter('params', [this.STAGE.json.TRAIN.TRAIN_ID, loadTime, serverTime]);
      resource.send().then((success) => {
        if (success.errorCode == 200) {
          if (success.responseJSON.isSuccessful) {
            this.STAGE.json.DIFFERENTIAL_STAGE[1] = 1;
            WL.JSONStore.get('Vacantberth').add(success.responseJSON.resultSet, { markDirty: false }).then(() => {
              this.updateDifferentialStage(2, serverTime);
            });
          } else {
            alert('loadDifferentialVacantberths Fails : ' + success.responseJSON.MESSAGE + ' add it to payload');
          }
        }
        if (success.errorCode == 500) {
          alert('NETWORK CONNECTION LOST');
          this.loadDifferentialVacantberths(loadTime, serverTime);
        }
      }).fail((f) => {
        alert('getDifferentialVacantberth service fails : ' + JSON.stringify(f));
      });
    } catch (ex) {
      alert('Exception in loadDifferentialVacantberths ' + JSON.stringify(ex));
    }
  }

  loadDifferentialWaitlist(loadTime, serverTime) {
    try {
      console.log('--> loadDifferentialWaitlist between ' + loadTime + ' and ' + serverTime);
      var resource = new WLResourceRequest('/adapters/HHTAdapter/getDifferentialWaitlist', WLResourceRequest.GET);
      resource.setQueryParameter('params', [this.STAGE.json.TRAIN.TRAIN_ID, loadTime, serverTime]);
      resource.send().then((success) => {
        if (success.errorCode == 200) {
          if (success.responseJSON.isSuccessful) {
            this.STAGE.json.DIFFERENTIAL_STAGE[2] = 1;
            WL.JSONStore.get('Waitlist').add(success.responseJSON.resultSet, { markDirty: false }).then(() => {
              this.updateDifferentialStage(3, serverTime);
            });
          } else {
            alert('loadDifferentialWaitlist Fails : ' + success.responseJSON.MESSAGE + ' add it to payload');
          }
        }
        if (success.errorCode == 500) {
          alert('NETWORK CONNECTION LOST');
          this.loadDifferentialWaitlist(loadTime, serverTime);
        }
      }).fail((f) => {
        alert('getDifferentialWaitlist service fails : ' + JSON.stringify(f));
      });
    } catch (ex) {
      alert('Exception in loadDifferentialWaitlist ' + JSON.stringify(ex));
    }
  }

  updateDifferentialStage(index, serverTime) {
    try {
      console.log('--> updateDifferentialStage ' + index);
      this.STAGE.json.DIFFERENTIAL_STAGE[index - 1] = 1;
      WL.JSONStore.get('Stage').replace(this.STAGE).then((res) => {
        if (this.STAGE.json.DIFFERENTIAL_STAGE[0] == 1 && this.STAGE.json.DIFFERENTIAL_STAGE[1] == 1 && this.STAGE.json.DIFFERENTIAL_STAGE[2] == 1) {
          this.resetDifferentialStage();
          alert('got total differential data ');
        } else {
          this.loadDifferentialData(index, serverTime);
        }
      }).fail((f) => {
        alert('updateDifferentialStage fails ' + JSON.stringify(f));
      });
    } catch (ex) {
      alert('Exception in updateDifferentialStage: ' + JSON.stringify(ex));
    }
  }

  resetDifferentialStage() {
    try {
      console.log('--> resetDifferentialStage');
      this.STAGE.json.DIFFERENTIAL_STAGE[0] = 0;
      this.STAGE.json.DIFFERENTIAL_STAGE[1] = 0;
      this.STAGE.json.DIFFERENTIAL_STAGE[2] = 0;

      //this.STAGE.json.LOAD_TIME = servertime;
      WL.JSONStore.get('stage').replace(this.STAGE).then((res) => {
        alert('now update');
      });
    } catch (ex) {
      alert('Exception in resetDifferentialStage: ' + JSON.stringify(ex));
    }
  }

  cleanPassengers(dirtyDocs) {
    try {
      WL.JSONStore.get('Passenger').markClean(dirtyDocs).then((res) => {
        this.BATCH.PSGN.DOC = [];
        this.updateBatch(1);
      }).fail((f) => {
        alert('Fail to clean Passenger collection ' + JSON.stringify(f));
      });
    } catch (ex) {
      alert('Exception in cleanPassengers : ' + ex);
    }
  }
 */
}
