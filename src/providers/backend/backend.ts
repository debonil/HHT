/*
 *  Licensed Materials - Property of Centre for railway information systems
 *  @author Ashutosh 
 */

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { provideModuleLoader } from 'ionic-angular/util/module-loader';

declare var WLResourceRequest;

/*
  All resource requests to server will be injected through this.
*/
@Injectable()
export class BackendProvider {

  constructor() {
    
  }

  /*syncPassengerData(chartDate){
    return new Promise(resolve=>{
      let resourceRequest = new WLResourceRequest("/adapters/EHHT/syncPassengerData",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [chartDate]);
      resourceRequest.send().then((response)=>{
        resolve(response.responseText);
      },(failure)=>{
        resolve(failure);
      });
    });
  }*/

  
  postTestData(data){
    return new Promise(resolve=>{
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/testMethod",WLResourceRequest.POST);
      //resourceRequest.setQueryParameter("params", [data]);
      resourceRequest.setHeader("content-type","application/x-www-form-urlencoded");
      resourceRequest.setHeader("accept","application/json");
      var str = {"params" : "{xyz:abc}"};
      resourceRequest.sendFormParameters(JSON.stringify(str)).then((response)=>{
     //resourceRequest.send(str).then((response)=>{
      //resourceRequest.send().then((response)=>{
        resolve(response);
      },(failure)=>{
        resolve(failure);
      });
    });
  }
  
