import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlBaseVectorLayerProviderDirective} from './base-vector-layer-provider.directive';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({
  selector: 'ol-vector-layer',
  providers: [
    {provide: NgxOlLayerProviderDirective, useExisting: NgxOlVectorLayerProviderDirective}
  ]
})
export class NgxOlVectorLayerProviderDirective<S extends VectorSource>
  extends NgxOlBaseVectorLayerProviderDirective<VectorLayer<S>, S> implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit() {
    this._layer = new VectorLayer<S>(this._options);
    super.ngAfterContentInit();
  }

}
