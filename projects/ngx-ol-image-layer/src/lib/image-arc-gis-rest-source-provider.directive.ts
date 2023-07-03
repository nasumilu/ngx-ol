import {AfterContentInit, Directive} from '@angular/core';
import {NgxOlImageSourceProviderDirective} from './image-source-provider.directive';
import {ImageArcGISRest} from 'ol/source';
import {Options} from 'ol/source/ImageArcGISRest';
import {NgxOlImageWebserviceSourceProviderDirective} from './image-webservice-source-provider.directive';

@Directive({
  selector: 'ol-image-arc-gis-rest',
  providers: [ {provide: NgxOlImageSourceProviderDirective, useExisting: NgxOlImageArcGisRestSourceProviderDirective}]

})
export class NgxOlImageArcGisRestSourceProviderDirective
  extends NgxOlImageWebserviceSourceProviderDirective<ImageArcGISRest, Options> implements AfterContentInit {

  constructor() {
    super();
  }

  override ngAfterContentInit(): void {
    this._source = new ImageArcGISRest(this._options);
    super.ngAfterContentInit();
  }

}
