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

  

  // Optional options object to init.
private collectionConfigInitOption = {

  // Optional username, default 'jsonstore'.
  username : 'hhtdbstore',

  // Optional password, default no password.
  password : 'hhtdbstore123',

  // Optional local key generation flag, default false.
  localKeyGen : false
};
  public collectionName={
    PASSENGER_TABLE:'passenger',
    TRAIN_ASSNGMNT_TABLE:'trainAssignment',
    VACANT_BERTH_TABLE:'vacantberth',
    EFT_MASTER_TABLE:'eftMaster',
    DROP_ETCKT_PSNG_TABLE:'droptEticketPassenger',
    DYNAMIC_FARE_TABLE:'dynamicFare',
  };
  private collectionConfig = {
    trainAssignment :{},
    droptEticketPassenger : {
      searchFields    : {TRAIN_ID : 'integer',REMOTE_LOC_NO : 'integer',PNR_NO : 'string', REL_POS : 'integer', _op : 'integer'}
    },
    dynamicFare : {
      searchFields    : {TRAIN_ID : 'integer', FROM_STN : 'string', TO_STN : 'string', _op : 'integer'}
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
  public operationCode={
    UN_MODIFIED:0,
    ADD:1,
    REPLACE:2,
  };

  constructor() {
    console.log('Hello StorageServiceProvider Provider');
  }
  
  init():Promise<boolean>{
    console.log('--> StorageProvider init called');
    return new Promise(resolve=>{
      if(WL.JSONStore){
        WL.JSONStore.init(this.collectionConfig,this.collectionConfigInitOption).then((success)=>{
          WL.Logger.info("JSONStore initialised");
          resolve(true);
        },(failure)=>{
          WL.Logger.error("Failed to initialise JSONStore");
          resolve(false);
        });
      }else{
        WL.Logger.error("Failed to initialise JSONStore");
        resolve(false);
      }
    });
  }

  clear(collectionName:string):Promise<boolean>{
    //alert('clear ' + collectionName);
    return new Promise(resolve=>{
      WL.JSONStore.get(collectionName).clear().then((success) =>{
        WL.Logger.info(collectionName+' data cleared succesfully');
        resolve(true);
      },(failure) =>{
        WL.Logger.error(collectionName+' data could not be cleared ...');
        resolve(false);
      });
    });
  }
  clearAll():Promise<boolean[]>{
    let promiseArr:Array<Promise<boolean>>=[];
    for(let key in this.collectionName){
      let collectionName=this.collectionName[key];
      promiseArr.push(this.clear(collectionName)
      );
    }
    return Promise.all(promiseArr);
  }

  markClean(collectionName, dirtyDocs):Promise<boolean>{
    //return WL.JSONStore.get(collectionName).markClean(dirtyDocs);
    return new Promise(resolve=>{
      
      for (let i = 0, len = dirtyDocs.length; i < len; i++) {
        if(dirtyDocs[i]&&dirtyDocs[i].json)dirtyDocs[i].json._op=this.operationCode.UN_MODIFIED;
        else if(dirtyDocs[i])dirtyDocs[i]._op=this.operationCode.UN_MODIFIED;
      }
      this.replace(collectionName,dirtyDocs,true).then((docs)=>{
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
      if(!(dataToSave instanceof Array))
      dataToSave=[dataToSave];
      let options = {
          markDirty : markClean?(!markClean):true
      };

        for (let i = 0, len = dataToSave.length; i < len; i++) {
          if(dataToSave[i])dataToSave[i]._op=options.markDirty?
          this.operationCode.ADD:this.operationCode.UN_MODIFIED;
        }

      WL.JSONStore.get(collectionName).add(dataToSave,options).then((success)=>{
        WL.Logger.info('added ' +collectionName+'('+
        JSON.stringify(options)
        +') ' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('add failed for ' +collectionName+'('+
        JSON.stringify(options)
        +') ' + failure);
        WL.Logger.error('add failed for data ['+
        JSON.stringify(options)
        +'] ' + failure);
        resolve(false);
      });
    });
  }

  replace(collectionName:string,dataToSave:any,markClean?:boolean){
    return new Promise(resolve=>{
      if(!(dataToSave instanceof Array))
      dataToSave=[dataToSave];
      
      let options = {
          markDirty : markClean?(!markClean):true
      };

        for (let i = 0, len = dataToSave.length; i < len; i++) {
          if(dataToSave[i])dataToSave[i].json._op=options.markDirty?
          this.operationCode.REPLACE:this.operationCode.UN_MODIFIED;
        }

      WL.JSONStore.get(collectionName).replace(dataToSave,options).then((success)=>{
        WL.Logger.info('replaced ' +collectionName+'('+
        JSON.stringify(options)
        +') ' + success);
        resolve(true);
      },(failure)=>{
        console.log(JSON.stringify(failure));
        WL.Logger.error('replace failed for ' +collectionName);
        resolve(false);
      });
    });
  }

  addOrReplace(collectionName:string,dataToSave:any,replaceCriteria:string[],markClean?:boolean){
    return new Promise(resolve=>{
      if(!(dataToSave instanceof Array))
      dataToSave=[dataToSave];

  var changeOptions = {
 
    // The following example assumes that 'id' and 'ssn' are search fields,
    // default will use all search fields
    // and are part of the data that is received.
    replaceCriteria : replaceCriteria,//['id', 'ssn'],
 
    // Data that does not exist in the Collection will be added, default false.
    addNew : true,
 
    // Mark data as dirty (true = yes, false = no), default false.
    markDirty : markClean?(!markClean):true
  };

  
  if(changeOptions.markDirty){
        
    for (let i = 0, len = dataToSave.length; i < len; i++) {
      if(dataToSave[i]&&dataToSave[i].json)dataToSave[i].json._op=this.operationCode.REPLACE;
      else if(dataToSave[i])dataToSave[i]._op=this.operationCode.ADD;
    }
  }else{
    for (let i = 0, len = dataToSave.length; i < len; i++) {
      if(dataToSave[i]&&dataToSave[i].json)dataToSave[i].json._op=this.operationCode.UN_MODIFIED;
      else if(dataToSave[i])dataToSave[i]._op=this.operationCode.UN_MODIFIED;
    }
  }
 
  //return WL.JSONStore.get(collectionName).change(dataToSave, changeOptions);
      WL.JSONStore.get(collectionName).change(dataToSave,changeOptions).then((success)=>{
        WL.Logger.info('added/replace ' +collectionName+' ' + success);
        resolve(true);
      },(failure)=>{
        WL.Logger.error('add/replace failed for ' + collectionName);
        WL.Logger.error('add/replace failed error ' + JSON.stringify(failure));
        WL.Logger.error('add/replace failed data ' + JSON.stringify(dataToSave));
        resolve(false);
      });
    });
  }
  
  getDocuments(collectionName:string,query?:any, option?:any):Promise<any[]>{
    return new Promise(resolve=>{
      if(!query)query={};
      if(!option)option={};
      WL.JSONStore.get(collectionName).find(query,option).then(success=>{
        resolve(success);
      },(failure)=>{
        WL.Logger.info(collectionName+
        '('+query+','+option+') count not be retrieved!!' );
        resolve([]);
      });
    });
  }

  getDocumentsAdvanced(collectionName:string,query?:any, option?:any):Promise<any[]>{
    return new Promise(resolve=>{
      if(!query)query={};
      if(!option)option={};
      WL.JSONStore.get(collectionName).advancedFind([query],option).then(success=>{
        resolve(success);
      },(failure)=>{
        WL.Logger.info(collectionName+
        '('+query+','+option+') count not be retrieved!!' );
        resolve([]);
      });
    });
  }

  getDocumentCount(collectionName:string,query?:any, option?:any):Promise<number>{
    return new Promise(resolve=>{
      if(!query)query={};
      if(!option)option={};
      WL.JSONStore.get(collectionName).count(query,option).then((cnt)=>{
        WL.Logger.info('Total '+collectionName+
        '('+query+','+option+') count is...' + cnt);
        resolve(cnt);
      },(failure)=>{
        WL.Logger.info(collectionName+
        '('+query+','+option+') count not be retrieved!!' );
        resolve(-1);
      });
    });
  }

  getAllDirtyDocuments(collectionName:string):Promise<any[]> {
    return new Promise(resolve=>{
      /* WL.JSONStore.get(collectionName).getAllDirty().then((docs)=>{
        WL.Logger.info('Total dirty '+collectionName+' found is...' + docs.length);
        resolve(docs);
      },(failure)=>{
        resolve(failure);
      }); */
      //json query part =={"$notEqual":[{"_op":0}]}
      /* var queryPart1 = WL.JSONStore.QueryPart()
                   .notEqual('_op', 0); */
      resolve(this.getDocumentsAdvanced(collectionName,{"$notEqual":[{"_op":0}]},{exact:true}));
      
    });
  }

}
