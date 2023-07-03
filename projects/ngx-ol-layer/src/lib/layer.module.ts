import { NgModule } from '@angular/core';
import {NgxOlCommonModule} from 'ngx-ol-common';
import {NgxOlLayerProviderDirective} from './layer-provider.directive';
import {NgxOlSourceProviderDirective} from './source-provider.directive';
import { NgxOlAttributionDirective } from './attribution.directive';

@NgModule({
  declarations: [
    NgxOlLayerProviderDirective,
    NgxOlSourceProviderDirective,
    NgxOlAttributionDirective,
  ],
  exports: [
    NgxOlAttributionDirective,
    NgxOlLayerProviderDirective,
    NgxOlSourceProviderDirective,
  ],
  imports: [
    NgxOlCommonModule
  ]
})
export class NgxOlLayerModule { }
