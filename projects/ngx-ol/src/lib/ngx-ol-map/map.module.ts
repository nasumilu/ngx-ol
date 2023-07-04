import {ModuleWithProviders, NgModule} from '@angular/core';
import {
  NgxOlMapViewComponent,
  STATE_CHANGE_THROTTLE,
  StateChangeThrottle
} from './map-view.component';
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

  static withConfig(options: {
    stateChangeThrottle: StateChangeThrottle
  }): ModuleWithProviders<NgxOlMapModule> {
    return {
      ngModule: NgxOlMapModule,
      providers: [
        {provide: STATE_CHANGE_THROTTLE, useValue: options.stateChangeThrottle}
      ]
    }
  }
}
