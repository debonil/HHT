import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChartBerthPassengerDetail } from "../../model/ChartBerthPassengerDetail";
declare var WL;
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
  filterStatus: string="0";
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
  constructor() {
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
      WL.JSONStore.get('trainAssignment').findAll().then(success=>{
        if(success.length !== 0){
          this.allPassengerChartDataObj.trainAssignmentObj=success[0].json;
        }else{
          alert("Error in getting Train Assignment from storage!!");
        }
      });
       // WL.JSONStore.get('Passenger').findAll().then( (res)=> {
         WL.JSONStore.get('passenger').findAll().then( (res)=> {
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
               this.allPassengerChartDataObj.coachwiseChartData.push({ key: rowskey, value: rowsvalue });
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
         }).fail(function(error){
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

}
