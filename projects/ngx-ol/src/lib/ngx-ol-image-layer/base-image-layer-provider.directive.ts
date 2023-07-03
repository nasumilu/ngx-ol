import BaseImageLayer from 'ol/layer/BaseImage';
import ImageSource from 'ol/source/Image';
import {Options} from 'ol/layer/BaseImage';
import LayerRenderer from 'ol/renderer/Layer';
import {AfterContentInit, ContentChild, Directive} from '@angular/core';
import {NgxOlImageSourceProviderDirective} from './image-source-provider.directive';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({selector: 'ol-base-image-layer'})
export class NgxOlBaseImageLayerProviderDirective<L extends BaseImageLayer<S, LayerRenderer<L>>, S extends ImageSource>
  extends NgxOlLayerProviderDirective<L, S, Options<S>> implements AfterContentInit {

  @ContentChild(NgxOlImageSourceProviderDirective) sourceProvider?: NgxOlImageSourceProviderDirective<S, never>

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.layer?.setSource(this.sourceProvider!.source!);
  }

}
