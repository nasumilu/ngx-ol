import {NgModule} from '@angular/core';
import {NgxOlMapViewComponent} from './map-view.component';
import {NgxOlMapDirective} from './map.directive';
import {NgxOlLayerModule} from '../ng-ol-layer/layer.module';

@NgModule({
  declarations: [
    NgxOlMapViewComponent,
    NgxOlMapDirective
  ],
  imports: [
    NgxOlLayerModule
  ],
  exports: [
    NgxOlMapViewComponent,
    NgxOlMapDirective
  ]
})
export class NgxOlMapModule {
}