    postPassengerData0(data){
      return new Promise(resolve=>{
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushPassenger",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [data]);
        resourceRequest.send().then((response)=>{
          var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ);
          //resolve(response.responseText);
        },(failure)=>{
          resolve(failure);
        });
      });
    }
    
      postPassengerData(data){
        return new Promise(resolve=>{
          let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushPassenger",WLResourceRequest.POST);
         // resourceRequest.setQueryParameter("params", [data]);
         //var str = "['\"json\":{\"BERTH_INDEX\": 8},\"_id\": 1,\"_operation\": \"replacde\"}, {\"json\":{\"BERTH_INDEX\": 9},\"_id\": 2,\"_operation\": \"replacde\"}']";

          resourceRequest.sendFormParameters({"params":"['"+JSON.stringify(data)+"']"}).then(response=>{ 
            var OBJ = {
              CODE : response.status,
              TEXT : response.responseText,
              data : response.responseJSON
            };
            resolve(OBJ);
            //resolve(response.responseText);
          },(failure)=>{
            resolve(failure);
          });
        });
      }

  postPassengerData2(data){
    try{
      return new Promise(resolve=>{
        //debugger;
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushPassenger",WLResourceRequest.POST);
        //resourceRequest.setHeader("Content-Type","application/x-www-form-urlencoded");
       // resourceRequest.setHeader("Accept","application/json");

        //var str = "['"+JSON.stringify(data.slice(0,2))+"']";
        var str = "['\"json\":{\"BERTH_INDEX\": 8},\"_id\": 1,\"_operation\": \"replacde\"}, {\"json\":{\"BERTH_INDEX\": 9},\"_id\": 2,\"_operation\": \"replacde\"}']";
        //var newParams = {'params' : data.slice(0,2)};
       console.log('-------****************------------ called postPassengerData' + str);
       //resourceRequest.setQueryParameter("params", [str]);
       resourceRequest.sendFormParameters({"params":str}).then(response=>{ 
       // resourceRequest.send().then(response=>{ 
          var OBJ = {
            CODE : response.status,
            TEXT : response.responseText
          };
          resolve(OBJ);
        },failure=>{
          resolve(failure);
        });
      });
    }catch(ex){
      alert('EXCEPTION BACKEND : ' + JSON.stringify(ex));
    }
  }

  postVacantberthData(data){
    return new Promise(resolve=>{
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushVacantberth",WLResourceRequest.POST);
     /*  resourceRequest.setQueryParameter("params", [data]);
      resourceRequest.send().then((response)=>{ */
       // alert('POST BERTH RESPONSE ' + JSON.stringify(response));
       resourceRequest.sendFormParameters({"params":"['"+JSON.stringify(data)+"']"}).then(response=>{
        var OBJ = {
          CODE : response.status,
          TEXT : response.responseText,
          data : response.responseJSON
        };
        resolve(OBJ);
        //resolve(response.responseText);
        console.log(JSON.stringify(OBJ));
      },(failure)=>{
        resolve(failure);
      });
    });
  }

  postEftmasterdata(data){
    return new Promise(resolve=>{
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushEftmaster",WLResourceRequest.POST);
      /* resourceRequest.setQueryParameter("params", [data]);
      resourceRequest.send().then(response=>{ */
      resourceRequest.sendFormParameters({"params":"['"+JSON.stringify(data)+"']"}).then(response=>{

        var OBJ = {
          CODE : response.status,
          TEXT : response.responseText,
          data : response.responseJSON
        };
        resolve(OBJ);
                console.log(JSON.stringify(OBJ));

      },failure=>{
        resolve(failure);
      });
    });
  }

  postCoachtimedata(data){
    return new Promise(resolve=>{
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushEftmaster",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [data]);
      resourceRequest.send().then(response=>{
        var OBJ = {
          CODE : response.status,
          TEXT : response.responseText,
          data : response.responseJSON
        };
        resolve(OBJ);
      },failure=>{
        resolve(failure);
      });
    });
  }

  /*
   * Authenticate user
   */
  authenticateUser(username,password) {
    console.log(username+password);
     return new Promise(
      resolve => {
       // alert(username+password);
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/userAuthentication",WLResourceRequest.GET);
        
        resourceRequest.setQueryParameter("params", [username,password]);
        resourceRequest.send().then((response) => {
          console.log(response);
          //alert("AUTH::"+JSON.stringify(response));
         /*  var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          alert("authenticateUser Failure : "+JSON.stringify(failure));
          resolve(failure);
        }
    )
  })
}

getTrainAssignment(userId){
  return new Promise(resolve=>{
    let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getTrainAssignment",WLResourceRequest.GET);
    resourceRequest.setQueryParameter("params", [userId]);
    console.log(userId);
    resourceRequest.send().then(response=>{
      console.log(response);
      //console.log('get train assignment response ' + JSON.stringify(response));
      //Added by DG for adding new field  ASSIGNED_COACHES to it.
      if(response.responseJSON.ASSIGNED_COACH&&response.responseJSON.ASSIGNED_COACH.length>0){
        response.responseJSON['ASSIGNED_COACHES']
        =response.responseJSON.ASSIGNED_COACH.map(val=>val.COACH_ID).sort(function (a,b) {
          //console.log(this.util);
            var cca=  a.replace(/[^A-Z\.]/g, '');
            var ccb= b.replace(/[^A-Z\.]/g, '');
            if (cca < ccb)
            return -1;
          if (cca > ccb)
            return 1;

            var cna= parseInt(a.replace(/[^0-9\.]/g, ''), 10);
            var cnb= parseInt(b.replace(/[^0-9\.]/g, ''), 10);
            if (cna < cnb)
              return -1;
            if (cna > cnb)
              return 1;
          return 0;
        });

        var TOTAL_COACH = response.responseJSON.TOTAL_COACH.map(coach=>coach.COACH_ID);
       /*  TOTAL_COACH.sort(function (a,b) {
          //console.log(this.util);
            var cca=  a.replace(/[^A-Z\.]/g, '');
            var ccb= b.replace(/[^A-Z\.]/g, '');
            if (cca < ccb)
            return -1;
          if (cca > ccb)
            return 1;

            var cna= parseInt(a.replace(/[^0-9\.]/g, ''), 10);
            var cnb= parseInt(b.replace(/[^0-9\.]/g, ''), 10);
            if (cna < cnb)
              return -1;
            if (cna > cnb)
              return 1;
          return 0;
        }); */
        console.log(TOTAL_COACH);
        response.responseJSON.FOREIGN_COACHES = [];
        response.responseJSON.TOTAL_COACHES = [];
        TOTAL_COACH.forEach(coach=>{
          response.responseJSON.TOTAL_COACHES .push(coach);
          response.responseJSON.ASSIGNED_COACHES.indexOf(coach)==-1?response.responseJSON.FOREIGN_COACHES.push(coach):'';
        });
      }
      
      //Added by DG for adding new field  ISL_ARR to it.
      if(response.responseJSON.ISL&&response.responseJSON.ISL.length>0){
        response.responseJSON['ISL_ARR']
        =response.responseJSON.ISL.map(val=>val.STN_CODE.trim());
      }
      
      /* var obj = {
        CODE : response.status,
        TEXT : response.responseJSON
      };
      resolve(obj); */
      resolve(response);
    },failure=>{
      console.log('get train assignment failure ' + JSON.stringify(failure));
      resolve(failure);
    });
  });
}


