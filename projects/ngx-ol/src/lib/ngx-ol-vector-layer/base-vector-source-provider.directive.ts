import {Directive, Input} from '@angular/core';
import {Vector} from 'ol/source';
import {LoadingStrategy, Options} from 'ol/source/Vector';
import {Collection, Feature} from 'ol';
import FeatureFormat from 'ol/format/Feature';
import {FeatureLoader, FeatureUrlFunction} from 'ol/featureloader';
import {all} from 'ol/loadingstrategy';
import {NgxOlSourceProviderDirective} from '../ng-ol-layer/source-provider.directive';

@Directive({
  selector: 'ol-base-vector-source'
})
export class NgxOlBaseVectorSourceProviderDirective<S extends Vector, O extends Options>
  extends NgxOlSourceProviderDirective<S, O> {

  constructor() {
    super();
  }

  @Input()
  get features(): Feature[] | Collection<Feature> {
    return this._source?.getFeatures() ?? this._options.features ?? [];
  }

  set features(value: Feature[] | Collection<Feature>) {
    if (Array.isArray(value)) {
      value = new Collection(value);
    }
    this._options.features = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get format(): FeatureFormat | undefined {
    return this._source?.getFormat() ?? this._options.format;
  }

  set format(value: FeatureFormat | undefined) {
    this._options.format = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get url(): string | FeatureUrlFunction {
    return this._source?.getUrl() ?? this._options.url ?? '';
  }

  set url(value: string | FeatureUrlFunction) {
    this._options.url = value;
    this._source?.setUrl(value);
  }

  @Input()
  get useSpatialIndex(): boolean {
    return this._options.useSpatialIndex ?? true;
  }

  set useSpatialIndex(value: boolean) {
    this._options.useSpatialIndex = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get overlaps(): boolean {
    return this._options.overlaps ?? true;
  }

  set overlaps(value: boolean) {
    this._options.overlaps = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get strategy(): LoadingStrategy {
    return this._options.strategy ?? all;
  }

  set strategy(value: LoadingStrategy) {
    this._options.strategy = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

  @Input()
  get loader(): FeatureLoader | undefined {
    return this._options.loader;
  }

  set loader(value: FeatureLoader | undefined) {
    this._options.loader = value;
    if (this._source) {
      this.ngAfterContentInit();
    }
  }

}
