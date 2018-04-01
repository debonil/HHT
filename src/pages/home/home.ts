import { Component, Renderer } from '@angular/core';
import { NavController,ViewController,Events,AlertController, LoadingController,MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ChartPage } from '../chart/chart';
import { App } from 'ionic-angular';
//import { StorageProvider } from '../../providers/storage/storage';
import { LoggerProvider } from '../../providers/logger/logger';
import { BackendProvider } from '../../providers/backend/backend';
import { UtilProvider } from '../../providers/util/util';
import {Logs} from '../../entities/messages';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { StorageServiceProvider } from '../../providers/storage-service/storage-service';

import { Observable } from 'rxjs/Observable';
import Sha from 'sha.js';
//import { HTTP } from '@ionic-native/http';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http/src/base_request_options';


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
  password : string; 
  formErrors = {
      'username': '',
      'password': ''
  };

  isInvalidCredentials : boolean = false;
  isChartNotAssigned : boolean = false;

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
    private event : Events , 
    //private storage : StorageProvider ,
    public storage : StorageServiceProvider,
    private renderer : Renderer,    
    public alert : AlertController , private loading : LoadingController,private menu : MenuController,
    private logger : LoggerProvider , private backend : BackendProvider,private pdsp: PsngDataServiceProvider, 
    private util : UtilProvider) {
      this.menu.get('menu1').enable(false);
      this.menu.get('menu2').enable(false);
      app._setDisableScroll(true);
/*       console.log(this);
 */  }

  ionViewDidLoad(){
    //setTimeout(() => this.splash = false, 300);	
    /* this.pdsp.findAll().subscribe(data => {
        console.log(data.coachwiseChartData.length);
       }); */
       


       /* let myobservable = Observable.create(observable=>{
        observable.next("hello observer");
        setInterval(()=>{
        observable.next("hello observer at intervals ");
        },1000);
        observable.complete();
       });

       myobservable.subscribe(data=>{
           console.log(data);
           
       }); */
  }

  showPassword(input: any):any{
    input.type = input.type === 'password' ? 'text' : 'password';
  }

 /*  login(){
    alert("Login");
    alert("Login"+ this.username +" ::"+ this.password);
      this.onSubmit2( this.username , this.password);
  } */

  onSubmit2( username , password){
    if(username === '' || password === ''){
        this.isInvalidCredentials = true;
        return;
    }

    this.isInvalidCredentials = false;
    this.isChartNotAssigned = false;

    if(username === '')username='sunily';
    if(password === '')password='sunily';
    username=username.trim().toLowerCase();
    password=password.trim().toLowerCase();
      ///END Add
    if(username === ''){this.formErrors['username'] = this.validationMessages.username.required;}
    else if(password === ''){this.formErrors['password'] = this.validationMessages.password.required;}
    else{
        this.storage.getDocuments(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE).then((trainAssignmentRow:any)=>{
           /*  console.log("trainAssignmentRow");
            console.log(!trainAssignmentRow[0]); */
            //let trainAssignment=trainAssignmentRow[0].json;
            if(!(trainAssignmentRow[0])||username!=trainAssignmentRow[0].json.USER_ID){
                this.username = username;
                const loading = this.loading.create({
                    content : 'Signing In ......'
                });
                loading.present();
                this.backend.authenticateUser(username,password).then((response:any)=>{
                  //  alert('user auth resp : ' + JSON.stringify(response));
                    if(response.status==200){
                        let data = response.responseJSON;
                        if(data.isSuccessful && data.resultSet.length==0){
                            this.isInvalidCredentials = true;
                            loading.dismiss();
                        }else{
                            if(data.isSuccessful && data.resultSet[0].SUPERVISOR_ID ==username ){
                                this.storage.clearAll();
                                this.backend.getTrainAssignment(this.username).then((response:any)=>{
                                    if(response.status==200){
                                      loading.dismiss();
                                        if(!response.responseJSON["TRAIN_ID"]){
                                            this.isChartNotAssigned = true;
                                        }else{
                                            //alert(JSON.stringify(response.responseJSON));
                                            console.log('TRN OBJ' + JSON.stringify(response.responseJSON));
                                            this.storage.add(this.storage.collectionName.TRAIN_ASSNGMNT_TABLE,response.responseJSON,true).then(success=>{
                                                this.navCtrl.setRoot(ChartPage ,{user : this.username, noChart : true });
                                            });
                                        }
                                    }else if(response.status==0 || response.status==-1){
                                        loading.dismiss();
                                        alert('BACKEND_ERROR (LOGIN_TRAIN_ASSIGNMENT) : ' + response.errorMsg);
                                    }else{
                                      loading.dismiss();
                                      alert('UNEXPECTED_ERROR (LOGIN_TRAIN_ASSIGNMENT) : ' + JSON.stringify(response));
                                    }
                                  },failure=>{
                                    alert('BACKEND_FAILURE (LOGIN_TRAIN_ASSIGNMENT) :'+JSON.stringify(failure));
                                  });
                            }
                        }
                    }else if(response.status==0 || response.status==-1){
                        alert('BACKEND_ERROR (LOGIN_USER_AUTH) :' + response.errorMsg);
                        loading.dismiss();
                    }else{
                        loading.dismiss();
                        alert('UNEXPECTED_ERROR (LOGIN_USER_AUTH) : '+ JSON.stringify(response));
                    }
                },(failure)=>{
                    alert('BACKEND_FAILURE (LOGIN_USER_AUTH) : '+ JSON.stringify(failure));
                    loading.dismiss();
                });
            }else{
/*                 console.log('NEED NOT PERFORM AUTHENTICATION');
 */                this.navCtrl.setRoot(ChartPage ,{user : username!=trainAssignmentRow[0].json.USER_ID, noChart : false });
            }
        });
    }
  }

  authenticate(username , password, captcha){
    let s = Sha('sha256');
    
    let p = s.update(captcha, 'utf8').digest('hex');
    let o = "";
    this.randString(127).then(res=>{
        o = res + captcha + username;
        let obj = {
            data : {
                    authKey:o
                }
        };
        console.log(obj);
        alert('B4 http');
        
            var headers2 = new HttpHeaders();
            headers2.set('Authorization', 'my-auth-token');
            headers2.set('Access-Control-Allow-Origin','*');
            headers2.set('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT');
            headers2.set('Accept','application/json');
            headers2.set('content-type','application/json');

            
    });
  }

randString(r){
    return new Promise(resolve=>{
        for(var e="";e.length<r&&r>0;){
            var o=Math.random();
            e+=.1>o?Math.floor(100*o):String.fromCharCode(Math.floor(26*o)+(o>.5?97:65))
        }
        resolve(e);
    });
}

}



/* function _create(params) {
    if (!params) {
        return { 'isSuccessful': false, 'errorMsg': 'params is ' + params };
    }
    var clientRequest = WL.Server.getClientRequest();
    var rd = clientRequest.getInputStream();
    var input = {
        method: 'post',
        returnedContentType: 'json',
        path: params.URLParams || '',
        parameters: {},
        headers: {
            'Accept': 'application\/json'
        },
        body: {
            contentType: 'application/json; charset=utf-8',
            content: org.apache.commons.io.IOUtils.toString(rd) || {}
        }
    };

    var response = WL.Server.invokeHttp(input);
    if (response.statusCode && response.statusCode !== 200) {
        response.isSuccessful = false;
    }
    return response;
} 
I tried sending data from client using send(data) and sendFormParameters(data)
https://www.ibm.com/support/knowledgecenter/SSHSCD_8.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-server/html/MFP.Server.html#MFP.Server.invokeHttp
*/
