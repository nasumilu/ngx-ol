import {Directive, Input} from '@angular/core';
import {parseBoolean} from 'ngx-ol-common';
import {NgxOlImageUrlSourceProviderDirective} from './image-url-source-provider.directive';
import {ImageArcGISRest, ImageMapGuide, ImageWMS} from 'ol/source';
import {Options as ImageWMSOptions} from 'ol/source/ImageWMS';
import {Options as ImageArcGISRestOptions} from 'ol/source/ImageArcGISRest';
import {Options as ImageMapGuideOptions} from 'ol/source/ImageMapGuide';

@Directive({
  selector: 'ol-image-webservice'
})
export class NgxOlImageWebserviceSourceProviderDirective<L extends ImageWMS | ImageArcGISRest | ImageMapGuide, O extends ImageWMSOptions | ImageArcGISRestOptions | ImageMapGuideOptions>
  extends NgxOlImageUrlSourceProviderDirective<L, O>{

  constructor() {
    super();
  }

  @Input({transform: parseBoolean}) get hidpi(): boolean {
    return this._options.hidpi ?? true;
  }

  set hidpi(value: boolean) {
    this._options.hidpi = value;
    if(this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input({transform: parseFloat})
  get ratio(): number {
    return this._options.ratio ?? 1.5;
  }

  set ratio(value: number) {
    this._options.ratio = value;
    if (this._options) {
      this.ngAfterContentInit();
    }
  }

  @Input() get params(): {[key: string] : string } {
    return this.source?.getParams() ?? this._options.params ?? {};
  }

  set params(value: {[key: string]: string }) {
    value = Object.assign(value, this.source?.getParams() ?? {});
    this.source?.updateParams(value);
    this._options.params = value;
  }

}
