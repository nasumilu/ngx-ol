import {AfterContentInit, Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {NgxOlTileSourceProviderDirective} from './tile-source-provider.directive';
import {UrlTile} from 'ol/source';
import {Options} from 'ol/source/UrlTile';
import {TileSourceEvent} from 'ol/source/Tile';
import {Observable} from 'rxjs';

@Directive({
  selector: 'ol-url-tile-source'
})
export class NgxOlUrlTileSourceProviderDirective<S extends UrlTile>
  extends NgxOlTileSourceProviderDirective<S, Options> implements AfterContentInit, OnDestroy {

  readonly #tileStatus = new EventEmitter<TileSourceEvent>();

  constructor() {
    super();
  }

  @Output() get tileStatus(): Observable<TileSourceEvent> {
    return this.#tileStatus;
  }

  @Input() get url(): string | string[] | undefined {
    return this.source?.getUrls() ?? this._options.urls;
  }

  set url(value: string | string[] | undefined) {
    if (typeof value === 'string') {
      value = [value];
    }
    this.source?.setUrls(value ?? []);
    this._options.urls = value;
  }

  override ngAfterContentInit() {
    this._source?.on('tileloadend', EventEmitter.prototype.emit.bind(this.#tileStatus));
    this._source?.on('tileloadstart', EventEmitter.prototype.emit.bind(this.#tileStatus));
    this._source?.on('tileloaderror', EventEmitter.prototype.emit.bind(this.#tileStatus));
    super.ngAfterContentInit();
  }

  override ngOnDestroy() {
    this._source?.un('tileloadend', EventEmitter.prototype.emit.bind(this.#tileStatus));
    this._source?.un('tileloadstart', EventEmitter.prototype.emit.bind(this.#tileStatus));
    this._source?.un('tileloaderror', EventEmitter.prototype.emit.bind(this.#tileStatus));
    super.ngOnDestroy();
  }

}
