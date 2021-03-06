export class Maps{
    constructor(public id : number,public status : string){

    }
}

export class NewCoaches{
    constructor(
        public COACH_ID : string,
        public IsLoaded : boolean=false
    ){}
}

export class CoachDetails{
    constructor(
        public TRAIN_NO : string,
        public SRC_DATE : string,
        public TRAIN_ID : number,
        public COACH_ID : string,
        public CH_NUMBER : number,
        public CH_POINT : string,
        public USER_ID : string,
        public SYSTIME : string
    ){}
}

export class CoachTime{
    constructor(
        public TRAIN_ID : number,
        public COACH_ID : string,
        public REMOTE_LOC_NO : number,
        public SRC : string,
        public CH_NUMBER : number,
        public CHECKING_START_TIME : string,
        public CHECKING_END_TIME : string,
        public UPLOAD_TIME : string,
        public DEVICE_NO : string,
        public SYSTIME : string
    ){}
}

export class DropEticketPassenger{
    constructor(
        public TRAIN_ID : number,
        public REMOTE_LOC_NO : number,
        public PNR_NO : string,
        public WAITLIST_NO : number,
        public REL_POS : number,
        public CH_NUMBER : number,
        public PSGN_NAME : string,
        public AGE_SEX : string,
        public BOARDING_POINT : string,
        public SYSTIME : string,
        public RES_UPTO : string
    ){}
}

export class DynamicFare{
    constructor(
        public TRAIN_ID : number,
        public SRC_DATE : string,
        public ROUTE : number,
        public CLASS : string,
        public REMOTE_LOC_NO : number,
        public FROM_STN : string,
        public TO_STN : string,
        public DISTANCE : number,
        public CHILD_FARE : number,
        public ADULT_FARE : number,
        public SYSTIME : string
    ){}
}

export class EftMaster{
    constructor(
        public TRAIN_ID : number,
        public REMOTE_LOC_NO : number,
        public USER_ID : string,
        public EFT_NO : string,
        public SRC : string,
        public DEST : string,
        public FARE : number,
        public FINE : number,
        public NUM_OF_PSGN : number,
        public CLASS : string,
        public TICKET_NO : number,
        public EFT_DATE : string
    ){}
}

export class IsldtlTable{
    constructor(
        public TRAIN_INFO_ID : number,
        public ROUTE_NUMBER : number,
        public STN_CODE : string,
        public STN_SRL_NO : number,
        public TRAIN_TYPE_CODE : string,
        public CUM_DIST : number,
        public ARTIME : string,
        public DPTIME : string,
        public REMOTE_LOC_FLAG : string,
        public LEG_NUMBER : number,
        public DAY_COUNT : number
    ){}
}

export class VacantBerth{
    constructor(
        public TRAIN_ID : number,
        public COACH_ID : string,
        public BERTH_NO : string,
        public CLASS : string,
        public REMOTE_LOC_NO : number,
        public CH_NUMBER : number,
        public BERTH_INDEX : number,
        public SRC : string,
        public DEST : string,
        public ALLOTED : string,
        public REASON : string,
        public CAB_CP : string,
        public CAB_CP_ID : string,
        public PRIMARY_QUOTA : string,
        public SYSTIME : string,
        public SUB_QUOTA : string
    ){}
}

export class Passenger{
    constructor(
        public TRAIN_ID : number,
        public CH_NUMBER : number,
        public REMOTE_LOC_NO : number,
        public COACH_ID : string,
        public CLASS : string,
        public BERTH_INDEX : number,
        public BERTH_NO : string,
        public BERTH_SRC : string,
        public BERTH_DEST : string,
        public PSGN_NO : number,
        public PNR_NO : string,
        public PSGN_NAME : string,
        public AGE_SEX : string,
        public JRNY_FROM : string,
        public JRNY_TO : string,
        public BOARDING_PT : string,
        public RES_UPTO : string,
        public TICKET_NO : string,
        public WAITLIST_NO : string,
        public DUP_TKT_MARKER : string,
        public CAB_CP : string,
        public CAB_CP_ID : string,
        public PRIMARY_QUOTA : string,
        public SUB_QUOTA : string,
        public PENDING_AMT : number,
        public MSG_STN : string,
        public VIP_MARKER : string,
        public ATTENDANCE_MARKER : string,
        public REL_POS : number,
        public TICKET_TYPE : string,
        public NEW_CLASS : string,
        public FOOD_FLAG : string,
        public NEW_COACH_ID : string,
        public NEW_BERTH_NO : string,
        public NEW_PRIMARY_QUOTA : string,
        public CANCEL_PASS_FLAG : string,
        public SYSTIME : string,
        public REMARKS : string,
        public YNchecked : boolean = false  
    ){}
}