/*
 * Fetching coach details
 */
getCoachDetails(user_id) {
 // alert('get coaches called');
     return new Promise(resolve => {
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getCoacheDetails",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [user_id]);
      resourceRequest.send().then((response) => {
        var obj = {
          CODE : response.status,
          TEXT : response.responseText,
          data : response.responseJSON
        };
        resolve(obj) ;
      },(failure) => {
        resolve(failure);
      }
    )
  })
}


/*getCoachDetails(user_id) {
     return new Promise(resolve => {
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getCoacheDetails",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [user_id]);
      resourceRequest.send().then((response) => {
          //resolve(response.responseText);
          resolve(response);
      },(failure) => {
        resolve(failure);
      }
    )
  })
}*/


 /*
  * Load current time
  */
getCurrentTime() {
  return new Promise(
    resolve => {
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getCurrenttime",WLResourceRequest.GET);
      resourceRequest.send().then((response)=>{
        var obj = {
          CODE : response.status,
          TEXT : response.responseText,
          data : response.responseJSON,
        };
        resolve(obj) ;
      },(failure) => {
        resolve(failure);
      }
    );
  });
}


/*
 * Add new passengers
 */
addNewPassenger(dirtyPassenger) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushPassenger",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [dirtyPassenger]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

getDifferentialWaitList(train_id, lastLoadTime, currentTime){
  return new Promise(resolve=>{
    let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDifferentialWaitList",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [train_id, lastLoadTime, currentTime]);
      resourceRequest.send().then((response)=>{
        resolve(response);
      },failure=>{
        alert('BKEND DIFFERENTIAL_WL FAILURE: ' + JSON.stringify(failure));
        resolve(failure);
      });  
  });
}

getForeignWaitList(train_id,coach_id, loadTime){
  return new Promise(resolve=>{
    let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getForeignWaitList",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [train_id,coach_id,loadTime]);
      resourceRequest.send().then((response)=>{
        resolve(response);
      },failure=>{
        alert('BKEND FOREIGN_WL FAILURE: ' + JSON.stringify(failure));
        resolve(failure);
      });  
  });
}

getDifferentialForeignWaitList(train_id, coachList, lastLoadTime, currentTime){
  return new Promise(resolve=>{
    /* let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDifferentialForeignWaitList",WLResourceRequest.GET, 1000); */
    let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDifferentialForeignWaitList",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [train_id, coachList, lastLoadTime, currentTime]);
      resourceRequest.send().then((response)=>{
        //resolve(response);
        response.responseJSON = response.responseJSON.reduce((a,b)=>{
          return a.concat(b);
        },[]);
        resolve(response);
      },failure=>{
        alert('BKEND FOREIGN_WL FAILURE: ' + JSON.stringify(failure));
        resolve(failure);
      });  
  });
}

/*
 * Load passengers for train 
 */
