import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';
import { ColorGenerator } from "./color-generator";

@Directive({
  selector: 'text-avatar',
  providers: [ColorGenerator]
})
export class TextAvatarDirective {
  colors={
    primary:    '#488aff',
    secondary:  '#32db64',
    danger:     '#f53d3d',
    light:      '#f4f4f4',
    dark:       '#222',
    energized:  '#ffc527',
    royal:      '#7e60ff',
    subtle:     '#444444',
    vibrant:    'rebeccapurple',
    bright:     '#ffc125',

  favorite: '#69BB7B',
  darkgraycustom: '#333333',
  mediumgraycustom:'#666666',
  lightgraycustom : '#b2b2b2',
  };
  constructor(private element: ElementRef, private colorGenerator: ColorGenerator) { }

  @Input() text: string;
  @Input() color: string;
  ngOnChanges(changes: SimpleChanges) {
    let text = changes['text'] ? changes['text'].currentValue : null;
    let color = changes['color'] ? changes['color'].currentValue : null;
    
        /* this.element.nativeElement.setAttribute("value", this.extractFirstCharacter(text));
        this.element.nativeElement.style.backgroundColor = this.backgroundColorHexString(color, text); */
        // console.log(text);
        // console.log(color);

          if(text)
            this.element.nativeElement.setAttribute("value", text);
            if(color)
            this.element.nativeElement.style.backgroundColor = this.colors[color];
  }

  private extractFirstCharacter(text: string): string {
    return text.charAt(0) || '';
  }

  private backgroundColorHexString(color: string, text: string): string {
    return color || this.colorGenerator.getColor(this.extractFirstCharacter(text));
  }
}
