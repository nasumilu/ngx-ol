import {NgModule} from '@angular/core';
import {NgxOlBaseTileLayerProviderDirective} from './base-tile-layer-provider.directive';
import {NgxOlTileSourceProviderDirective} from './tile-source-provider.directive';
import {NgxOlLayerModule} from 'ngx-ol-layer';
import { NgxOlTileLayerProviderDirective } from './tile-layer-provider.directive';
import {NgxOlCommonModule} from 'ngx-ol-common';
import { NgxOlUrlTileSourceProviderDirective } from './url-tile-source-provider.directive';
import { NgxOlXyzSourceProviderDirective } from './xyz-source-provider.directive';
import { NgxOlOsmSourceProviderDirective } from './osm-source-provider.directive';


@NgModule({
  declarations: [
    NgxOlBaseTileLayerProviderDirective,
    NgxOlTileSourceProviderDirective,
    NgxOlTileLayerProviderDirective,
    NgxOlUrlTileSourceProviderDirective,
    NgxOlXyzSourceProviderDirective,
    NgxOlOsmSourceProviderDirective
  ],
  imports: [
    NgxOlCommonModule,
    NgxOlLayerModule
  ],
  exports: [
    NgxOlTileLayerProviderDirective,
    NgxOlXyzSourceProviderDirective,
    NgxOlOsmSourceProviderDirective
  ]
})
export class NgxOlTileLayerModule {
}
