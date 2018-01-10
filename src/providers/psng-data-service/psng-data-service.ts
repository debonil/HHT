import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChartBerthPassengerDetail } from "../../model/ChartBerthPassengerDetail";
//import { StorageProvider } from '../storage/storage';
import { StorageServiceProvider } from '../storage-service/storage-service';
//declare var WL;
/*
  Generated class for the PsngDataServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PsngDataServiceProvider {
  //Filter Data
  selectedBoardingPoints: Array<string>;
  showNotCheckedOnly: boolean;
  filterStatus: string="-1";
  //
  private allPassengerChartDataObj: any ={
    trainAssignmentObj : {},
    coachwiseChartData:Array<any>() ,
    coachwiseChartDataMap:[],
    allPassengerChartData:[],
    empty:true,
  };
  private loadingCoachwiseChartData:  boolean ;
  // private hardRefreshCoachwiseChartData:  boolean ;
  private coachwiseChartDataObservable:  Observable<any> ;
  private observer: any;
  private startTime: number;
  constructor(private storage: StorageServiceProvider,) {
    console.log('Hello PsngDataServiceProvider Provider');
    this.coachwiseChartDataObservable= Observable.create(observer => {
      this.observer=observer;
      if (this.allPassengerChartDataObj.empty){
        this.loadCoachwiseChartData("constructor");
      }else{
        observer.next(this.allPassengerChartDataObj);
        console.info("Psng resolved in " +(new Date().getTime()-this.startTime)/1000);
        observer.complete();
      }
      //observer.next(this.coachwiseChartData);
     // observer.complete();
    });
  }
  clearAllData(){
    this.allPassengerChartDataObj.empty=true;

    this.allPassengerChartDataObj.trainAssignmentObj = {};
    this.allPassengerChartDataObj.coachwiseChartData=Array<any>() ;
    this.allPassengerChartDataObj.coachwiseChartDataMap=[];
    this.allPassengerChartDataObj.allPassengerChartData=[];
  }
  public findAll(hardLoad?: boolean): Observable<any> {
    this.startTime=new Date().getTime();
    console.log("findAll fired!");
    console.log(this.allPassengerChartDataObj);
    console.log(hardLoad);
    //this.hardRefreshCoachwiseChartData=hardLoad;
    if(hardLoad)
    this.allPassengerChartDataObj.empty=true;
    // if (hardLoad || !this.coachwiseChartData) {
    //   //this.loadData();
    //   this.loadCoachwiseChartData("findAll");
    // }
    return this.coachwiseChartDataObservable;
  }
  private loadCoachwiseChartData(caller:string): void {
    
    console.log("loadCoachwiseChartData CALLED by ==>"+caller);
    if(!this.loadingCoachwiseChartData){
      console.log("loadCoachwiseChartData data  hard loading!!");
      this.loadingCoachwiseChartData=true;
    try{
      this.storage.getDocuments(
        this.storage.collectionName.TRAIN_ASSNGMNT_TABLE
       ).then(success=>{
        if(success.length !== 0){
          this.allPassengerChartDataObj.trainAssignmentObj=success[0].json;
        }else{
          alert("Error in getting Train Assignment from storage!!");
        }
      });
       // WL.JSONStore.get('Passenger').findAll().then( (res)=> {
         this.storage.getDocuments(
          this.storage.collectionName.PASSENGER_TABLE
         ).then( (res)=> {
           //console.log(res.length);
          // console.log(rows);
           if(res.length>0){
             res.sort(function (a,b) {
                 //console.log(this.util);
                 var cca=  a.json.COACH_ID.replace(/[^A-Z\.]/g, '');
                 var ccb= b.json.COACH_ID.replace(/[^A-Z\.]/g, '');
                 if (cca < ccb)
                 return -1;
               if (cca > ccb)
                 return 1;

                 var cna= parseInt(a.json.COACH_ID.replace(/[^0-9\.]/g, ''), 10);
                 var cnb= parseInt(b.json.COACH_ID.replace(/[^0-9\.]/g, ''), 10);
                 if (cna < cnb)
                   return -1;
                 if (cna > cnb)
                   return 1;
               if (Number(a.json.BERTH_NO) < Number(b.json.BERTH_NO))
                 return -1;
               if (Number(a.json.BERTH_NO )> Number(b.json.BERTH_NO))
                 return 1;
                return 0;
             });
             this.allPassengerChartDataObj.allPassengerChartData=res.map(this.convertToViewablePsng);

             this.allPassengerChartDataObj.coachwiseChartDataMap=this.allPassengerChartDataObj.allPassengerChartData.reduce((rows,element) => {
              var psngArrOfCoach=rows[element.COACH];
              if(psngArrOfCoach!=null&&psngArrOfCoach!=undefined){
                rows[element.COACH].push((element));
              }else{
                rows[element.COACH]=[(element)];
              }
              return rows;
            },[]);
             console.log(this.allPassengerChartDataObj.coachwiseChartDataMap);
             this.allPassengerChartDataObj.coachwiseChartData= new Array();
             for (let rowskey in this.allPassengerChartDataObj.coachwiseChartDataMap) {
               let rowsvalue = this.allPassengerChartDataObj.coachwiseChartDataMap[rowskey];
               this.allPassengerChartDataObj.coachwiseChartData.push(
                  { 
                    key: rowskey, 
                    value: rowsvalue ,
                    readOnly : this.allPassengerChartDataObj.trainAssignmentObj.ASSIGNED_COACHES.indexOf(rowskey) == -1,
                  }
                );
               //this.observer.next(this.coachwiseChartData);
             }
             this.observer.next(this.allPassengerChartDataObj);
             //this.coachwiseChartData= new Array();
           }else{
             console.log('THERE IS NO PASSENGERS FOR THIS BOARDING RANGE : ');
           }
           console.info("Psng resolved in " +(new Date().getTime()-this.startTime)/1000);
           this.observer.complete();
           this.loadingCoachwiseChartData=false;

          this.allPassengerChartDataObj.empty=false;
         }).catch(function(error){
         console.log('Fail to get passengers details : ' +error);
       });
       
       //this.coachwiseChartData.push({key:" ",value:[]});
       console.log(this.allPassengerChartDataObj);
   }catch(ex){
      console.log('EXCEPTION loadCoachwiseChartData : '+ex);
    }
  }
  }
  addPsngBerth(psng:any){
    if(!psng["json"])psng["json"]=psng;
    let cvtdPsng=this.convertToViewablePsng(psng);
    this.allPassengerChartDataObj.allPassengerChartData.push(cvtdPsng);
    var arr=this.allPassengerChartDataObj.coachwiseChartDataMap[cvtdPsng.COACH]
    arr.some((ele,i )=> {
      if(ele.BN>cvtdPsng.BN){
        arr.splice(i,0,cvtdPsng);
        return true;
      }
    });
    //.push(cvtdPsng);
    //this.allPassengerChartDataObj.allPassengerChartData.push(cvtdPsng);
  }
  convertToViewablePsng(element:any) :any{
      return   new ChartBerthPassengerDetail(element);

  }


  savePsngBerthDataLocally() {
    return new Promise(resolve=>{
    //this.showLoader("Saving data... ");
    let psngObjArr = [] ;
    let vbObjArr = [] ;
    let response = {success:false,msg:""} ;
    this.allPassengerChartDataObj.coachwiseChartData.forEach((coachpsngbrth, ind1) => {
      coachpsngbrth.value.forEach((psngbrth, ind2) => {
        if (!psngbrth._isLocked && psngbrth._status > 0) {
          psngbrth._isLocked = true;
          psngObjArr.push(psngbrth);
          if (psngbrth._status == 2&&psngbrth.QT!='RC')
            vbObjArr.push(this.convertPsngToVBerth(psngbrth));
        }
      });
    });
    this.storage.replace(this.storage.collectionName.PASSENGER_TABLE,psngObjArr.map(p => p.dbObj)).then(success => {
      /* this.loading.dismiss();
      this.alertToast("Data saved successfully!!"); */
      //this.modal_Close();
      this.storage.add(this.storage.collectionName.VACANT_BERTH_TABLE,vbObjArr).then((success) => {
        if (success) {
          //this.alertToast("Generated vacant berths!!");
          response.success=true;
          resolve(response);
        } else {
          response.success=false;
          response.msg=JSON.stringify(success);
          resolve(response);
          //this.alertToast("Data Saved Failed!!" + JSON.stringify(success));
        }
      });
    });
    
  });
  }


  private convertPsngToVBerth(psngbrth) {
    return {
      TRAIN_ID: psngbrth.TRAIN_ID,
      COACH_ID: psngbrth.COACH,
      BERTH_NO: psngbrth.BN,
      CLASS: psngbrth.CLASS,
      REMOTE_LOC_NO: psngbrth.REMOTE_LOC_NO,
      BERTH_INDEX: psngbrth.BERTH_INDEX,
      SRC: psngbrth.BRD,
      DEST: psngbrth.DEST,
      ALLOTED: "N",
      REASON: "V",
      CAB_CP: psngbrth.CAB_CP,
      CAB_CP_ID: psngbrth.CAB_CP_ID,
      CH_NUMBER: psngbrth.CH_NUMBER,
      PRIMARY_QUOTA: psngbrth.QT,
      SUB_QUOTA: psngbrth.SUB_QUOTA,
      SYSTIME: psngbrth.SYSTIME,
    };
  }
  get trainAssignmentObject(){
    return this.allPassengerChartDataObj.trainAssignmentObj
  }
  set trainAssignmentObject(trainAssignmentObj:any){
    this.allPassengerChartDataObj.trainAssignmentObj=trainAssignmentObj;
  }
}
