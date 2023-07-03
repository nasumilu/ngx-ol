import {AfterContentInit, Directive, Input} from '@angular/core';
import {NgxOlImageSourceProviderDirective} from './image-source-provider.directive';
import {ImageWMS} from 'ol/source';
import {Options} from 'ol/source/ImageWMS';
import {ServerType} from 'ol/source/wms';
import {NgxOlImageWebserviceSourceProviderDirective} from './image-webservice-source-provider.directive';

@Directive({
  selector: 'ol-image-wms-source',
  providers: [ {provide: NgxOlImageSourceProviderDirective, useExisting: NgxOlImageWmsSourceProviderDirective}]
})
export class NgxOlImageWmsSourceProviderDirective
  extends NgxOlImageWebserviceSourceProviderDirective<ImageWMS, Options> implements AfterContentInit {

  constructor() {
    super();
  }

  @Input() get serverType(): ServerType | undefined {
    return this._options.serverType;
  }

  set serverType(value: ServerType | undefined) {
    this._options.serverType = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  override ngAfterContentInit(): void {
    this._source = new ImageWMS(this._options);
    super.ngAfterContentInit();
  }

}
