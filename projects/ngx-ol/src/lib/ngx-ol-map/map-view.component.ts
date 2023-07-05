import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter, Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit, Optional,
  Output
} from '@angular/core';
import {ViewOptions} from 'ol/View';
import {View} from 'ol';
import {NgxOlMapDirective} from './map.directive';
import {containsCoordinate, Extent, getCenter} from 'ol/extent';
import {createProjection, ProjectionLike, transform, transformExtent} from 'ol/proj';
import {Coordinate} from 'ol/coordinate';
import {map, Observable, SchedulerLike, ThrottleConfig, throttleTime} from 'rxjs';
import {ObjectEvent} from 'ol/Object';
import BaseEvent from 'ol/events/Event';
import {parseBoolean} from '../ngx-ol-common/transform';
import {State} from 'ol/View';

export interface StateEvent {
  target: NgxOlMapViewComponent,
  state: State
}

export interface StateChangeThrottle {
  duration: number,
  scheduler?: SchedulerLike,
  config?: ThrottleConfig
}

export const STATE_CHANGE_THROTTLE = new InjectionToken<StateChangeThrottle>('StateChangeThrottleToken');

/**
 * @description
 * This is the container for an OpenLayers Map, which basically wraps a {@link View} in an Angular component.
 *
 * @example
 * // basic example, the center and zoom or resolution is required
 * <ol-map-container center="0, 0" zoom="0">
 *   <ol-map></ol-map>
 * </ol-map-container>
 *
 * // setting the maps extent
 * <ol-map-container center="0, 0" zoom="0" extent="-20037508.34, -20048966.1, 20037508.34, 20048966.1">
 *   <ol-map></ol-map>
 * </ol-map-container>
 *
 * // setting the maps projection
 * <ol-map-container center="0, 0" zoom="0" projection="EPSG:4326">
 *   <ol-map></ol-map>
 * </ol-map-container>
 *
 * @class NgxOlMapViewComponent
 * @author Michael Lucas <nasumilu@gmail.com>
 * @version 7.4.0
 * @see https://openlayers.org/en/v7.4.0/apidoc/module-ol_View-View.html
 */
