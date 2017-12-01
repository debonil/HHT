import { Component, Renderer } from '@angular/core';
import { NavController,ViewController,Events,AlertController, LoadingController,MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ChartPage } from '../chart/chart';
import { App } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import {Logs} from '../../entities/messages';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  splash = true;
  form : NgForm;
  optionPage : ChartPage;
  isInvalid : boolean = false;
  username : string; 
  formErrors = {
      'username': '',
      'password': ''
  };

  validationMessages = {
      'username': {
          'required':  Logs.username_required,
          'pattern': Logs.username_pattern,
          
      },
      'password': {
          'required': Logs.password_required,
          'invalid' : Logs.password_invalid
      }
  };

  constructor(public navCtrl: NavController,private app : App , private viewCtrl : ViewController,
    private event : Events , private storage : StorageProvider ,private renderer : Renderer,    
    public alert : AlertController , private loading : LoadingController,private menu : MenuController,
    private logger : LoggerProvider , private backend : BackendProvider,private pdsp: PsngDataServiceProvider, private util : UtilProvider) {
      this.menu.get('menu1').enable(false);
      this.menu.get('menu2').enable(false);
      app._setDisableScroll(true);
  }

  ionViewDidLoad(){
    //setTimeout(() => this.splash = false, 300);	
    /* this.pdsp.findAll().subscribe(data => {
        console.log(data.coachwiseChartData.length);
       }); */
  }

  showPassword(input: any):any{
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  onSubmit2(event , username , password){
      //Added by DG
      if(username === '')username='psaini';
      if(password === '')password='psaini';

      ///END Add
    if(username === ''){this.formErrors['username'] = this.validationMessages.username.required;}
    else if(password === ''){this.formErrors['password'] = this.validationMessages.password.required;}
    else{
        this.storage.getTrainAssignment().then((trainAssignment:any)=>{
            if(username!=trainAssignment.USER_ID){
                this.username = username;
                const loading = this.loading.create({
                    content : 'Signing In ......'
                });
                loading.present();
                this.backend.authenticateUser(username,password).then((response:any)=>{
                    //alert(JSON.stringify(response));
                    if(response.CODE==200){
                        let data = JSON.parse(response.TEXT);
                        if(data.isSuccessful && data.resultSet[0].SUPERVISOR_ID ==username ){
                            this.storage.clear('trainAssignment');
                            this.storage.clear('coachTime');
                            this.storage.clear('droptEticketPassenger');
                            this.storage.clear('dynamicFare');
                            this.storage.clear('eftMaster');
                            this.storage.clear('passenger');
                            this.storage.clear('vacantberth');
                            this.backend.getTrainAssignment(this.username).then((response:any)=>{
                                //alert(JSON.stringify(response));
                                if(response.CODE==200){
                                  //let data = this.util.convertIntoJson(response.TEXT);
                                  this.storage.addTrainAssignment(response.TEXT).then(success=>{
                                    
                                this.navCtrl.setRoot(ChartPage ,{user : this.username, noChart : true });
                                loading.dismiss();
                                  });
                                }else if(response.CODE==500){
                                    loading.dismiss();
                                    alert('UNHANDLED ERROR ' + response.CODE);
                                }else{
                                  loading.dismiss();
                                  alert('UNHANDLED ERROR ' + response.CODE);
                                }
                              },failure=>{
                                alert('FAILS TO GET TRAIN ASSIGNMENT'+JSON.stringify(failure));
                              });
                        }
                    }else if(response.CODE==500){
                        alert('N/W NOT AVAILABLE RETRY');
                        loading.dismiss();
                    }else{
                        loading.dismiss();
                        alert('UNHANDLED ERROR '+ response.CODE);
                    }
                },(failure)=>{
                    alert('BACKEND AUTHENTICATION FAILS '+ JSON.stringify(failure));
                    loading.dismiss();
                });
            }else{
                console.log('NEED NOT PERFORM AUTHENTICATION');
                this.navCtrl.setRoot(ChartPage ,{user : trainAssignment.USER_ID, noChart : false });
            }
        });
    }
  }
}
