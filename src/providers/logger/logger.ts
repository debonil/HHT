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
  logger;
  analyticsLogger;

  constructor() {
    //WL.logger.info(Logs.logger_init);
    
  }

  createLogger(packageName){
    this.logger = WL.Logger.create({pkg: packageName});
    //this.analyticsLogger = WL.Analytics.create({pkg: packageName});
  }

  logInfoLogs(message) {
    /* WL.Logger.info(message); */
    this.logger.info(message);
  }

  logDebugLogs(message) {
   /*  WL.Logger.debug(message); */
   this.logger.debug(message);
  }

  logTraceLogs(message) {
    /* WL.Logger.trace(message); */
    this.logger.trace(message);
  }

  logWarnLogs(message) {
    /* WL.Logger.warn(message); */
    this.logger.warn(message);
  }

  logConsoleLogs(message) {
    console.log(message);
  }

  logFatalLogs(message) {
    /* WL.Logger.fatal(message); */
    this.logger.fatal(message);
  }

  logErrorLogs(message) {
    /* WL.Logger.error(message); */
    this.logger.error(message);
  }

  logAnalytics(type,message) {
    WL.Analytics.log({type : message},message);
  }

  sendLog(){
    this.logger.send();
  }

}
