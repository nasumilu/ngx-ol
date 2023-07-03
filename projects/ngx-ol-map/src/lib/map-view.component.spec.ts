import { TestBed } from '@angular/core/testing';
import {NgxOlMapViewComponent} from './map-view.component';
import {Projection, ProjectionLike, transform, transformExtent} from 'ol/proj';
import {Extent} from 'ol/extent';
import {Coordinate} from 'ol/coordinate';

describe('NgxOlMapContainerComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [NgxOlMapViewComponent]
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have as undefined extent until initialized', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.center = [0,0];
    component.zoom = 0;
    expect(component.extent).toBeUndefined();
    fixture.detectChanges();
    expect(component.extent).not.toBeUndefined();
  });

  it('should not call ngOnInit or ngAfterContentInit when setting initial extent', () => {
    const extent = [-20037508.34, -20048966.1, 20037508.34, 20048966.1] as Extent;
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.center = [0,0];
    component.zoom = 0;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    component.extent = extent;
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.extent).toEqual(extent);
  });

  it('should call ngOnInit or ngAfterContentInit when setting initial extent after changeDetected and re-center if not with in extent', () => {
    const extent = [-10041706, 3105490, -6948612, 5219208] as Extent;
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.center = [-12645111, 6855634] as Coordinate;
    const ngOnInitSpy = spyOn(component, 'ngOnInit').and.callThrough();
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit').and.callThrough();
    fixture.detectChanges();
    component.extent = extent;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.extent).toEqual(extent);
    expect(component.center).toEqual([-8495159, 4162349]);
  });

  it('should not call ngOnInit or ngAfterContentInit when setting initial minResolution', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    component.minResolution = 500000;
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
  });

  it('should call ngOnInit or ngAfterContentInit when setting initial minResolution after changeDetected', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.minResolution = 500000;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
  });

  it('should not call ngOnInit or ngAfterContentInit when setting initial maxResolution', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    component.maxResolution = 500000;
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
  });

  it('should call ngOnInit or ngAfterContentInit when setting initial maxResolution after changeDetected', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.maxResolution = 500000;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
  });

  it('check setter/getter for zoom', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.zoom = 10;
    fixture.detectChanges();
    expect(component.zoom).toEqual(10);
  });

  it('check setter/getter for minZoom', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.minZoom = 10;
    fixture.detectChanges();
    expect(component.minZoom).toEqual(10);
  });

  it('check setter/getter for maxZoom', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.maxZoom = 10;
    fixture.detectChanges();
    expect(component.maxZoom).toEqual(10);
  });

  it('initial value for constrainOnlyCenter should be false', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.constrainOnlyCenter).toBeFalse();
  });

  it('check getter/setter for constrainOnlyCenter, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.constrainOnlyCenter = true;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
  });


  it('check getter/setter for constrainOnlyCenter, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.constrainOnlyCenter = true;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.constrainOnlyCenter).toBeTrue();
  });


  it('initial value for smoothResolutionConstraint should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.smoothResolutionConstraint).toBeTrue();
  });

  it('check getter/setter for smoothResolutionConstraint, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.smoothResolutionConstraint = false;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.smoothResolutionConstraint).toBeFalse();
  });


  it('check getter/setter for smoothResolutionConstraint, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.smoothResolutionConstraint = false;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.smoothResolutionConstraint).toBeFalse();
  });

  /// smoothExtentConstrain

  it('initial value for smoothExtentConstraint should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.smoothExtentConstraint).toBeTrue();
  });

  it('check getter/setter for smoothExtentConstraint, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.smoothExtentConstraint = false;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.smoothExtentConstraint).toBeFalse();
  });


  it('check getter/setter for smoothExtentConstraint, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.smoothExtentConstraint = false;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.smoothExtentConstraint).toBeFalse();
  });

  /// enableRotation

  it('initial value for enableRotation should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.enableRotation).toBeTrue();
  });

  it('check getter/setter for enableRotation, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.enableRotation = false;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.enableRotation).toBeFalse();
  });


  it('check getter/setter for enableRotation, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.enableRotation = false;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.enableRotation).toBeFalse();
  });

  /// constrainRotation
  it('initial value for constrainRotation should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.constrainRotation).toBeTrue();
  });

  it('check getter/setter for constrainRotation, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.constrainRotation = false;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.constrainRotation).toBeFalse();
  });


  it('check getter/setter for constrainRotation, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.constrainRotation = false;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.constrainRotation).toBeFalse();
  });

  /// multiWorld
  it('initial value for multiWorld should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.multiWorld).toBeFalse();
  });

  it('check getter/setter for multiWorld, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.multiWorld = false;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.multiWorld).toBeFalse();
  });


  it('check getter/setter for multiWorld, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.constrainRotation = false;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.multiWorld).toBeFalse();
  });

  /// rotation
  it('initial value for rotation should be 0', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.rotation).toEqual(0);
  });

  it('check getter/setter for rotation, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.rotation = 0;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.rotation).toEqual(0);
  });


  it('check getter/setter for rotation, should not call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.rotation = 360;
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.rotation).toEqual(360);
  });

  /// constrainResolution
  it('initial value for constrainResolution should be false', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.constrainResolution).toBeFalse();
  });

  it('check getter/setter for constrainResolution, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.constrainResolution = true;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.constrainResolution).toBeTrue();
  });


  it('check getter/setter for constrainResolution, should not call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.constrainResolution = true;
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.constrainResolution).toBeTrue();
  });

  /// projection
  it('initial value for projection should be EPSG:3857', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect((component.projection as Projection).getCode()).toEqual('EPSG:3857');
  });

  it('check getter/setter for projection, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.projection = 'EPSG:4326' as ProjectionLike;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect((component.projection as Projection).getCode()).toEqual('EPSG:4326');
  });


  it('check getter/setter for projection, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit').and.callThrough();
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit').and.callThrough();
    fixture.detectChanges();
    component.projection = 'EPSG:4326' as ProjectionLike;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect((component.projection as Projection).getCode()).toEqual('EPSG:4326');
  });

  it('check getter/setter for projection, should call re-project the current view center and extent', () => {
    const extent = [-10041706,3105490,-6948612,5219208] as Extent;
    const center = [-9163461.957900353, 3585433.9739845833] as Coordinate;
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.center = center;
    component.extent = extent;
    fixture.detectChanges();
    component.projection = 'EPSG:4326' as ProjectionLike;
    expect((component.projection as Projection).getCode()).toEqual('EPSG:4326');
    const mapExtent = component.extent;
    expect(mapExtent).not.toBeUndefined();
    if (mapExtent) {
      expect(transformExtent(extent, 'EPSG:3857', 'EPSG:4326')).toEqual(component.extent);
    }
    expect(transform(center, 'EPSG:3857', 'EPSG:4326')).toEqual(component.center);
  });

  /// zoom
  it('initial value for zoom should be 0', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.zoom).toBeUndefined();
  });

  it('check getter/setter for zoom, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.zoom = 0;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.zoom).toEqual(0);
  });


  it('check getter/setter for zoom, should not call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.zoom = 5;
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.zoom).toEqual(5);
    component.zoom = undefined;
    expect(component.zoom).toBeNaN();
  });

  // showFullExtent
  it('initial value for showFullExtent should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.showFullExtent).toBeFalse();
  });

  it('check getter/setter for showFullExtent, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.showFullExtent = true;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.showFullExtent).toBeTrue();
  });


  it('check getter/setter for showFullExtent, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.showFullExtent = true;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.showFullExtent).toBeTrue();
  });

  /// zoomFactor
  it('initial value for zoomFactor should be true', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.zoomFactor).toEqual(2);
  });

  it('check getter/setter for zoomFactor, should not calling OnInit or ngAfterContentInit', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    component.zoomFactor = 5;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    expect(ngOnInitSpy.calls.count()).toEqual(0);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(0);
    expect(component.zoomFactor).toEqual(5);
  });


  it('check getter/setter for zoomFactor, should call OnInit or ngAfterContentInit after detectChanges', () => {
    const fixture = TestBed.createComponent(NgxOlMapViewComponent);
    const component = fixture.componentInstance;
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    const ngAfterContentInitSpy = spyOn(component, 'ngAfterContentInit');
    fixture.detectChanges();
    component.zoomFactor = 5;
    expect(ngOnInitSpy.calls.count()).toEqual(1);
    expect(ngAfterContentInitSpy.calls.count()).toEqual(1);
    expect(component.zoomFactor).toEqual(5);
  });

});
