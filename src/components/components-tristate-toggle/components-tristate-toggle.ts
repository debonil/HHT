import { Component,Input } from '@angular/core';

/**
 * Generated class for the ComponentsTristateToggleComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'tristate-toggle',
  templateUrl: 'components-tristate-toggle.html'
})
export class ComponentsTristateToggleComponent {
  @Input() id = 0;
  value: string;
  name: number;


  constructor() {
    console.log('Hello ComponentsTristateToggleComponent Component');
    this.name = new Date().getMilliseconds();
    this.value = '--';
  }
  setValue(param){
    console.log('Hello ComponentsTristateToggleComponent Component==>'+param);
  }

}
