/*
 *  Licensed Materials - Property of Paxcel Technologies
 */
import { Component , ViewChild , OnInit } from '@angular/core';
import { NavController, NavParams , ViewController, MenuController , Events , 
LoadingController , AlertController , Slides} from 'ionic-angular';
//import { assignCoach, CoachId , CompletePassengerData, Maps , UpdatedPassengerDetail } from '../../../entities/map';
import { Passenger, Maps, CoachDetails} from '../../../entities/map';
import { FormsModule } from '@angular/forms';
import { StorageProvider } from '../../../providers/storage/storage';
import { LoggerProvider } from '../../../providers/logger/logger';
import { BackendProvider } from '../../../providers/backend/backend';
import { UtilProvider } from '../../../providers/util/util';
//import { ConfirmChartPage } from '../confirmChart/confirmChart'; 

import {Logs} from '../../../entities/messages';


@Component({
    selector: 'page-showchart',
    templateUrl: 'showChart.html',  
    styleUrls : ['/app/pages/chart/chart.scss']
})

/* This page controls charts with slider and checking mechanish */
export class ShowChartPage implements OnInit{
    loadChartDate : string;
    coach : string;
    trainNo : string ;
    currentTime : string;
    loadTime : string;
    trainAssignment : any;

    /*coachArr : CoachId[] = [];
    map : Maps[] = [
        {id : 1 , status : 'A'},
        {id : 2 , status : 'P'},
        {id : 3 , status : 'NA'}
    ] ;*/
    showOptions: boolean = false;
    doc : any ;
    myInput : string ;
    shouldShowCancel : boolean = false;
    passengerDataArr:any = [];
    //updatedPassengerDetail : UpdatedPassengerDetail[] = [];
    //passengerDetail : UpdatedPassengerDetail = new UpdatedPassengerDetail('','');
    //updatedPassenger : CompletePassengerData[] = [];
    //passenger : CompletePassengerData = 
    //new CompletePassengerData('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',false);
    username : String ;
    //coachIdArr : assignCoach = new assignCoach('',[]);
    coachId : string  = 'No Coach';
    formErrors = { 'coachId': '' };
    showPreviousButton : boolean = true;
    showNextButton : boolean =true; ;
    YNchecked : boolean;
    isSecondary : boolean;
    syncPassengerData : Passenger[] = [];
    coachArr : CoachDetails[] = [];

    isSecondaryPassenger : boolean = false;
    isSecondaryVacantberth : boolean = false;

    @ViewChild(Slides) slides: Slides;
    @ViewChild('myTitle') myHeading : any;
    

    /* validation messages , these can be configured in methods */
    validationMessages = {
        'coachId': {
            'invalid': 'Please select a coach ID.'
        }
    };

    constructor(public navCtrl: NavController, public navParams: NavParams , 
    private viewCtrl : ViewController , private form : FormsModule,
    private menu : MenuController , private event : Events , private loadCtrl : LoadingController,
    private alertCtrl : AlertController , private storage : StorageProvider, 
    private logger : LoggerProvider , private backend : BackendProvider , private util:UtilProvider) {
        this.username = this.navParams.get('username');
        this.menu.get('menu2').enable(true);
        this.menu.get('menu1').enable(false);
        this.loadChartDate = this.navParams.get('chartLoadDate');
        (this.navParams.get('chartLoadDate'));
        
    }

    ngOnInit() {
        this.getAllPassenger();
        
        
    }
  getAllPassenger(){
        this.storage.getPassenger('passenger').then((res)=>{
            this.passengerDataArr = res;
        })
  }
    previous() {
        this.slides.slidePrev();
    }

    next() {
        this.slides.slideNext();
    }
    
    /* sync flag changes according to data left to be synced from jsonStore to server*/
    changeSyncFlag() {

    }

    /* function executed after slide changed*/
    slideChanged() {
        
    }

    onChange(value) {
        this.logger.logInfoLogs(value);
        this.slides.clickedSlide;
    }

    ionViewWillEnter() {
        /*
        this.viewCtrl.showBackButton(false);
        this.updatedPassenger = [];
        this.changeSyncFlag();*/
    }

    /* function that updates on jsonStore*/
    updatePassengerStatus(value ,index, passenger, showCheck) {
        
    }

    /* checked data only processed for the window*/
    onCheck(checked , value , passenger) {

    }

    syncData(){
        alert('sync at Showchart');
    }

    syncData2(){
        if(this.isSecondaryPassenger==false && this.isSecondaryVacantberth ==false){
            this.isSecondaryPassenger = true;
            this.isSecondaryVacantberth = true;
            this.backend.getCurrentTime().then((response:any)=>{
                if(response.CODE==200){
                    let data = this.util.convertIntoJson(response.TEXT);
                    this.currentTime = data.resultSet[0].TIME;
                    this.storage.getTrainAssignment().then((response)=>{
                        this.trainAssignment = response;
                        this.syncPassenger().then(res=>{
                            if(res){
                                this.isSecondaryPassenger = false;
                                this.updateLoadTime();
                            }
                        });
                        this.syncVacantberth().then(res=>{
                            if(res){
                                this.isSecondaryVacantberth = false;
                                this.updateLoadTime();
                            }
                        });

                        this.syncEftmaster();

                        this.syncCoachtime();
                    });
                }else if(response.CODE==500){
                    this.syncData();
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                }
            });
        }else{
            alert('TRY LATER');
        }
    }

