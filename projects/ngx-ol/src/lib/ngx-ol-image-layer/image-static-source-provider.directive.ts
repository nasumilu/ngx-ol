import {AfterContentInit, Directive, Input} from '@angular/core';
import {NgxOlImageUrlSourceProviderDirective} from './image-url-source-provider.directive';
import Static from 'ol/source/ImageStatic';
import {Options} from 'ol/source/ImageStatic';
import {ImageStatic} from 'ol/source';
import {Size} from 'ol/size';
import {Extent} from 'ol/extent';
import {parseNumericCsv} from '../ngx-ol-common/transform';

@Directive({
  selector: 'ol-static-image'
})
export class NgxOlImageStaticSourceProviderDirective
  extends NgxOlImageUrlSourceProviderDirective<Static, Options> implements AfterContentInit {

  constructor() {
    super();
  }

  @Input({transform: parseNumericCsv})
  get imageSize(): Size | undefined {
    return this._options.imageSize;
  }

  set imageSize(value: Size | undefined ) {
    this._options.imageSize = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input({transform: parseNumericCsv})
  get imageExtent(): Extent | undefined {
    return this._source?.getImageExtent() ?? this._options.imageExtent;
  }

  set imageExtent(value: Extent | undefined) {
    this._options.imageExtent = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  override ngAfterContentInit(): void {
    this._source = new ImageStatic(this._options);
    super.ngAfterContentInit();
  }

}
