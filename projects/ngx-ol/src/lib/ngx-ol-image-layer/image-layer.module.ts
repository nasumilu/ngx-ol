import { NgModule } from '@angular/core';
import { NgxOlImageLayerProviderDirective } from './image-layer-provider.directive';
import {NgxOlBaseImageLayerProviderDirective} from './base-image-layer-provider.directive';
import { NgxOlImageSourceProviderDirective } from './image-source-provider.directive';
import { NgxOlImageWmsSourceProviderDirective } from './image-wms-source-provider.directive';
import { NgxOlImageArcGisRestSourceProviderDirective } from './image-arc-gis-rest-source-provider.directive';
import { NgxOlImageUrlSourceProviderDirective } from './image-url-source-provider.directive';
import { NgxOlImageWebserviceSourceProviderDirective } from './image-webservice-source-provider.directive';
import { NgxOlImageStaticSourceProviderDirective } from './image-static-source-provider.directive';
import {NgxOlLayerModule} from '../ng-ol-layer/layer.module';


@NgModule({
  declarations: [
    NgxOlBaseImageLayerProviderDirective,
    NgxOlImageLayerProviderDirective,
    NgxOlImageSourceProviderDirective,
    NgxOlImageWmsSourceProviderDirective,
    NgxOlImageArcGisRestSourceProviderDirective,
    NgxOlImageUrlSourceProviderDirective,
    NgxOlImageWebserviceSourceProviderDirective,
    NgxOlImageStaticSourceProviderDirective
  ],
  imports: [
    NgxOlLayerModule
  ],
  exports: [
    NgxOlImageLayerProviderDirective,
    NgxOlImageWmsSourceProviderDirective,
    NgxOlImageArcGisRestSourceProviderDirective
  ],
  providers: []
})
export class NgxOlImageLayerModule { }
