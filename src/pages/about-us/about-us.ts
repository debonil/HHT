import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Device } from '@ionic-native/device';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { UtilProvider } from '../../providers/util/util';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var imei;
var appVer;
var os;
var releaseDate;
var serialno;

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    public device: Device,
    public uid: Uid,
    public androidPermissions: AndroidPermissions,public utils:UtilProvider,
    public alertCtrl: AlertController, public viewCtrl: ViewController

  ) {    
/*     this.getIMEINo();
    this.getAppVer();
    this.getOSVer();
    this.getReleaseDate();
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
  }

  
 

  getIMEINo() {
    //var data = this.getImei();
    var data=this.device.uuid;
    //var data=this.getImei(); 
    
    //var data=this.uid.IMEI;
    if (data == null) {
      //this.presentAlert("IMEI number")
      imei="Data Not Available";
    } else {
      imei = data;
      console.log(JSON.stringify(imei));

    }
    return imei;   
  }
  getSerialNo() {
    //var data = this.getImei();
    var data=this.device.serial; 
    
    //var data=this.uid.IMEI;
    if (data == null) {
      //this.presentAlert("IMEI number")
      serialno="Data Not Available";
    } else {
      serialno = data;
      console.log(JSON.stringify(serialno));

    }
    return serialno;   
  }
  getOSVer() {
    var data = this.device.version

    if (data == null) {
      //this.presentAlert(" android version ")
      os="Data Not Available";
    } else {
      os = data;
      console.log(os);

    }
    return os;   
  }

  getAppVer() {       
   
      var data = this.utils.getAppVersion() ;

      if (data == null) {
        //this.presentAlert(" Application version ")
        appVer="Data Not Available";
      } else {
        appVer = data;
        console.log(appVer);  
      }
      return appVer;   

  }
  getReleaseDate() {
    var data =this.utils.getReleaseDate() ;

    if (data == null) {
      //this.presentAlert("Release date")
      releaseDate="Data Not Available";
    } else {
      releaseDate = data;
      console.log(releaseDate);
    }
    return releaseDate;
  }

 

  close() {
    this.viewCtrl.dismiss();
  }
  
  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
   
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
   
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
   
      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }
   
     return this.uid.IMEI
   }


}
