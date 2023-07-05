/*
 * Copyright 2023 Michael Lucas <nasumilu.@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Layer} from 'ol/layer';
import {Options} from 'ol/layer/Layer';
import {Source} from 'ol/source';
import {AfterContentInit, Directive, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Extent} from 'ol/extent';
import {Observable} from 'rxjs';
import RenderEvent from 'ol/render/Event';
import {ObjectEvent} from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import {parseBoolean, parseNumericCsv} from '../ngx-ol-common/transform';


@Directive({selector: 'ol-layer'})
export class NgxOlLayerProviderDirective<L extends Layer, S extends Source, O extends Options<S>>
  implements AfterContentInit, OnDestroy {

  readonly #renderStatus = new EventEmitter<RenderEvent>();
  readonly #propertyChanged = new EventEmitter<ObjectEvent>();
  readonly #layerError = new EventEmitter<BaseEvent>();

  protected _layer?: L;
  protected readonly _options = {} as O;

  @Output() get layerError(): Observable<BaseEvent> {
    return this.#layerError;
  }

  @Output() get renderStatus(): Observable<RenderEvent> {
    return this.#renderStatus;
  }

  @Output() get propertyChanged(): Observable<ObjectEvent> {
    return this.#propertyChanged;
  }

  @Input() get class(): string {
    return this._layer?.getClassName() ?? this._options.className ?? 'ol-layer';
  }

  set class(value: string)  {
    this._options.className = value;
    if (this._layer) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get name(): string | undefined {
    return this._layer?.get('name') ?? (this._options.properties?['name'] : undefined);
  }

  set name(value: string | undefined) {
    this._layer?.set('name', value);
    if (!this._options.properties) {
      this._options.properties = {};
    }
    this._options.properties['name'] = value;
  }

  @Input({transform: parseNumericCsv})
  get extent(): Extent | undefined {
    return this._layer?.getExtent() ?? this._options.extent;
  }

  set extent(value: Extent | undefined) {
    this._layer?.setExtent(value);
    this._options.extent = value;
  }

  @Input({transform: parseInt})
  get zIndex(): number | undefined {
    return this._layer?.getZIndex() ?? this._options.zIndex;
  }

  set zIndex(value: number | undefined) {
    value ??= 0;
    this._layer?.setZIndex(value);
    this._options.zIndex = value;
  }

  @Input({transform: parseFloat})
  get opacity(): number  {
    return this._layer?.getOpacity() ?? this._options.opacity ?? 1.0;
  }

  set opacity(value: number) {
    if (value < 0 || value > 1.0) {
      throw Error(`Layer opacity must be between 0 and 1.0, found ${value}!`);
    }
    this._layer?.setOpacity(value);
    this._options.opacity = value;
  }

  @Input({transform: parseBoolean})
  get visible(): boolean {
    return this._layer?.getVisible() ?? this._options.visible ?? true;
  }

  set visible(value: boolean) {
    this._layer?.setVisible(value);
    this._options.visible = value;
  }

  @Input({transform: parseFloat})
  get minZoom(): number | undefined {
    return this._layer?.getMinZoom() ?? this._options.minZoom;
  }

  set minZoom(value: number | undefined) {
    value ??= 0;
    this._layer?.setMinZoom(value);
    this._options.minZoom = value;
  }

  @Input({transform: parseFloat})
  get minResolution(): number | undefined {
    return this._layer?.getMinResolution() ?? this._options.minResolution;
  }

  set minResolution(value: number | undefined) {
    value ??= 0;
    this._layer?.setMinResolution(value);
    this._options.minResolution = value;
  }

  @Input({transform: parseFloat})
  get maxZoom(): number | undefined {
    return this._layer?.getMaxZoom() ?? this._options.maxZoom;
  }

  set maxZoom(value: number | undefined) {
    value ??= 28;
    this._layer?.setMaxZoom(value);
    this._options.maxZoom = value;
  }

  @Input({transform: parseFloat})
  get maxResolution(): number | undefined {
    return this._layer?.getMaxResolution() ?? this._options.maxResolution;
  }

  set maxResolution(value: number | undefined) {
    value ??= 28;
    this._layer?.setMaxResolution(value);
    this._options.maxResolution = value;
  }

  get layer(): L | undefined {
    return this._layer;
  }


  @Input() get properties() : {[key: string]: unknown} | undefined {
    return this.layer?.getProperties() ?? this._options.properties;
  }

  set properties(value: {[p: string]: unknown } | undefined) {
    value = Object.assign(value ?? {}, this.layer?.getProperties() ?? this._options.properties);
    this.layer?.setProperties(value);
    this._options.properties = value;
  }

  ngAfterContentInit() {
    this._layer?.on('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));
    this._layer?.on('postrender', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this._layer?.on('prerender', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this._layer?.on('error', EventEmitter.prototype.emit.bind(this.#layerError));
  }

  ngOnDestroy(): void {
    this._layer?.un('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));
    this._layer?.un('postrender', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this._layer?.un('prerender',  EventEmitter.prototype.emit.bind(this.#renderStatus));
    this._layer?.un('error',  EventEmitter.prototype.emit.bind(this.#layerError));
    this._layer = undefined;
  }

}
