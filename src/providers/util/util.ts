import { Injectable } from '@angular/core';


/*
  Generated class for the UtilProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilProvider {

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

}
