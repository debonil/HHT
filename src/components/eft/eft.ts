import { Component } from '@angular/core';

/**
 * Generated class for the EftComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'eft',
  templateUrl: 'eft.html'
})
export class EftComponent {

  text: string;

  constructor() {
    console.log('Hello EftComponent Component');
    this.text = 'Hello World';
  }

}
