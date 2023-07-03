import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: 'ol-attribution'
})
export class NgxOlAttributionDirective {

  constructor(private readonly ele: ElementRef) { }

  get value(): string {
    return this.ele.nativeElement.innerHTML;
  }

  set value(value: string) {
    this.ele.nativeElement.innerHTML = value;
  }

}
