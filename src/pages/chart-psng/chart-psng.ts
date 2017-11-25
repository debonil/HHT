import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ShiftPsgnPage } from '../shift-psgn/shift-psgn';
import { ComponentsTristateToggleComponent } from '../../components/components-tristate-toggle/components-tristate-toggle';

@Component({
  selector: 'page-chart',
  templateUrl: 'chart-psng.html'
})
export class  ChartPsngPage {
  private rows : any;
  private readonly : boolean;
  listitems;
  selectedItems=new Array();
  myIcon : string;
  someArray=new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
    this.rows = this.navParams.data.psngdata;
    this.readonly = this.navParams.data.readonly; 
    console.log(this.navParams.data);
  }

  checkBoxChanged(val){
console.log(val);

  }
  updateIcons(event, val) {
    if(event.checked == true){
      this.selectedItems.push(true);
      if(this.selectedItems.length == 2){
          let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
          mu_sh.style.display = ('block');
          let shift = <HTMLButtonElement>document.getElementById('shift');
          shift.style.display = ('none');
          let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
          bo_at.style.display = ('none');
          let go_at = <HTMLButtonElement>document.getElementById('go_at');
          go_at.style.display = ('none');
        
      }else if(this.selectedItems.length == 1){
          let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
          mu_sh.style.display = ('none');
          let shift = <HTMLButtonElement>document.getElementById('shift');
          shift.style.display = ('block');
          let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
          bo_at.style.display = ('block');
          let go_at = <HTMLButtonElement>document.getElementById('go_at');
          go_at.style.display = ('block');
          //---pass selected psgn data toShift page----
          shift.addEventListener('click', (event) => {
            this.openModel_ShiftPsgn(val);
          });
      }else{
          let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
          mu_sh.style.display = ('none');
          let shift = <HTMLButtonElement>document.getElementById('shift');
          shift.style.display = ('none');
          let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
          bo_at.style.display = ('none');
          let go_at = <HTMLButtonElement>document.getElementById('go_at');
          go_at.style.display = ('none');
       }
    }else{
      this.selectedItems.pop();
       if(this.selectedItems.length == 2){
          let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
          mu_sh.style.display = ('block');
          let shift = <HTMLButtonElement>document.getElementById('shift');
          shift.style.display = ('none');
          let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
          bo_at.style.display = ('none');
          let go_at = <HTMLButtonElement>document.getElementById('go_at');
          go_at.style.display = ('none');
       }else if(this.selectedItems.length == 1){
            let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
            mu_sh.style.display = ('none');
            let shift = <HTMLButtonElement>document.getElementById('shift');
            shift.style.display = ('block');
            let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
            bo_at.style.display = ('block');
            let go_at = <HTMLButtonElement>document.getElementById('go_at');
            go_at.style.display = ('block');
       }else{
          let mu_sh = <HTMLButtonElement>document.getElementById('mu_sh');
          mu_sh.style.display = ('none');
          let shift = <HTMLButtonElement>document.getElementById('shift');
          shift.style.display = ('none');
          let bo_at = <HTMLButtonElement>document.getElementById('bo_at');
          bo_at.style.display = ('none');
          let go_at = <HTMLButtonElement>document.getElementById('go_at');
          go_at.style.display = ('none');
       }
    }
  }

  onItemHold(val){
    console.log(val);
  }

  chartItemClicked(val) {
    console.log(val);
    //alert(val);
  }

  openModel_ShiftPsgn(selectedPsgnData){
    let modal = this.modalCtrl.create(ShiftPsgnPage, selectedPsgnData);
    modal.present();
  }

}

  /* getItems(ev) {
    this.initializeRows();
    var val = ev.target.value;
    console.log('============== : '+val);
    if (val && val.trim() != '') {
      for(let i in this.rows){
        this.someArray.push(this.rows[i].PNR);
      }
      console.log('++++++++++' +this.someArray);
       this.someArray = this.someArray.filter((smArr) => {
         console.log('item : ' +smArr);
        return (smArr.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }); 
    }
  }
} */
/*let parent = <HTMLDivElement>document.getElementById('parent');
        let button = document.createElement("ion-button");
        let text = document.createTextNode("Click me");
        button.appendChild(text);
        button.setAttribute('id','button1');
        parent.appendChild(button);
        let button1 = <HTMLButtonElement>document.getElementById('button1');
        button1.addEventListener('click', (event) => {
          alert("Button clicked");
        });*/