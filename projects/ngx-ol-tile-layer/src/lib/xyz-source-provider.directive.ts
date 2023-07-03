import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlUrlTileSourceProviderDirective} from './url-tile-source-provider.directive';
import {XYZ} from 'ol/source';
import {NgxOlTileSourceProviderDirective} from './tile-source-provider.directive';
import {NgxOlSourceProviderDirective} from 'ngx-ol-layer';


@Directive({
  selector: 'ol-xyz-source',
  providers: [
    {provide: NgxOlSourceProviderDirective, useExisting: NgxOlXyzSourceProviderDirective},
    {provide: NgxOlUrlTileSourceProviderDirective, useExisting: NgxOlXyzSourceProviderDirective},
    {provide: NgxOlTileSourceProviderDirective, useExisting: NgxOlXyzSourceProviderDirective}
  ]
})
export class NgxOlXyzSourceProviderDirective
  extends NgxOlUrlTileSourceProviderDirective<XYZ> implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    this._source = new XYZ(this._options);
    super.ngAfterContentInit();
  }

}
