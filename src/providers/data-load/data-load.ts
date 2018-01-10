import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
//import { StorageProvider } from '../../providers/storage/storage';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import { LoggerProvider } from '../../providers/logger/logger';
import { Logs } from '../../entities/messages';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the DataLoadProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataLoadProvider {
  private trainAssignment : any;
  //private pogressObject : any;
  private savedChartCoachList : Array<any>;
  private savedVacantberthList : Array<any>;
  private progressval : number=0;
  private loadTime : any;
  private trainId : any;
  private loader : any;
  private coachArray : Array<any>;

  constructor(
    //private storageProvider:StorageProvider, 
    private backendProvider:BackendProvider, 
    private loggerProvider:LoggerProvider, private utilProvider:UtilProvider,
    private loadingController:LoadingController) {
    console.log('Hello DataLoadProvider Provider');
  }
 

}
