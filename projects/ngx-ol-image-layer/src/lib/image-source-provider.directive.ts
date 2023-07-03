import {AfterContentInit, Directive, EventEmitter, Input, OnDestroy} from '@angular/core';
import ImageSource, {ImageSourceEvent} from 'ol/source/Image';
import {Options} from 'ol/source/Image';
import {NgxOlSourceProviderDirective} from 'ngx-ol-layer';
import {Observable} from 'rxjs';

@Directive({
  selector: 'ol-image-source'
})
export class NgxOlImageSourceProviderDirective<S extends ImageSource, O extends Options>
  extends NgxOlSourceProviderDirective<S, O> implements AfterContentInit, OnDestroy {

  protected _imageStatus = new EventEmitter<ImageSourceEvent>();

  constructor() {
    super();
  }

  get imageStatus(): Observable<ImageSourceEvent> {
    return this._imageStatus;
  }

  @Input()
  get resolutions(): number[] | undefined {
    return this._source?.getResolutions() ?? this._options.resolutions;
  }

  set resolutions(value: number[] | undefined) {
    this._source?.setResolutions(value ?? null);
    this._options.resolutions = value;
  }


  override ngAfterContentInit() {
    this.source?.on('imageloadend', EventEmitter.prototype.emit.bind(this._imageStatus));
    this.source?.on('imageloadstart', EventEmitter.prototype.emit.bind(this._imageStatus));
    this.source?.on('imageloaderror', EventEmitter.prototype.emit.bind(this._imageStatus));
    super.ngAfterContentInit();
  }

  override ngOnDestroy() {
    this.source?.un('imageloadend', EventEmitter.prototype.emit.bind(this._imageStatus));
    this.source?.un('imageloadstart', EventEmitter.prototype.emit.bind(this._imageStatus));
    this.source?.un('imageloaderror', EventEmitter.prototype.emit.bind(this._imageStatus));
    super.ngOnDestroy();
  }
}
