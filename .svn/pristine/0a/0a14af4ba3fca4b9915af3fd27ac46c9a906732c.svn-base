import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var WL;
declare var WLResourceRequest;

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage implements OnInit{
  coach;
  ISL;
  valueSet=new Set();
  coaches   = new Array();
  routes    = new Array();
  row       = new Array();
  status    : any;
  statusArray = new Array();
  status_CoachwiseArray = new Array();
  NPArray :any=[];
  availPsgn :any=[];
  coachTime :any=[];
  //statusArray:string[][] = [[],[]]  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusPage');
  }

  ngOnInit(){
    this.getCoaches();
    this.getStations();
   // this.loadPassengerData();
  }

  getCoaches(){
    try{
     WL.JSONStore.get('trainAssignment').findAll().then((res)=>{
        this.coach=res[0].json.ASSIGNED_COACH;
        for(let i=0;i<this.coach.length;i++){
          this.coaches.push({
            COACH :this.coach[i].COACH_ID
          });
          console.log("coaches:: "+JSON.stringify(this.coaches));
        }

     },(fail)=>{
       console.log("failed to load coaches "+JSON.stringify(fail))
     });

    }catch(ex){
      console.log(ex);
    }
  }

  getStations(){
    try{
       WL.JSONStore.get('trainAssignment').findAll().then((res)=>{
        this.ISL=res[0].json.ISL;
        for(let i=0;i<this.ISL.length;i++){
           this.routes.push({
             STN:this.ISL[i].STN_CODE
           });
          console.log("stations:: "+JSON.stringify(this.routes));

        }
         // this.loadCoachTime();
          this.chk_Status();
       },(fail)=>{
          console.log("failed to fetch stations "+fail)
       });
    }catch(ex){
      console.log(ex);
    }
  }

/* loadPassengerData(){
  try{
    WL.JSONStore.get('passenger').findAll({exact:true}).then((res)=>{
     for(let i=0;i<res.length;i++){
       this.availPsgn.push({
         COACH_ID:res[i].json.COACH_ID,
         SRC     :res[i].json.BOARDING_PT
       });
       // console.log("available psgn :: "+JSON.stringify(this.availPsgn));
     }

    },(fail)=>{
      console.log("failed to load passengers for status "+JSON.stringify(fail));
    })

  }catch(ex){
    alert("failed to load status :: "+JSON.stringify(ex))
  }
}


loadCoachTime(){
  try{
    WL.JSONStore.get('coachTime').findAll().then((res)=>{
     for(let i=0;i<res.length;i++){
       if(res[i].json.FLAG_SYNC=='0'){
         this.coachTime.push({
           SRC:res[i].json.SRC,
           COACH_ID:res[i].json.COACH_ID,
           STATUS:'CH'
         });
       }else{
         this.coachTime.push({
           SRC:res[i].json.BOARDING_PT,
           COACH_ID:res[i].json.COACH_ID,
           STATUS:'RF'
         });
       }
       
        console.log("coach time data is :: "+JSON.stringify(this.coachTime));
     }

    },(fail)=>{
      console.log("failed to load passengers for status "+JSON.stringify(fail));
    })

  }catch(ex){
    alert("failed to load status :: "+JSON.stringify(ex))
  }
} */
 /**********************************************************************************************/ 
   chk_Status(){
    try{
      this.statusArray=[];
      console.log('chkstatus --');
      this.routes.forEach(route => {
        this.coaches.forEach(co => {
            var query = {
              BOARDING_PT   : route.STN,
              COACH_ID      : co.COACH
            }
         this.put_Status1(route,query,co);
        });
      });
    }catch(ex){
      alert('EXCEPTION putStaus @ StatusPage : '+ex);
    }
  }

  put_Status1(route, query,co){
    let UPDATE_BIT = 0;
    try{   
       WL.JSONStore.get('passenger').find(query,{exact : true}).then((res)=>{
        if(res.length == 0){
          this.statusArray.push({
            STATUS : 'NP'
          });
        }else{
          if(res.length > 0){
            res.forEach(psgn => {
              if(psgn._operation == undefined && psgn.json.IS_CHECKED == 1){
                UPDATE_BIT = 1;               
              }else if(psgn.json.IS_CHECKED == 1){
                UPDATE_BIT  = 2;
              }else{
                UPDATE_BIT  = 3               
              }       
            });
            if(UPDATE_BIT == 1){
              this.statusArray.push({
                  STATUS : 'RF'
                });
            }else if(UPDATE_BIT  = 2){
              this.statusArray.push({
                  STATUS : 'CH'
                });
            }else{
              if(UPDATE_BIT  = 3){
                this.statusArray.push({
                  STATUS : 'NC'
                });
              }
            }
            
          }
        }
        if(this.statusArray.length == this.coaches.length*this.routes.length){
          var i=0;
          while(i<this.statusArray.length){
            this.status_CoachwiseArray.push({
              ST_COACH : this.statusArray.slice(i,i+this.coaches.length)
            });
            i= i+this.coaches.length;
          }
        }      
      }); 
    }catch(ex){
      console.log('EXCEPTION IN PUT_STATUS : ' +ex);
    }
    
  } 
}
