import {AfterContentInit, ContentChild, Directive, Input} from '@angular/core';
import BaseVectorLayer from 'ol/layer/BaseVector';
import VectorSource from 'ol/source/Vector';
import {Options} from 'ol/layer/BaseVector';
import {NgxOlBaseVectorSourceProviderDirective} from './base-vector-source-provider.directive';
import {StyleLike} from 'ol/style/Style';
import {FlatStyleLike} from 'ol/style/flat';
import {NgxOlLayerProviderDirective} from '../ng-ol-layer/layer-provider.directive';

@Directive({
  selector: 'ol-base-vector-layer'
})
export class NgxOlBaseVectorLayerProviderDirective<L extends BaseVectorLayer<S, any>, S extends VectorSource>
  extends NgxOlLayerProviderDirective<L, Options<S>> implements AfterContentInit {

  @ContentChild(NgxOlBaseVectorSourceProviderDirective) sourceProvider?: NgxOlBaseVectorSourceProviderDirective<S, never>;

  constructor() {
    super();
  }

  @Input()
  get style(): StyleLike | FlatStyleLike | undefined {
    return this._layer?.getStyle() ?? this._options.style ?? undefined;
  }

  set style(value: StyleLike | FlatStyleLike | undefined) {
    this._layer?.setStyle(value);
    this._options.style = value;
  }


  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.layer?.setSource(this.sourceProvider!.source!);
  }
}
