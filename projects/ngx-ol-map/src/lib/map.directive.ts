import {
  AfterContentInit, ContentChildren, Directive, EventEmitter, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import {MapBrowserEvent, MapEvent, Map} from 'ol';
import {filter, Observable} from 'rxjs';
import RenderEvent from 'ol/render/Event';
import {NgxOlLayerProviderDirective} from 'ngx-ol-layer';
import {ObjectEvent} from 'ol/Object';
import BaseEvent from 'ol/events/Event';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ol-map'
})
export class NgxOlMapDirective extends Map implements OnInit, AfterContentInit, OnDestroy {

  readonly #mapChanged = new EventEmitter<BaseEvent>();
  readonly #propertyChanged = new EventEmitter<ObjectEvent>();
  readonly #statusChanged = new EventEmitter<MapEvent>();
  readonly #renderStatus = new EventEmitter<RenderEvent>();
  readonly #mapEvent = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  readonly #mapError = new EventEmitter<BaseEvent>();

  @ContentChildren(NgxOlLayerProviderDirective) ngxLayerProviders!: QueryList<NgxOlLayerProviderDirective<never, never, never>>;

  constructor() {
    super();
  }

  @Output() get propertyChanged(): Observable<ObjectEvent> {
    return this.#propertyChanged;
  }

  @Output() get mapChanged(): Observable<BaseEvent> {
    return this.#mapChanged;
  }
  @Output() get statusChanged(): Observable<MapEvent> {
    return this.#statusChanged;
  }
  @Output() get renderStatus(): Observable<RenderEvent> {
    return this.#renderStatus;
  }
  @Output() get mapClicked(): Observable<MapBrowserEvent<MouseEvent>> {
    return this.#mapEvent.pipe(
        filter(evt => evt.type === 'click')
      );
  }


  @Output() get mapError(): Observable<BaseEvent> {
    return this.#mapError;
  }

  ngOnInit(): void {
    this.on('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));

    // map events
    this.on('click', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.on('dblclick', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.on('pointerdrag', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.on('pointermove', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.on('singleclick', EventEmitter.prototype.emit.bind(this.#mapEvent));

    // mpa status
    this.on('loadend', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.on('loadstart', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.on('moveend', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.on('movestart', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.on('postrender', EventEmitter.prototype.emit.bind(this.#statusChanged));

    // map error
    this.on('error', EventEmitter.prototype.emit.bind(this.#mapError));

    // renderer status
    this.on('postcompose', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this.on('precompose', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this.on('rendercomplete', EventEmitter.prototype.emit.bind(this.#renderStatus));

    // map changed
    this.on('change', EventEmitter.prototype.emit.bind(this.#mapChanged));
  }

  ngAfterContentInit(): void {
    this.ngxLayerProviders?.forEach(layerProvider => {
      const layer = layerProvider.layer;
      if (layer) {
        this.addLayer(layer);
      }
    });
  }

  ngOnDestroy() {
    this.un('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));

    // map events
    this.un('click', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.un('dblclick', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.un('pointerdrag', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.un('pointermove', EventEmitter.prototype.emit.bind(this.#mapEvent));
    this.un('singleclick', EventEmitter.prototype.emit.bind(this.#mapEvent));

    // mpa status
    this.un('loadend', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.un('loadstart', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.un('moveend', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.un('movestart', EventEmitter.prototype.emit.bind(this.#statusChanged));
    this.un('postrender', EventEmitter.prototype.emit.bind(this.#statusChanged));

    // map error
    this.un('error', EventEmitter.prototype.emit.bind(this.#mapError));

    // renderer status
    this.un('postcompose', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this.un('precompose', EventEmitter.prototype.emit.bind(this.#renderStatus));
    this.un('rendercomplete', EventEmitter.prototype.emit.bind(this.#renderStatus));

    // map changed
    this.un('change', EventEmitter.prototype.emit.bind(this.#mapChanged));
  }
}
