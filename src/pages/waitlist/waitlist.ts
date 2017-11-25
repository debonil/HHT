import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
//import { ModalController } from 'ionic-angular';
import { WaitlistModelPage } from '../waitlist-model/waitlist-model';

/**
 * Generated class for the WaitlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waitlist',
  templateUrl: 'waitlist.html',
})
export class WaitlistPage {
   waitlist:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage : StorageProvider,
    public modalCtrl: ModalController) {
    //this.findWaitListPsgn();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitlistPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter WaitlistPage');
    this.findWaitListPsgn();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter WaitlistPage');
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter WaitlistPage');
  }

  findWaitListPsgn(){
    this.storage.getWaitlistPassenger('passenger').then((res)=>{
     // alert("waitlist size is ")
      this.waitlist=res;
    },(failure)=>{
      alert("failed to load waitlist "+JSON.stringify(failure));
    })
  }

  openModal() {
    //let myModal = this.modalCtrl.create(WaitlistModelPage);
    //myModal.present();
    this.navCtrl.push(WaitlistModelPage);
  }

  onDropboxClick(event, item){
    /*console.log(event.checked);
    console.log(event);
    console.log('Watilist item '+ JSON.stringify(item));
    let modal = this.modalCtrl.create(WaitlistModelPage, item);
    modal.present();*/
    if(event.checked){
      this.navCtrl.push(WaitlistModelPage, item);
    }
  }

}
