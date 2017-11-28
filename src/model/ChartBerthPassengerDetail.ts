
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
  IS_CHECKED ;//= element.json.ATTENDANCE_MARKER!='-';
  _isLocked;//= element.json.ATTENDANCE_MARKER!='-';
  _hidden

  constructor(element) {
  // console.log(this);
  this.ID   = element._id;
  this.BN   = element.json.BERTH_NO;
  this.TRAIN_ID   = element.json.TRAIN_ID;
  this.QT=element.json.PRIMARY_QUOTA;
  this.RS=element.json.REL_POS;
  this.TU_NT= element.json.ATTENDANCE_MARKER=='P';
  this.PNR  = element.json.PNR_NO;
  this.NAME = element.json.PSGN_NAME;
  this.S_A  = element.json.AGE_SEX;
  this.SRC  = element.json.JRNY_FROM;
  this.BRD  = element.json.BOARDING_PT;
  this.DEST = element.json.JRNY_TO;
  this.TKT  = element.json.TICKET_TYPE;
  this.MEAL = element.json.FOOD_FLAG;
  this.P_AMT= element.json.PENDING_AMT;
  this.REMARKS= element.json.REMARKS;
  this.COACH		   = element.json.COACH_ID; 
  this.CAB_CP_ID		  = element.json.CAB_CP_ID;
  this.CAB_CP			  = element.json.CAB_CP; 
  this.BERTH_INDEX	  = element.json.BERTH_INDEX;
  this.REMOTE_LOC_NO = element.json.REMOTE_LOC_NO;
  this.CH_NUMBER		  = element.json.CH_NUMBER;
  this.SYSTIME		 = element.json.SYSTIME;
  this.VIP_MARKER = element.json.VIP_MARKER;
  this.CLASS = element.json.CLASS;
  this.IS_CHECKED = element.json.ATTENDANCE_MARKER!='-';
  this._isLocked= element.json.ATTENDANCE_MARKER!='-';
  this._hidden= false;
  }


  
}
