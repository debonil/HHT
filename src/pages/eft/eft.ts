import { Component  , OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { IonicPage, NavController, NavParams,ViewController , LoadingController , MenuController ,AlertController} from 'ionic-angular';
import { CoachDetails , DynamicFare, EftMaster, IsldtlTable, VacantBerth, Passenger} from '../../entities/map';
//import { StorageProvider } from '../../providers/storage/storage';
import {StorageServiceProvider} from '../../providers/storage-service/storage-service';
import { LoggerProvider } from '../../providers/logger/logger';
import {Logs} from '../../entities/messages';
import { PsngDataServiceProvider } from '../../providers/psng-data-service/psng-data-service';
import { EftFormPage } from '../eft-form/eft-form';
//import { ExpandableComponent } from '../../components/expandable/expandable'
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
  itemExpandHeight: number = 100;  

  constructor(public navCtrl: NavController, private viewCtrl : ViewController ,
    public params : NavParams , private loadCtrl : LoadingController  , 
    //private storage : StorageProvider , 
    private menu : MenuController,
    private alert : AlertController , private logger : LoggerProvider,
    private pdsp: PsngDataServiceProvider, 
    private storageService : StorageServiceProvider) {
      
    //this.menu.get('menu1').enable(false);
    //this.menu.get('menu2').enable(true);
   
  }

  ngOnInit(){
    
  }

  ionViewDidEnter(){
    this.storageService.getDocuments(this.storageService.collectionName.EFT_MASTER_TABLE).then((res:any)=>{
      this.eftList = res;
      /* this.eftList.forEach(res=>{
        res.expanded = false;
      }); */
    });
  }

  expandItem(item){
    this.eftList.map((listItem)=>{
      if(item==listItem){
        listItem.expanded = !listItem.expanded;
      }else{
        listItem.expanded = false;
      }
      return listItem;
    });
  }

  toggleSection(i, item) {
    this.eftList[i].open = !this.eftList[i].open;
  }
 
  toggleItem(i, j) {
    this.eftList[i].children[j].open = !this.eftList[i].children[j].open;
  }

  tapEvent(event){
    //alert('check tap');
    console.log(event);
    this.navCtrl.push(EftFormPage);
  }

  getTotal(a,b,c){
    return Number.parseInt(a) + Number.parseInt(b) + Number.parseInt(c);
  }

}


