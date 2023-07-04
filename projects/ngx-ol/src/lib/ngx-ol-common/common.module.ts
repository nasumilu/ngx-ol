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

import { NgModule } from '@angular/core';
import {
  COORDINATE_FORMATTER,
  CoordinatePipe, toCoordinateTplFactory,
  toDMSStringFactory,
  toXYStringFactory
} from './coordinate.pipe';
import { TransformPipe } from './transform.pipe';

/**
 * Exports the required pipes and directives commonly used among the NgxOl library.
 */
@NgModule({
  declarations: [
    CoordinatePipe,
    TransformPipe
  ],
  imports: [],
  exports: [
    CoordinatePipe,
    TransformPipe
  ],
  providers: [
    {provide: COORDINATE_FORMATTER, multi: true, useFactory: toXYStringFactory},
    {provide: COORDINATE_FORMATTER, multi: true, useFactory: toDMSStringFactory},
    {provide: COORDINATE_FORMATTER, multi: true, useFactory: toCoordinateTplFactory},
  ]
})
export class NgxOlCommonModule { }
