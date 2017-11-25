/*
 *  Licensed Materials - Property of Centre for railway information systems
 *  @Author Ashutosh
 */ 
import {Logs} from '../../entities/messages';
import { Injectable } from '@angular/core';
declare var WL;

// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
@Injectable()

/* User defined logging methods , which can be injected anywhere*/ 
export class LoggerProvider {

  constructor() {
    //WL.logger.info(Logs.logger_init);
  }

  logInfoLogs(message) {
    //WL.Logger.info(message);
  }

   logErrorLogs(message) {
    //WL.Logger.error(message);
  }

   logDebugLogs(message) {
    //WL.Logger.debug(message);
  }

  logAnalytics(type,message) {
    //WL.Analytics.log({type : message},message);
  }

}
