import {EnvironmentProviders, ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {
  NgxOlMapViewComponent,
  STATE_CHANGE_THROTTLE,
  StateChangeThrottle
} from './map-view.component';
import {NgxOlMapDirective} from './map.directive';
import {NgxOlLayerModule} from '../ng-ol-layer/layer.module';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {NgxOlMapService} from './map.service';

export type ProjectionDefintion = { name: string, projection: string }

export type NgxOlModuleConfig = {
  stateChangeThrottle?: StateChangeThrottle,
  registerProj4?: boolean,
  projectionDefs?:  ProjectionDefintion[]
};

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
  ],
  providers: [NgxOlMapService]
})
export class NgxOlMapModule {

  static withConfig(options: NgxOlModuleConfig): ModuleWithProviders<NgxOlMapModule> {
    const providers: (Provider | EnvironmentProviders)[] = [NgxOlMapService];

    if (options.stateChangeThrottle) {
      providers.push({provide: STATE_CHANGE_THROTTLE, useValue: options.stateChangeThrottle});
    }

    if (options.registerProj4) {
      register(proj4);
    }

    if (options.projectionDefs) {
      options.projectionDefs.forEach(projectDef => {
        proj4.defs(projectDef.name, projectDef.projection);
      });
      register(proj4);
    }

    return {
      ngModule: NgxOlMapModule,
      providers
    }
  }
}
