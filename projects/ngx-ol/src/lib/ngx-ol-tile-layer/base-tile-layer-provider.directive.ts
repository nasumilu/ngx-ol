import {AfterContentInit, ContentChild, Directive, Input} from '@angular/core';
import {NgxOlTileSourceProviderDirective} from './tile-source-provider.directive';
import BaseTileLayer from 'ol/layer/BaseTile';
import TileSource from 'ol/source/Tile';
import {Options} from 'ol/layer/BaseTile';
import CanvasTileLayerRenderer from 'ol/renderer/canvas/TileLayer';
import {parseBoolean} from '../ngx-ol-common/transform';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({
  selector: 'ol-base-tile-layer'
})
export class NgxOlBaseTileLayerProviderDirective<L extends BaseTileLayer<S, CanvasTileLayerRenderer>, S extends TileSource>
  extends NgxOlLayerProviderDirective<L, S, Options<S>> implements AfterContentInit {

  @ContentChild(NgxOlTileSourceProviderDirective) sourceProvider?: NgxOlTileSourceProviderDirective<S, never> ;

  constructor() {
    super();
  }

  @Input({transform: parseInt})
  get preload(): number {
    return this.layer?.getPreload() ?? this._options.preload ?? 0;
  }

  set preload(value: number) {
    this.layer?.setPreload(value);
    this._options.preload = value;
  }

  @Input({transform: parseBoolean})
  get useInterimTilesOnError(): boolean {
    return this.layer?.getUseInterimTilesOnError() ?? this._options.useInterimTilesOnError ?? true;
  }

  set useInterimTilesOnError(value: boolean) {
    this.layer?.setUseInterimTilesOnError(value);
    this._options.useInterimTilesOnError = value;
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.layer?.setSource(this.sourceProvider!.source!);
  }

}
