import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlUrlTileSourceProviderDirective} from './url-tile-source-provider.directive';
import {OSM} from 'ol/source';
import {NgxOlTileSourceProviderDirective} from './tile-source-provider.directive';
import {NgxOlSourceProviderDirective} from '../ng-ol-layer/source-provider.directive';

@Directive({
  selector: 'ol-osm-source',
  providers:[
    {provide: NgxOlSourceProviderDirective, useExisting: NgxOlOsmSourceProviderDirective},
    {provide: NgxOlUrlTileSourceProviderDirective, useExisting: NgxOlOsmSourceProviderDirective},
    {provide: NgxOlTileSourceProviderDirective, useExisting: NgxOlOsmSourceProviderDirective}
  ]
})
export class NgxOlOsmSourceProviderDirective
  extends NgxOlUrlTileSourceProviderDirective<OSM> implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    this._source = new OSM(this._options);
    super.ngAfterContentInit();
  }

}
