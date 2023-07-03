import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlBaseVectorSourceProviderDirective} from './base-vector-source-provider.directive';
import VectorSource, {Options} from 'ol/source/Vector';

@Directive({
  selector: 'ol-vector-source',
  providers: [
    {provide: NgxOlBaseVectorSourceProviderDirective, useExisting: NgxOlVectorSourceProviderDirective}
  ]
})
export class NgxOlVectorSourceProviderDirective extends NgxOlBaseVectorSourceProviderDirective<VectorSource, Options>
  implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    this._source = new VectorSource(this._options);
    super.ngAfterContentInit();
  }

}
