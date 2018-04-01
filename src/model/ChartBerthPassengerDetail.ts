
export class ChartBerthPassengerDetail {
  ID   ;
  BN  ;
  TRAIN_ID  ;
  QT;
  RS;
  TU_NT;
  PNR  ;
  NAME ;
  S_A  ;//= element.json.AGE_SEX;
  SRC  ;//= element.json.JRNY_FROM;
  BRD  ;//= element.json.BOARDING_PT;
  DEST ;//= element.json.JRNY_TO;
  TKT  ;//= element.json.TICKET_TYPE;
  MEAL ;//= element.json.FOOD_FLAG;
  P_AMT;//= element.json.PENDING_AMT;
  REMARKS;//= element.json.REMARKS;
  COACH		   ;//= element.json.COACH_ID; 
  CAB_CP_ID		  ;//= element.json.CAB_CP_ID;
  CAB_CP			  ;//= element.json.CAB_CP; 
  BERTH_INDEX	  ;//= element.json.BERTH_INDEX;
  REMOTE_LOC_NO ;//= element.json.REMOTE_LOC_NO;
  CH_NUMBER		  ;//= element.json.CH_NUMBER;
  SYSTIME		 ;//= element.json.SYSTIME;
  VIP_MARKER ;//= element.json.VIP_MARKER;
  CLASS ;//= element.json.CLASS;
  SUB_QUOTA;
  MSG_STN;
  TKT_NO;
  IS_CHECKED ;//= element.json.ATTENDANCE_MARKER!='-';
  CANCEL_PASS_FLAG;
  PSGN_NO;
  FONT_COLOR;
  _isLocked;//= element.json.ATTENDANCE_MARKER!='-';
  _hidden;
  _status:number=0;
  dbObj:any;


  statusFlagArray=["-","P","A"];
  statusDetailArray=["NC","TU","NT"];
  statusColorArray=["mediumgraycustom","primary","danger","royal","energized","assertive"];
  statusIconArray=["","checkbox-outline","checkbox-outline-blank"];

  constructor(element) {
    this.dbObj            = element;
    this.ID               = element._id;
    this.BN               = element.json.BERTH_NO;
    this.TRAIN_ID         = element.json.TRAIN_ID;
    this.QT               = element.json.PRIMARY_QUOTA;
    this.RS               = element.json.REL_POS;
    this.TU_NT            = element.json.ATTENDANCE_MARKER=='P';
    this.PNR              = element.json.PNR_NO;
    this.NAME             = element.json.PSGN_NAME;
    this.S_A              = element.json.AGE_SEX;
    this.SRC              = element.json.JRNY_FROM;
    this.BRD              = element.json.BOARDING_PT;
    this.DEST             = element.json.JRNY_TO;
    this.TKT              = element.json.TICKET_TYPE;
    this.MEAL             = element.json.FOOD_FLAG;
    this.P_AMT            = element.json.PENDING_AMT;
    this.REMARKS          = element.json.REMARKS;
    this.COACH		        = element.json.COACH_ID; 
    this.CAB_CP_ID		    = element.json.CAB_CP_ID;
    this.CAB_CP			      = element.json.CAB_CP; 
    this.BERTH_INDEX	    = element.json.BERTH_INDEX;
    this.REMOTE_LOC_NO    = element.json.REMOTE_LOC_NO;
    this.CH_NUMBER		    = element.json.CH_NUMBER;
    this.SYSTIME		      = element.json.SYSTIME;
    this.VIP_MARKER       = element.json.VIP_MARKER;
    this.CLASS            = element.json.CLASS;
    this.SUB_QUOTA        = element.json.SUB_QUOTA;
    this.IS_CHECKED       = element.json.ATTENDANCE_MARKER!='-';
    this.CANCEL_PASS_FLAG = element.json.CANCEL_PASS_FLAG;
    this.PSGN_NO          = element.json.PSGN_NO;
    this.TKT_NO           = element.json.TICKET_NO;

    this.MSG_STN          = element.json.MSG_STN;
    this.FONT_COLOR       = (this.PSGN_NO == -1)?"energized":(this.CANCEL_PASS_FLAG == 'C')?"danger":"dark";
    /* modified by Neeraj
    this._isLocked        = element.json.ATTENDANCE_MARKER!='-'; */
    this._isLocked        = (this.CANCEL_PASS_FLAG == 'C')?true:(element.json.ATTENDANCE_MARKER!='-')?true:false;
    /* end */ 
    this._hidden          = false;
    /* this._status          = this.IS_CHECKED?(this.TU_NT?1:2):0; */
    this._status          = this.IS_CHECKED?(this.TU_NT?1:2):0;
  }

  toggleStatus(){
    if(!this._isLocked){
        this._status=(this._status+1)%3;
        this.dbObj.json.ATTENDANCE_MARKER=this.statusFlagArray[this._status];
    }
  }
  get status(){
      return  this.statusDetailArray[this._status];
  }
  get color(){
    return  this.statusColorArray[this._status];
  }
  get icon(){
    return  this.statusIconArray[this._status];
  }
  


}
