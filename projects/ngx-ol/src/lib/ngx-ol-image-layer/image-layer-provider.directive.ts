import {AfterContentInit, Directive} from '@angular/core';
import ImageLayer from 'ol/layer/Image';
import {NgxOlBaseImageLayerProviderDirective} from './base-image-layer-provider.directive';
import ImageSource from 'ol/source/Image';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';


@Directive({
  selector: 'ol-image-layer',
  providers: [
    {provide: NgxOlLayerProviderDirective, useExisting: NgxOlImageLayerProviderDirective},
    {provide: NgxOlBaseImageLayerProviderDirective, useExisting: NgxOlImageLayerProviderDirective}
  ]
})
export class NgxOlImageLayerProviderDirective<S extends ImageSource>
  extends NgxOlBaseImageLayerProviderDirective<ImageLayer<S>, S> implements AfterContentInit {

  constructor() {
    super()
  }

  override ngAfterContentInit(): void {
    this._layer = new ImageLayer<S>(this._options);
    super.ngAfterContentInit();
  }

}
