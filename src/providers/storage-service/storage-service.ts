import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
declare var WL;
/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageServiceProvider {
  public collectionConfig = {
    trainAssignment :{},
    droptEticketPassenger : {
      searchFields    : {TRAIN_ID : 'integer',REMOTE_LOC_NO : 'integer',PNR_NO : 'string', REL_POS : 'integer'}
    },
    dynamicFare : {
      searchFields    : {TRAIN_ID : 'integer', FROM_STN : 'string', TO_STN : 'string'}
    },
    ///Dirty-OP added to below tables only
    eftMaster : {
      searchFields    : { EFT_NO : 'string',TRAIN_ID : 'integer', _op : 'integer'}
    },
    vacantberth : {
      searchFields : { TRAIN_ID : 'integer',COACH_ID : 'string',BERTH_NO : 'string',CLASS : 'string',
                       REMOTE_LOC_NO : 'string',BERTH_INDEX : 'string', DEST : 'string', 
                       SRC : 'string',ALLOTED : 'string',REASON : 'string', _op : 'integer'}
    },
    passenger : {
      searchFields : {TRAIN_ID : 'integer', COACH_ID : 'string', BOARDING_PT : 'string', BERTH_INDEX : 'integer',
                      PSGN_NAME : 'string', PNR_NO : 'string',ATTENDANCE_MARKER : 'string', JRNY_FROM : 'string', 
                      JRNY_TO : 'string',VIP_MARKER : 'string', TICKET_TYPE : 'string', REL_POS : 'integer',
                      REMARKS : 'string',RES_UPTO : 'string',BERTH_NO :'string', PRIMARY_QUOTA : 'string', 
                      CANCEL_PASS_FLAG : 'string', WAITLIST_NO : 'string', CLASS : 'string', _op : 'integer'}
    }
  };
  public collectionName={
    PASSENGER_TABLE:'passenger',
    TRAIN_ASSNGMNT_TABLE:'trainAssignment',
    VACANT_BERTH_TABLE:'vacantberth',
    EFT_MASTER_TABLE:'eftMaster',
    DROP_ETCKT_PSNG_TABLE:'droptEticketPassenger',
    DYNAMIC_FARE_TABLE:'dynamicFare',
  };
  public operationCode={
    UN_MODIFIED:0,
    ADD:1,
    REPLACE:2,
  };

  constructor() {
    console.log('Hello StorageServiceProvider Provider');
  }
  
  init(){
    console.log('--> StorageProvider init called');
    return new Promise(resolve=>{
      WL.JSONStore.init(this.collectionConfig).then((success)=>{
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
    /* return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).markClean(dirtyDocs).then((docs)=>{
        WL.Logger.info('clensed records' + docs);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('could not cleanse');
        resolve(false);
      });
    }); */
    return new Promise(resolve=>{
      
      dirtyDocs.forEach(function(element) {
        if(element)element.json._op=this.operationCode.UN_MODIFIED;
      });
      this.replace(collectionName,dirtyDocs,false).then((docs)=>{
        WL.Logger.info('clensed records' + docs);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('could not cleanse');
        resolve(false);
      });
    });

  }

  add(collectionName:string,dataToSave:any,markClean?:boolean){
    return new Promise(resolve=>{
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          markDirty : markClean?markClean:false
      };
      //this.clear(collectionName);
      if(options.markDirty){
        dataToSave.forEach(function(element) {
          if(element)element._op=this.operationCode.ADD;
        });
      }
      WL.JSONStore.get(collectionName).add(dataToSave,options).then((success)=>{
        WL.Logger.info('added ' +collectionName+' ' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('add failed for ' +collectionName);
        resolve(false);
      });
    });
  }

  replace(collectionName:string,dataToSave:any,markClean?:boolean){
    return new Promise(resolve=>{
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          markDirty : markClean?markClean:false
      };
      //this.clear(collectionName);
      if(options.markDirty){
        dataToSave.forEach(function(element) {
          if(element)element.json._op=this.operationCode.REPLACE;
        });
      }
      WL.JSONStore.get(collectionName).add(dataToSave,options).then((success)=>{
        WL.Logger.info('added ' +collectionName+' ' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('add failed for ' +collectionName);
        resolve(false);
      });
    });
  }

  addOrReplace(collectionName:string,dataToSave:any,markClean?:boolean){
    return new Promise(resolve=>{
      /**
       * What is the impact of addNew : true in add API
       */
      let options = {
          addNew : true,
          markDirty : markClean?markClean:false
      };
      //this.clear(collectionName);
      if(options.markDirty){
        dataToSave.forEach(function(element) {
          if(element){
            if(!element.json)
            element.json._op=this.operationCode.REPLACE;
          }
        });
      }
      WL.JSONStore.get(collectionName).add(dataToSave,options).then((success)=>{
        WL.Logger.info('added ' +collectionName+' ' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('add failed for ' +collectionName);
        resolve(false);
      });
    });
  }
  
  getDocumentAll(collectionName:string){
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).findAll().then(success=>{
        resolve(success);
      });
    });
  }

  getDocumentCount(collectionName:string){
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).count().then((cnt)=>{
        resolve(cnt);
      },(failure)=>{
        resolve(-1);
      });
    });
  }
}