@Component({
  selector: 'ol-map-view',
  template: '<div class="ngx-ol-map"></div>',
  styles: ['.ngx-ol-map { width: 100%; height: 100%; }']
})
export class NgxOlMapViewComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

  #ready = new EventEmitter<NgxOlMapViewComponent>();
  #stateChanged = new EventEmitter<StateEvent>;
  #zoomChange?: Observable<number>;
  #resolutionChange?: Observable<number>;
  #centerChange?: Observable<Coordinate>;
  #rotationChange?: Observable<number>;

  #minResolutionChange?: EventEmitter<number>;
  #maxResolutionChange?: EventEmitter<number>;
  #minZoomChange?: EventEmitter<number>;
  #maxZoomChange?: EventEmitter<number>;

  readonly #viewError = new EventEmitter<BaseEvent>();
  readonly #viewChanged = new EventEmitter<BaseEvent>();

  /**
   * @description
   * The {@link ViewOptions} used to initialize the {@link NgxOlMapViewComponent}'s {@link View}
   * @private
   * @readonly
   * @see https://openlayers.org/en/v7.4.0/apidoc/module-ol_View-View.html
   */
  readonly #options: ViewOptions = {};

  /**
   * @description
   * The {@link View}, which is instantiated in the {@link NgxOlMapViewComponent#ngOnInit}
   * @private
   * @see https://openlayers.org/en/v7.4.0/apidoc/module-ol_View-View.html
   */
  #view?: View;

  /**
   * @description
   * The {@link NgxOlMapDirective} which this {@link NgxOlMapViewComponent}'s {@link View} is
   * applied.
   *
   * @private
   */
  @ContentChild(NgxOlMapDirective) mapDirective?: NgxOlMapDirective;

  constructor(private readonly ele: ElementRef,
              @Optional() @Inject(STATE_CHANGE_THROTTLE) private readonly stateChangeThrottle?: StateChangeThrottle) {
  }

  /**
   * @description
   *
   * Sets extent that constrains the view, in other words, nothing outside of this extent can be visible on the map.
   */
  @Input()
  get extent(): Extent | string | undefined {
    return this.#options.extent ?? this.#view?.getProjection().getExtent();
  }

  /**
   * @description
   * Sets extent that constrains the view, in other words, nothing outside of this extent can be visible on the map.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set extent(value: Extent | string | undefined) {
    if (typeof value === 'string') {
      value = value.split(',').map(parseFloat).slice(0, 4);
    }
    this.#options.extent = value as Extent | undefined;
    const center = this.center as Coordinate | undefined;
    if (this.#view) {
      this.#options.center = value && center && !containsCoordinate(value, center) ? getCenter(value) : center;
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets he minimum resolution used to determine the resolution constraint. It is used together with maxResolution
   * (or minZoom) and zoomFactor. If unspecified it is calculated assuming 29 zoom levels (with a factor of 2). If the
   * projection is Spherical Mercator (the default) then minResolution defaults to
   * 40075016.68557849 / 256 / Math.pow(2, 28) = 0.0005831682455839253
   */
  @Input()
  get minResolution(): number | string | undefined {
    return this.#view?.getMinResolution() ?? this.#options.minResolution;
  }

  /**
   * @description
   * Sets the minimum resolution used to determine the resolution constraint.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set minResolution(value: number | undefined | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    this.#options.minResolution = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
    (this.minResolutionChange as EventEmitter<number>)?.emit(value);
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View} minimum resolution changes.
   */
  @Output() get minResolutionChange(): Observable<number> {
    if (!this.#minResolutionChange) {
      this.#minResolutionChange = new EventEmitter<number>();
    }
    return this.#minResolutionChange;
  }

  /**
   * @description
   * Gets the maximum resolution used to determine the resolution constraint. It is used together with minResolution
   * (or maxZoom) and zoomFactor. If unspecified it is calculated in such a way that the projection's validity extent
   * fits in a 256x256 px tile. If the projection is Spherical Mercator (the default) then maxResolution defaults to
   * 40075016.68557849 / 256 = 156543.03392804097.
   */
  @Input()
  get maxResolution(): number | string | undefined {
    return this.#view?.getMaxResolution() ?? this.#options.maxResolution;
  }

  /**
   * @description
   * Sets the maximum resolution used to determine the resolution constraint.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set maxResolution(value: number | string | undefined) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    this.#options.maxResolution = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
    (this.maxResolutionChange as EventEmitter<number>)?.emit(value);
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View} maximum resolution changes.
   */
  @Output() get maxResolutionChange(): Observable<number> {
    if (!this.#maxResolutionChange) {
      this.#maxResolutionChange = new EventEmitter<number>();
    }
    return this.#maxResolutionChange;
  }

  /**
   * @description
   * Gets the minimum zoom level used to determine the resolution constraint. It is used together with maxZoom
   * (or minResolution) and zoomFactor. Note that if maxResolution is also provided, it is given precedence over minZoom.
   */
  @Input()
  get minZoom(): number | string {
    return this.#view?.getMinZoom() ?? this.#options.minZoom ?? 0;
  }

  /**
   * @description
   * Sets the minimum zoom level used to determine the resolution constraint. It is used together with maxZoom
   * (or minResolution) and zoomFactor. Note that if maxResolution is also provided, it is given precedence over minZoom.
   */
  set minZoom(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    value ??= 0;
    this.#view?.setMinZoom(value);
    this.#options.minZoom = value;
    (this.minZoomChange as EventEmitter<number>).emit(value);
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View} minimum zoom changes.
   */
  @Output() get minZoomChange(): Observable<number> {
    if (!this.#minZoomChange) {
      this.#minZoomChange = new EventEmitter<number>();
    }
    return this.#minZoomChange;
  }

  /**
   * @description
   * Gets the maximum zoom level used to determine the resolution constraint. It is used together with minZoom
   * (or maxResolution) and zoomFactor. Note that if minResolution is also provided, it is given precedence over maxZoom.
   */
  @Input()
  get maxZoom(): number | string {
    return this.#view?.getMaxZoom() ?? this.#options.maxZoom ?? 28;
  }

  /**
   * @description
   * Sets the maximum zoom level used to determine the resolution constraint. It is used together with minZoom
   * (or maxResolution) and zoomFactor. Note that if minResolution is also provided, it is given precedence over maxZoom.
   * @param value
   */
  set maxZoom(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    value ??= 28;
    this.#options.maxZoom = value;
    this.#view?.setMaxZoom(value);
    (this.maxZoomChange as EventEmitter<number>).emit(value);
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View} maximum zoom changes.
   */
  @Output()
  get maxZoomChange(): Observable<number> {
    if (!this.#maxZoomChange) {
      this.#maxZoomChange = new EventEmitter<number>();
    }
    return this.#maxZoomChange;
  }

  /**
   * @description
   * Gets the constrainOnlyCenter. If true, the extent constraint will only apply to the view center and not the whole
   * extent.
   */
  @Input()
  get constrainOnlyCenter(): boolean | string {
    return this.#options.constrainOnlyCenter ?? false;
  }

  /**
   * @description
   * Sets the constrainOnlyCenter. If true, the extent constraint will only apply to the view center and not the whole
   * extent.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set constrainOnlyCenter(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }
    this.#options.constrainOnlyCenter = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets smooth extent constraint. If true, the extent constraint will be applied smoothly, i.e. allow the view to go
   * slightly outside the given extent.
   */
  @Input()
  get smoothExtentConstraint(): boolean | string {
    return this.#options.smoothExtentConstraint ?? true;
  }

  /**
   * @description
   * Sets smooth extent constraint. If true, the extent constraint will be applied smoothly, i.e. allow the view to go
   * slightly outside the given extent.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set smoothExtentConstraint(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }
    this.#options.smoothExtentConstraint = value;
    if (this.#view) {
      this.#viewInit();
    }
  }

  /**
   * @description
   * Gets the enable rotation. If false, a rotation constraint that always sets the rotation to zero is
   * used. The constrainRotation option has no effect if enableRotation is false.
   */
  @Input()
  get enableRotation(): boolean | string {
    return this.#options.enableRotation ?? true;
  }

  /**
   * @description
   * Sets the enable rotation. If false, a rotation constraint that always sets the rotation to zero is
   * used. The constrainRotation option has no effect if enableRotation is false.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set enableRotation(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }

    this.#options.enableRotation = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets the rotation constraint. false means no constraint. true means no constraint, but snap to zero near zero.
   * A number constrains the rotation to that number of values. For example, 4 will constrain the rotation to 0, 90,
   * 180, and 270 degrees.
   */
  @Input()
  get constrainRotation(): boolean | number | string {
    return this.#options.constrainRotation ?? true;
  }

  /**
   * @description
   * Sets the rotation constraint. false means no constraint. true means no constraint, but snap to zero near zero.
   * A number constrains the rotation to that number of values. For example, 4 will constrain the rotation to 0, 90,
   * 180, and 270 degrees.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set constrainRotation(value: number | string | boolean) {
    if (typeof value === 'string') {
      value = isNaN(parseInt(value)) ? value === 'true' : parseInt(value);
    }
    this.#options.constrainRotation = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets the multi-world constraint. If false the view is constrained so only one world is visible, and you cannot pan
   * off the edge. If true the map may show multiple worlds at low zoom levels. Only used if the projection is global.
   * Note that if extent is also provided it is given precedence.
   */
  @Input()
  get multiWorld(): boolean | string {
    return this.#options.multiWorld ?? false;
  }

  /**
   * @description
   * Sets the multi-world constraint. If false the view is constrained so only one world is visible, and you cannot pan
   * off the edge. If true the map may show multiple worlds at low zoom levels. Only used if the projection is global.
   * Note that if extent is also provided it is given precedence.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set multiWorld(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }
    this.#options.multiWorld = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets the rotation for the view in degrees (positive rotation clockwise, 0 means North).
   */
  @Input()
  get rotation(): number | string {
    const value = (this.#view?.getRotation() ?? 0) * 180 / Math.PI * -1;
    // wtf is negative zero (-0)
    return 0 == value ? 0 : value;
  }


  /**
   * @description
   * Sets the rotation for the view in degrees (positive rotation clockwise, 0 means North).
   */
  set rotation(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    value = -1 * value * Math.PI / 180;
    this.#view?.setRotation(value);
    this.#options.rotation = value;
  }

  /**
   * @description
   */
  @Output()
  get rotationChanged(): Observable<number> {
    if (!this.#rotationChange) {
      this.#rotationChange = this.#stateChanged.pipe(
        map(evt => evt.state.rotation)
      );
    }
    return this.#rotationChange;
  }

  /**
   * @description
   * Get the resolution constraint. If true, the view will always animate to the closest zoom level after an interaction;
   * false means intermediary zoom levels are allowed.
   */
  @Input()
  get constrainResolution(): boolean | string {
    return this.#options.constrainResolution ?? false;
  }

  /**
   * @description
   * Set the resolution constraint. If true, the view will always animate to the closest zoom level after an interaction;
   * false means intermediary zoom levels are allowed.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set constrainResolution(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }
    this.#view?.setConstrainResolution(value);
    this.#options.constrainResolution = value;
  }

  /**
   * @description
   * Gets smooth resolution constraint. If true, the resolution min/max values will be applied smoothly, i.e. allow the
   * view to exceed slightly the given resolution or zoom bounds.
   */
  @Input()
  get smoothResolutionConstraint(): boolean | string {
    return this.#options.smoothResolutionConstraint ?? true;
  }

  /**
   * @description
   * Sets smooth resolution constraint. If true, the resolution min/max values will be applied smoothly, i.e. allow the
   * view to exceed slightly the given resolution or zoom bounds.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set smoothResolutionConstraint(value: boolean | string) {
    if (typeof value === 'string') {
      value = value.toLowerCase() === 'true' || value === '1';
    }
    this.#options.smoothResolutionConstraint = value;
    if (this.#view) {
      this.#viewInit();
    }
  }

  /**
   * @description
   * Gets the projection. The default is Spherical Mercator.
   */
  @Input() get projection(): ProjectionLike {
    return this.#view?.getProjection() ?? this.#options.projection;
  }

  /**
   * @description
   * Sets the projection.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set projection(value: ProjectionLike) {
    value = createProjection(value, 'EPSG:3857');
    this.#options.projection = value;

    if (this.#view) {

      if (this.#options.zoom) {
        this.#options.zoom = this.#view.getZoom();
      }

      if (this.#options.resolution) {
        this.#options.resolution = this.#view.getResolution();
      }

      let center = this.#view.getCenter();
      const projection = this.#view.getProjection();

      if (this.#options.extent) {
        this.#options.extent = transformExtent(this.#options.extent, projection, value);
      }

      if (center) {
        center = transform(center, projection, value);
        this.#options.center = containsCoordinate(value.getExtent(), center) ? center : value.getExtent();
      }

      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Sets the resolution for the view. The units are projection units per pixel (e.g. meters per pixel). An alternative
   * to setting this is to set zoom. Layer sources will not be fetched if neither this nor zoom are defined, but they
   * can be set later with this property or {@link NgxOlMapViewComponent#zoom}.
   */
  @Input()
  get resolution(): number | string {
    return this.#view?.getResolution() ?? this.#options.resolution ?? 0;
  }

  /**
   * @description
   * Sets the resolution for the view. The units are projection units per pixel (e.g. meters per pixel). An alternative
   * to setting this is to set zoom. Layer sources will not be fetched if neither this nor zoom are defined, but they
   * can be set later with this property or {@link NgxOlMapViewComponent#zoom}.
   */
  set resolution(value: number | string) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    this.#view?.setResolution(value);
    this.#options.resolution = value;
  }

  /**
   * @description
   * {@link Observable<number} when the {@link View} resolution changes.
   */
  @Output() get resolutionChange(): Observable<number> {
    if (!this.#resolutionChange) {
      this.#resolutionChange = this.stateChanged.pipe(
        map(evt => evt.state.resolution)
      );
    }
    return this.#resolutionChange;
  }

  /**
   * @description
   * Sets the center for the view. If a user projection is not set, the coordinate system for the center is specified
   * with the projection option. Layer sources will not be fetched if this is not set, but the center can be set later.
   */
  @Input()
  get center(): Coordinate | string | undefined {
    return this.#view?.getCenter() ?? this.#options.center;
  }

  /**
   * @description
   * Gets the center for the view. If a user projection is not set, the coordinate system for the center is specified
   * with the projection option. Layer sources will not be fetched if this is not set, but the center can be set later.
   */
  set center(value: Coordinate | string | undefined) {
    if (typeof value === 'string') {
      value = value.split(',').map(parseFloat);
    }
    this.#view?.setCenter(value);
    this.#options.center = value;
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View}'s center changes.
   */
  @Output() get centerChange(): Observable<Coordinate> {
    if (!this.#centerChange) {
      this.#centerChange = this.stateChanged.pipe(
        map(evt => evt.state.center)
      );
    }
    return this.#centerChange;
  }

  /**
   * @description
   * Gets the zoom, only used if resolution is not defined. Zoom level used to calculate the initial resolution for the
   * view.
   */
  @Input()
  get zoom(): number | string | undefined {
    return this.#view?.getZoom() ?? this.#options.zoom;
  }

  /**
   * @description
   * Sets the zoom, only used if resolution is not defined. Zoom level used to calculate the initial resolution for the
   * view.
   */
  set zoom(value: number | string | undefined) {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    this.#view?.setZoom(value ?? NaN);
    this.#options.zoom = value;
  }

  /**
   * @description
   * {@link Observable<number>} emitted when the {@link View} zoom changes.
   */
  @Output() get zoomChange(): Observable<number> {
    if (!this.#zoomChange) {
      this.#zoomChange = this.stateChanged.pipe(
        map(evt => evt.state.zoom)
      );
    }
    return this.#zoomChange;
  }

  /**
   * @description
   * Gets whether the view is allowed to be zoomed out to show the full configured extent. By default, when a view is
   * configured with an extent, users will not be able to zoom out so the viewport exceeds the extent in either
   * dimension. This means the full extent may not be visible if the viewport is taller or wider than the aspect ratio
   * of the configured extent. If showFullExtent is true, the user will be able to zoom out so that the viewport
   * exceeds the height or width of the configured extent, but not both, allowing the full extent to be shown.
   */
  @Input({transform: parseBoolean})
  get showFullExtent(): boolean {
    return this.#options.showFullExtent ?? false;
  }

  /**
   * @description
   * Sets whether the view is allowed to be zoomed out to show the full configured extent. By default, when a view is
   * configured with an extent, users will not be able to zoom out so the viewport exceeds the extent in either
   * dimension. This means the full extent may not be visible if the viewport is taller or wider than the aspect ratio
   * of the configured extent. If showFullExtent is true, the user will be able to zoom out so that the viewport
   * exceeds the height or width of the configured extent, but not both, allowing the full extent to be shown.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set showFullExtent(value: boolean) {
    this.#options.showFullExtent = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  /**
   * @description
   * Gets the zoom factor used to compute the corresponding resolution.
   */
  @Input({transform: parseFloat})
  get zoomFactor(): number {
    return this.#options.zoomFactor ?? 2;
  }

  /**
   * @description
   * Sets the zoom factor used to compute the corresponding resolution.
   *
   * > <strong>IMPORTANT:</strong>
   *
   * > Setting this value after the initial detect changes will instantiate a new {@link View}.
   */
  set zoomFactor(value: number) {
    this.#options.zoomFactor = value;
    if (this.#view) {
      this.ngOnInit();
      this.ngAfterContentInit();
    }
  }

  @Output() get viewError(): Observable<BaseEvent> {
    return this.#viewError;
  }

  @Output() get viewChanged(): Observable<BaseEvent> {
    return this.#viewChanged;
  }

  @Output()
  get stateChanged(): Observable<StateEvent> {
    if (this.stateChangeThrottle) {
      return this.#stateChanged.pipe(
        throttleTime(this.stateChangeThrottle.duration, this.stateChangeThrottle.scheduler, this.stateChangeThrottle.config)
      );
    }
    return this.#stateChanged;
  }

  @Output()
  get ready(): Observable<NgxOlMapViewComponent> {
    return this.#ready;
  }

  #fireStateChange(evt: ObjectEvent): void {
    try {
      this.#stateChanged.emit({
        target: this,
        state: evt.target.getState()
      });
    } catch (error) {
      console.error(error);
    }
  }

  #viewInit(): void {
    this.#options.center = this.#view?.getCenter();
    this.#options.resolution = this.#view?.getResolution();
    this.ngOnInit();
    this.ngAfterContentInit();
  }

  /**
   * @internal
   */
  ngOnInit(): void {
    this.#view = new View(this.#options);
    this.#view?.on('propertychange', this.#fireStateChange.bind(this));
    this.#view.on('error', EventEmitter.prototype.emit.bind(this.#viewError));
    this.#view.on('change', EventEmitter.prototype.emit.bind(this.#viewChanged));
    this.#ready.emit(this);
  }

  /**
   * @description
   * Lifecycle hook which performs:
   *
   * 1. Logs a warning message if no content child NgxOlMapDirective (<ol-map>) is found.
   * 2. Sets the maps view
   *
   * @see NgxOlMapDirective#setView
   * @internal
   */
  ngAfterContentInit(): void {
    // 1. Log warning if no ol-map content child found
    if (!this.mapDirective) {
      console.warn('Using the <ol-map-container> without a child <ol-map>!');
    }
    // 2. Set the map's view
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.mapDirective?.setView(this.#view!);
  }

  /**
   * @internal
   */
  ngAfterViewInit(): void {
    if (this.ele.nativeElement.tabIndex > -1) {
      this.ele.nativeElement.firstChild.tabIndex = this.ele.nativeElement.tabIndex;
      this.ele.nativeElement.tabIndex = -1;
    }
    this.mapDirective?.setTarget(this.ele.nativeElement.firstChild);
  }

  /**
   * @internal
   */
  ngOnDestroy(): void {
    this.#view?.un('propertychange', this.#fireStateChange.bind(this));
    this.#view?.un('error', EventEmitter.prototype.emit.bind(this.#viewError));
    this.#view?.un('change', EventEmitter.prototype.emit.bind(this.#viewChanged));
    this.#view = undefined;
  }
}
