import {NgModule} from '@angular/core';
import {NgxOlMapViewComponent} from './map-view.component';
import {NgxOlMapDirective} from './map.directive';

@NgModule({
  declarations: [
    NgxOlMapViewComponent,
    NgxOlMapDirective
  ],
  imports: [],
  exports: [
    NgxOlMapViewComponent,
    NgxOlMapDirective
  ]
})
export class NgxOlMapModule {
}