getPassenger(train_id,coach_id, loadTime) {
     return new Promise(
      resolve => {
        /* let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getPassengers",WLResourceRequest.GET, 1000); */
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getPassengers",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id,coach_id,loadTime]);
        resourceRequest.send().then((response) => {
          console.log(response);
          
          /* var OBJ = {
            CODE : response.status,
            TEXT : response.responseJSON
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          alert(train_id + '-' +coach_id+ '-' + loadTime + ' BKEND PSGN failure: ' + JSON.stringify(failure));
          resolve(failure);
        }
    )
  })
}


/*
 * loading Differential passenger
 */
getDifferentialPassenger(train_id, coachList, lastLoadtime, currentTime) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDifferentialPassengers",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id, coachList, lastLoadtime, currentTime]);
        resourceRequest.send().then((response) => {
          
            /* var OBJ = {
              CODE : response.status,
              TEXT : response.responseText,
              data : response.responseJSON
            };
            resolve(OBJ); */
            response.responseJSON = response.responseJSON.reduce((a,b)=>{
              return a.concat(b);
            },[]);
            resolve(response);
        },(failure) => {
          resolve(failure);
        }
    )
  });
}


/*
 * Add new passenger
 */
addPassenger(DOC) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/addPassengers",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [DOC]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * update passengers
 */
updatePassenger(DOC) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/addPassengers",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [DOC]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * Add vacant berth to server
 */
addNewVacantBerth(dirtyBerth) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/pushVacantberth",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [dirtyBerth]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * Load vacant berths
 */
getVacantBerth(train_id, coach_id, loadTime) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getVacantberths",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id, coach_id, loadTime]);
        resourceRequest.send().then((response) => {
          /* var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

getDifferentialVacantberth(train_id, lastLoadtime, currentTime) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDifferentialVacantberth",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id, lastLoadtime, currentTime]);
        resourceRequest.send().then((response) => {
            var OBJ = {
              CODE : response.status,
              TEXT : response.responseText,
              data : response.responseJSON
            };
            resolve(OBJ);
        },(failure) => {
          resolve(failure);
        }
    )
  });
}

/*
 * Add new vacant berth
 */
addVacantBerth(DOC) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/addVacantBerths",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [DOC]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * update vacant berth
 */
updateVacantBerth(DOC) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/updateVacantBerths",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [DOC]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * Update coach time
 */
updateCoachTime(train_id,coach_id,remote_loc_no,src_ch_number,checking_start_time,checking_end_time,upload_time,device_no,systime) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/updateCoachTime",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id,coach_id,remote_loc_no,src_ch_number,checking_start_time,checking_end_time,upload_time,device_no,systime]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * load coach time
 */
getCoachTime(trainId) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getCoachTime",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [trainId]);
        resourceRequest.send().then((response) => {
          var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
            //resolve(response.responseText);
            resolve(OBJ);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

/*
 * Load Route for given train
 */
loadRoute(train_number) {

     return new Promise(
      resolve => {

        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getRoute",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_number]);
        resourceRequest.send().then((response) => {
            resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * Load master fare
 */
getDynamicFare(trainId) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDynamicFare",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [trainId]);
        resourceRequest.send().then((response) => {
          /* var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

getDifferentialDynamicFare(trainId, lastLoadtime, currentTime) {
  return new Promise(
   resolve => {
     let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getDynamicFare",WLResourceRequest.GET);
     resourceRequest.setQueryParameter("params", [trainId, lastLoadtime, currentTime]);
     resourceRequest.send().then((response) => {
       resolve(response);
     },(failure) => {
       resolve(failure);
     }
    );
  });
}

/*
 * Load EFT Details
 */
getEFTDetails(trainId) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getEFTDetails",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [trainId]);
        resourceRequest.send().then((response) => {
          /* var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

/*
 * Load ISL Details
 */
getISL(trainNo) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getISL",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [trainNo]);
        resourceRequest.send().then((response) => {
          var OBJ = {
            CODE : response.status,
            TEXT : response.responseText,
            data : response.responseJSON
          };
          resolve(OBJ);
           // resolve(response.responseText);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}


/*
 * Load Waitlist
 */
getWaitlist(trainId, loadTime) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getWaitlist",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [trainId, loadTime]);
        resourceRequest.send().then((response) => {
            //resolve(response.responseText);
            console.log("response");
            //console.log( [trainId, loadTime]);
            console.log(response);
            (response);
            var OBJ = {
              CODE : response.status,
              TEXT : response.responseJSON
            };
            resolve(OBJ);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

getChartLoadInfo(trainId){
  try{
    return new Promise(resolve=>{
      /* let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getChartLoadInfo",WLResourceRequest.GET, 15000); */
      let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/getChartLoadInfo",WLResourceRequest.GET);
      resourceRequest.setQueryParameter("params", [trainId]);
      resourceRequest.send().then(response=>{
        resolve(response);
      },failure=>{
        resolve(failure);
      });
    });
  }catch(ex){
    alert('Exception in getChartLoadInfo' + ex);
  }
}


/*
 * Load E tickets dropped passengers
 */
loaddroppedETickets(train_id) {
     return new Promise(
      resolve => {
        let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/droppedETickets",WLResourceRequest.GET);
        resourceRequest.setQueryParameter("params", [train_id]);
        resourceRequest.send().then((response) => {
          /* var OBJ = {
            CODE : response.status,
            TEXT : response.responseText
          };
          resolve(OBJ); */
          resolve(response);
        },(failure) => {
          resolve(failure);
        }
    )
  })
}

getDroppedETickets(train_id) {
  return new Promise(
   resolve => {
     let resourceRequest = new WLResourceRequest("/adapters/ADAPTER_HHT/droppedETickets",WLResourceRequest.GET);
     resourceRequest.setQueryParameter("params", [train_id]);
     resourceRequest.send().then((response) => {
       /* var OBJ = {
         CODE : response.status,
         TEXT : response.responseText
       };
       resolve(OBJ); */
       resolve(response);
     },(failure) => {
       resolve(failure);
     }
 )
})
}


}
