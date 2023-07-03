import {Source} from 'ol/source';
import {Options, State} from 'ol/source/Source';
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import {ObjectEvent} from 'ol/Object';
import {Observable} from 'rxjs';
import BaseEvent from 'ol/events/Event';
import {parseBoolean} from 'ngx-ol-common';
import {ProjectionLike} from 'ol/proj';
import {NgxOlAttributionDirective} from './attribution.directive';


@Directive({
  selector: 'ol-source'
})
export class NgxOlSourceProviderDirective<S extends Source, O extends Options> implements AfterContentInit, OnDestroy {

  @ContentChildren(NgxOlAttributionDirective) ngxOlAttributions!: QueryList<NgxOlAttributionDirective>

  readonly #propertyChanged = new EventEmitter<ObjectEvent>();
  readonly #sourceError = new EventEmitter<BaseEvent>();
  readonly #sourceChanged = new EventEmitter<BaseEvent>();

  protected readonly _options = {} as O;
  protected _source?: S;


  @Output() get propertyChanged(): Observable<ObjectEvent> {
    return this.#propertyChanged;
  }

  @Output() get sourceError(): Observable<BaseEvent> {
    return this.#sourceError;
  }

  @Output() get sourceChanged(): Observable<BaseEvent> {
    return this.#sourceChanged;
  }

  get source(): S | undefined {
    return this._source;
  }

  @Input()
  get projection(): ProjectionLike | undefined {
    return this._source?.getProjection() ?? this._options.projection;
  }

  set projection(value: ProjectionLike | undefined) {
    this._options.projection = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input({transform: parseBoolean})
  get wrapX(): boolean {
    return this._options.wrapX ?? false;
  }

  set wrapX(value: boolean) {
    this._options.wrapX = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input({transform: parseBoolean})
  get interpolate(): boolean {
    return this._options.interpolate ?? false;
  }

  set interpolate(value: boolean) {
    this._options.interpolate = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  get state(): State {
    return this._source?.getState() ?? 'undefined';
  }

  @Input()
  get attributionsCollapsible(): boolean | string {
    return this._source?.getAttributionsCollapsible() ?? this._options.attributionsCollapsible ??  true;
  }

  set attributionsCollapsible(value: boolean | string ) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true';
    }
    this._options.attributionsCollapsible = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  ngAfterContentInit() {
    this._source?.on('change', EventEmitter.prototype.emit.bind(this.#sourceChanged));
    this._source?.on('error', EventEmitter.prototype.emit.bind(this.#sourceError));
    this._source?.on('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));
    this._source?.setAttributions(this.ngxOlAttributions.toArray().map(attribution => attribution.value));
  }

  ngOnDestroy(): void {
    this._source?.un('change', EventEmitter.prototype.emit.bind(this.#sourceChanged));
    this._source?.un('error', EventEmitter.prototype.emit.bind(this.#sourceError));
    this._source?.un('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));
    this._source = undefined;
  }

}
