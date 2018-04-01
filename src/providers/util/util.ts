import { Injectable } from '@angular/core';


/*
  Generated class for the UtilProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilProvider {
 appVer= "2.1.0";
 releaseDate="08-02-2018";
  constructor() {
    
  }
  compareCoachId(a,b){
    // var cna=Number(a.json.COACH_ID.substring(1,a.json.COACH_ID.length));
    // var cnb=Number(b.json.COACH_ID.substring(1,b.json.COACH_ID.length));
    // var cca=Number(a.json.COACH_ID.substring(1,a.json.COACH_ID.length));
    // var ccb=Number(b.json.COACH_ID.substring(1,b.json.COACH_ID.length));
    var cna= parseInt(a.replace(/[^0-9\.]/g, ''), 10);
    var cnb= parseInt(b.replace(/[^0-9\.]/g, ''), 10);
    var cca=  parseInt(a.replace(/[^A-Z\.]/g, ''), 10);
    var ccb= parseInt(b.replace(/[^A-Z\.]/g, ''), 10);
   


    if (cca < ccb)
    return -1;
  if (cca > ccb)
    return 1;
    if (cna < cnb)
      return -1;
    if (cna > cnb)
      return 1;
    if(cna == cnb)
      return 0;

  } 

  /* Data conversion utility */
  convertIntoJson(response) : any {
      let string_data = JSON.stringify(response);
      let responseData = JSON.parse(string_data);
      let data  = JSON.parse(responseData);
      return data;
  }

  /* Date conversion utility for sync*/
  chartLoadDateConversion(date) {
    let now = date;
    let year = "" + now.getFullYear();
    let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

/* Date conversion utility for sync*/
js_yyyy_mm_dd_hh_mm_ss (date) {
  let now = date;
  let year = "" + now.getFullYear();
  let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + "-" + hour + "." + minute + "." + second;
}

getCurrentDateString(){
  var date = new Date();
  var dd = '' + date.getDate();
    if(dd.length<2){
      dd = '0' + dd;
    }
    var mm = '' + (date.getMonth()+1);
    if(mm.length<2){
      mm = '0' + mm;
    }
    var yyyy = date.getFullYear();
    var hh = '' + date.getHours();
    if(hh.length<2){
      hh = '0' + hh;
    }
    var mi = '' + date.getMinutes();
    if(mi.length<2){
      mi = '0' + mi;
    }
    var ss = '' + date.getSeconds();
    if(ss.length<2){
      ss = '0' + ss;
    }
    return yyyy + '-' + mm + '-' + dd +' ' + hh + ':' + mi + ':' + ss + '.' + (new Date()).getMilliseconds();
}

getAppVersion(){
  return this.appVer;
}
getReleaseDate(){
  return this.releaseDate;
}

getClassObject(coachId, classArray){
  var obj = classArray.find(res=>{
    if(res.COACH_ID==coachId){
      return res;
    }
  });
  return obj;
}

}
