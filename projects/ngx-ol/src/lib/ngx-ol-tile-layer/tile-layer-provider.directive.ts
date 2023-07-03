import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlBaseTileLayerProviderDirective} from './base-tile-layer-provider.directive';
import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({
  selector: 'ol-tile-layer',
  providers: [
    {provide: NgxOlLayerProviderDirective, useExisting: NgxOlTileLayerProviderDirective},
    {provide: NgxOlBaseTileLayerProviderDirective, useExisting: NgxOlTileLayerProviderDirective}
  ]
})
export class NgxOlTileLayerProviderDirective<S extends TileSource>
  extends NgxOlBaseTileLayerProviderDirective<TileLayer<S>, S> implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit() {
    this._layer = new TileLayer<S>(this._options);
    super.ngAfterContentInit();
  }

}
