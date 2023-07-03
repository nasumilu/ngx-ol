import { NgModule } from '@angular/core';
import {NgxOlLayerProviderDirective} from './layer-provider.directive';
import {NgxOlSourceProviderDirective} from './source-provider.directive';
import { NgxOlAttributionDirective } from './attribution.directive';
import {NgxOlCommonModule} from '../ngx-ol-common/common.module';

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
