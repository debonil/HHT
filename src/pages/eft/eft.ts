import { Component  , OnInit , } from '@angular/core';
import { NgForm} from '@angular/forms';
import { IonicPage, NavController, NavParams,ViewController , LoadingController , MenuController ,AlertController} from 'ionic-angular';
import { CoachDetails , DynamicFare, EftMaster, IsldtlTable, VacantBerth, Passenger} from '../../entities/map';
//import { StorageProvider } from '../../providers/storage/storage';
import {StorageServiceProvider} from '../../providers/storage-service/storage-service';
import { LoggerProvider } from '../../providers/logger/logger';
import {Logs} from '../../entities/messages';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { EftFormPage } from '../eft-form/eft-form';

//declare var WL;
/**
 * Generated class for the EftPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eft',
  templateUrl: 'eft.html',
})
export class EftPage {
  eftList: any[] = [];

  constructor(public navCtrl: NavController, private viewCtrl : ViewController ,
    public params : NavParams , private loadCtrl : LoadingController  , 
    //private storage : StorageProvider , 
    private menu : MenuController,
    private alert : AlertController , private logger : LoggerProvider,
    private pdsp: PsngDataServiceProvider, private storageService : StorageServiceProvider) {
      
    //this.menu.get('menu1').enable(false);
    //this.menu.get('menu2').enable(true);
   
  }

  ngOnInit(){
    
  }

  ionViewDidEnter(){
    //console.log('eft page called...........');
    /* this.storage.getEftMaster().then((res:any)=>{
      if(res!="failure"){
        this.eftList = res;
      }
    }); */
    this.storageService.getDocuments(this.storageService.collectionName.EFT_MASTER_TABLE).then((res:any)=>{
      this.eftList = res;
    });
  }

  tapEvent(event){
    //alert('check tap');
    console.log(event);
    this.navCtrl.push(EftFormPage);
  }

  getTotal(a,b){
    return Number.parseInt(a) + Number.parseInt(b);
  }

}


