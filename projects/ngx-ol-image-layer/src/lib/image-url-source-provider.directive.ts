import {Directive, Input} from '@angular/core';
import {NgxOlImageSourceProviderDirective} from './image-source-provider.directive';
import {ImageArcGISRest, ImageMapGuide, ImageStatic, ImageWMS} from 'ol/source';
import {Options as ImageWMSOptions} from 'ol/source/ImageWMS'
import {Options as ImageArcGISRestOptions} from 'ol/source/ImageArcGISRest'
import {Options as ImageMapGuideOptions} from 'ol/source/ImageMapGuide'
import {Options as ImageStaticOptions} from 'ol/source/ImageStatic'

@Directive({
  selector: 'ol-url-image'
})
export class NgxOlImageUrlSourceProviderDirective<L extends ImageStatic | ImageWMS | ImageArcGISRest | ImageMapGuide, O extends ImageStaticOptions | ImageWMSOptions | ImageArcGISRestOptions | ImageMapGuideOptions>
  extends NgxOlImageSourceProviderDirective<L, O> {

  constructor() {
    super();
  }

  @Input() get crossOrigin(): null | string | undefined {
    return this._options.crossOrigin;
  }

  set crossOrigin(value: null | string | undefined) {
    this._options.crossOrigin = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input() get url(): string | undefined {
    if (this._source && (this._source instanceof ImageWMS || this._source instanceof ImageArcGISRest)) {
      return this._source.getUrl();
    }
    return this._options.url;
  }

  set url(value: string | undefined) {
    if (this._source && (this._source instanceof ImageWMS || this._source instanceof ImageArcGISRest)) {
      this._source.setUrl(value);
    }
    this._options.url = value;
    if (this._source && (this._source instanceof ImageMapGuide || this._source instanceof ImageStatic)) {
      this.ngAfterContentInit();
    }

  }

}
