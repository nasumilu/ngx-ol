import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {MapBrowserEvent, MapEvent, Map, getUid} from 'ol';
import {filter, Observable} from 'rxjs';
import RenderEvent from 'ol/render/Event';
import {ObjectEvent} from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';
import {NgxOlMapService} from './map.service';

@Directive({
  selector: 'ol-map'
})
export class NgxOlMapDirective extends Map implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

  readonly #mapChanged = new EventEmitter<BaseEvent>();
  readonly #propertyChanged = new EventEmitter<ObjectEvent>();
  readonly #statusChanged = new EventEmitter<MapEvent>();
  readonly #renderStatus = new EventEmitter<RenderEvent>();
  readonly #mapEvent = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  readonly #mapError = new EventEmitter<BaseEvent>();

  @Output() readonly ready = new EventEmitter<NgxOlMapDirective>();

  @ContentChildren(NgxOlLayerProviderDirective) ngxLayerProviders!: QueryList<NgxOlLayerProviderDirective<never, never>>;

  constructor(private readonly mapService: NgxOlMapService) {
    super();
  }

  @Input()
  get id(): string {
    return this.get('id') ?? getUid(this);
  }

  set id(value: string) {
    this.set('id', value);
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
    this.on(
      ['dblclick', 'pointerdrag', 'pointermove', 'singleclick'],
      EventEmitter.prototype.emit.bind(this.#mapEvent)
    );

    // map status
    this.on(
      ['loadend', 'loadstart', 'moveend', 'movestart', 'postrender'],
      EventEmitter.prototype.emit.bind(this.#statusChanged)
    );

    // map error
    this.on('error', EventEmitter.prototype.emit.bind(this.#mapError));

    // renderer status
    this.on(
      ['postcompose', 'precompose', 'rendercomplete'],
      EventEmitter.prototype.emit.bind(this.#renderStatus)
    );

    // map changed
    this.on('change', EventEmitter.prototype.emit.bind(this.#mapChanged));
    this.ready.emit(this);
  }

  ngAfterContentInit(): void {
    this.ngxLayerProviders?.forEach(layerProvider => {
      const layer = layerProvider.layer;
      if (layer) {
        this.addLayer(layer);
      }
    });
  }

  ngAfterViewInit() {
    this.mapService.addMap(this);
  }

  ngOnDestroy() {
    this.un('propertychange', EventEmitter.prototype.emit.bind(this.#propertyChanged));

    // map events
    this.un(
      ['dblclick', 'pointerdrag', 'pointermove', 'singleclick'],
      EventEmitter.prototype.emit.bind(this.#mapEvent)
    );

    // mpa status
    // map status
    this.un(
      ['loadend', 'loadstart', 'moveend', 'movestart', 'postrender'],
      EventEmitter.prototype.emit.bind(this.#statusChanged)
    );

    // map error
    this.un('error', EventEmitter.prototype.emit.bind(this.#mapError));

    // renderer status
    this.un(
      ['postcompose', 'precompose', 'rendercomplete'],
      EventEmitter.prototype.emit.bind(this.#renderStatus)
    );

    // map changed
    this.un('change', EventEmitter.prototype.emit.bind(this.#mapChanged));
  }
}
