import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
declare var WL;
/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageServiceProvider {

  constructor(public http: Http) {
    console.log('Hello StorageServiceProvider Provider');
  }
  get(collectionName,query, options){
    
      collectionName = 'passenger';
       return WL.JSONStore.get(collectionName).find(query, options).then(function (res) {
         // handle success - results (array of documents found)
       }).fail(function (errorObject) {
         // handle failure
       });
     
  }
  countPassengers(){
    var collectionName = 'passenger';   
    var query='';
    var options=[];      
   return  WL.JSONStore.get(collectionName).count(query, options).then(function (res) {
                console.log(res);
              }).fail(function (errorObject) {
                // handle failure
              });
}
}
