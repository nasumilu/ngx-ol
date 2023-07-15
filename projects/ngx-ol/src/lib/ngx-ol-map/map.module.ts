/*
 * Copyright 2023 Michael Lucas <nasumilu.@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {EnvironmentProviders, ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {
  NgxOlMapViewComponent,
  NGX_OL_STATE_CHANGE_THROTTLE, StateChangeThrottle,
} from './map-view.component';
import {NgxOlMapDirective} from './map.directive';
import {NgxOlLayerModule} from '../ng-ol-layer/layer.module';
import {NgxOlMapService} from './map.service';
import {
  NGX_OL_PROJECTION_DEF,
  NgxOlProjectionDefinition, NgxOlProjectionLookupProvider,
  NgxOlProjectionService
} from './projection.service';


export type NgxOlModuleConfig = {
  stateChangeThrottle?: StateChangeThrottle,
  projectionDefs?: NgxOlProjectionDefinition[],
  projectionLookupProvider?: Type<NgxOlProjectionLookupProvider>
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
  providers: [NgxOlMapService, NgxOlProjectionService]
})
export class NgxOlMapModule {

  static withConfig(options: NgxOlModuleConfig): ModuleWithProviders<NgxOlMapModule> {
    const providers: (Provider | EnvironmentProviders)[] = [];

    if (options.stateChangeThrottle) {
      providers.push({provide: NGX_OL_STATE_CHANGE_THROTTLE, useValue: options.stateChangeThrottle});
    }

    if (options.projectionDefs) {
      providers.push(
        options.projectionDefs.map(def =>
          ({provide: NGX_OL_PROJECTION_DEF, multi: true, useValue: def})
        )
      );
    }

    if (options.projectionLookupProvider) {
      providers.push({provide: NgxOlProjectionLookupProvider, useClass: options.projectionLookupProvider});
    }
    return {
      ngModule: NgxOlMapModule,
      providers
    }
  }
}