    syncPassenger(){
        return new Promise(resolve=>{
            this.sendDirtyPassenger().then(success=>{
                if(success)
                    this.getDifferentialPassengers().then(res=>{
                        if(res)
                            resolve(true);
                        else{
                            resolve(false);
                        }
                    });
                else{
                    alert('COULD NOT SEND DIRTY PASSENGER');
                    resolve(false);
                }
            });
        });
    }

    sendDirtyPassenger(){
        return new Promise(resolve=>{
            this.storage.getDirtyRecords('passenger').then((dirtyPsgn:any)=>{
                if(dirtyPsgn.length>0){
                    this.postDirtyPassenger(dirtyPsgn).then(success=>{
                        if(success){
                            this.storage.markClean('passenger',dirtyPsgn).then(res=>{
                                if(res){
                                    resolve(true);
                                }else{
                                    alert('FAILS TO CLEAN PSGN');
                                    resolve(false);
                                }
                            });
                        }else{
                            resolve(false);
                        }
                    });
                }else{
                    resolve(true);
                }
            });
        });
    }

    postDirtyPassenger(data){
        return new Promise(resolve=>{
            this.backend.postPassengerData(data).then((response:any)=>{
                if(response.CODE==200){
                    resolve(true);
                }else if(response.CODE==500){
                    this.postDirtyPassenger(data);
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

    getDifferentialPassengers(){
        return new Promise(resolve=>{
            this.backend.getDifferentialPassenger(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME, this.currentTime).then((response:any)=>{
                if(response.CODE==200){
                    let data = this.util.convertIntoJson(response.TEXT);
                    this.storage.addPassengers(data.resultSet).then(res=>{
                        if(res){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                }else if(response.CODE==500){
                    this.getDifferentialPassengers();
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

    syncVacantberth(){
        return new Promise(resolve=>{
            this.sendDirtyVacantberth().then(success=>{
                if(success)
                    this.getDifferentialVacantberth().then(res=>{
                        if(res)
                            resolve(true);
                        else{
                            resolve(false);
                        }
                    });
                else{
                    alert('COULD NOT SEND DIRTY VACANTBERTH');
                    resolve(false);
                }
            });
        });
    }

    sendDirtyVacantberth(){
        return new Promise(resolve=>{
            this.storage.getDirtyRecords('vacantberth').then((dirtyBerth:any)=>{
                if(dirtyBerth.length>0){
                    this.postDirtyVacantberth(dirtyBerth).then(success=>{
                        if(success){
                            this.storage.markClean('vacantberth',dirtyBerth).then(res=>{
                                if(res){
                                    resolve(true);
                                }else{
                                    alert('FAILS TO CLEAN VACANTBERTH');
                                    resolve(false);
                                }
                            });
                        }else{
                            resolve(false);
                        }
                    });
                }else{
                    resolve(true);
                }
            });
        });
    }

    postDirtyVacantberth(data){
        return new Promise(resolve=>{
            this.backend.postVacantberthData(data).then((response:any)=>{
                if(response.CODE==200){
                    resolve(true);
                }else if(response.CODE==500){
                    this.postDirtyVacantberth(data);
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

    getDifferentialVacantberth(){
        return new Promise(resolve=>{
            this.backend.getDifferentialVacantberth(this.trainAssignment.TRAIN_ID, this.trainAssignment.LOAD_TIME, this.currentTime).then((response:any)=>{
                if(response.CODE==200){
                    let data = this.util.convertIntoJson(response.TEXT);
                    this.storage.addVacantBerth(data.resultSet).then(res=>{
                        if(res){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                }else if(response.CODE==500){
                    this.getDifferentialVacantberth();
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

    updateLoadTime(){
        return new Promise(resolve=>{
            if(!this.isSecondaryPassenger && !this.isSecondaryVacantberth){
                this.storage.getTrainAssignment().then((doc:any)=>{
                    doc.json.LOAD_TIME = this.currentTime;
                    this.storage.replaceTrainAssignment(doc).then(res=>{
                        if(res){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                });
			}else{
				resolve(true);
			}
        });
    }

    syncEftmaster(){
        return new Promise(resolve=>{
            this.storage.getDirtyRecords('eftMaster').then((dirtyEftmaster:any)=>{
                if(dirtyEftmaster.length>0){
                    this.postEftmaster(dirtyEftmaster).then(res=>{
                        if(res){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                }else{
                    resolve(true);
                }
            });
        });
    }

    postEftmaster(dirtyEftmaster){
        return new Promise(resolve=>{
            this.backend.postEftmasterdata(dirtyEftmaster).then((response:any)=>{
                if(response.CODE==200){
                    resolve(true);
                }else if(response.CODE==500){
                    this.postEftmaster(dirtyEftmaster);
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

    syncCoachtime(){
        return new Promise(resolve=>{
            this.storage.getDirtyRecords('coachTime').then((dirtyCoachtime:any)=>{
                if(dirtyCoachtime.length>0){
                    this.postCoachtime(dirtyCoachtime).then(res=>{
                        if(res){
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    });
                }else{
                    resolve(true);
                }
            });
        });
    }

    postCoachtime(dirtyCoachtime){
        return new Promise(resolve=>{
            this.backend.postCoachtimedata(dirtyCoachtime).then((response:any)=>{
                if(response.CODE==200){
                    resolve(true);
                }else if(response.CODE==500){
                    this.postCoachtime(dirtyCoachtime);
                }else{
                    alert('UNHANDLED EXCEPTION ' + response.CODE);
                    resolve(false);
                }
            });
        });
    }

}