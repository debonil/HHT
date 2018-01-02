import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the EftServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EftServiceProvider {
  private eftObject:any = {
    assignedCoach : [],
    vacantBerth : [],
    isl : [],
    eftList : [],
    isEmpty : true 
  };
  eftListObserver : any;
  constructor(public http: Http) {
    console.log('Hello EftServiceProvider Provider');
  }

}
