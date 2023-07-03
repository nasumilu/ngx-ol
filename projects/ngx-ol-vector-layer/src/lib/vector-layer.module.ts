import {NgModule} from '@angular/core';
import {NgxOlBaseVectorLayerProviderDirective} from './base-vector-layer-provider.directive';
import {NgxOlBaseVectorSourceProviderDirective} from './base-vector-source-provider.directive';
import { NgxOlVectorSourceProviderDirective } from './vector-source-provider.directive';
import { NgxOlVectorLayerProviderDirective } from './vector-layer-provider.directive';
import {NgxOlLayerModule} from 'ngx-ol-layer';


@NgModule({
  declarations: [
    NgxOlBaseVectorLayerProviderDirective,
    NgxOlBaseVectorSourceProviderDirective,
    NgxOlVectorSourceProviderDirective,
    NgxOlVectorLayerProviderDirective
  ],
  imports: [
    NgxOlLayerModule
  ],
  exports: [
    NgxOlVectorLayerProviderDirective,
    NgxOlVectorSourceProviderDirective
  ]
})
export class NgxOlVectorLayerModule {
}
