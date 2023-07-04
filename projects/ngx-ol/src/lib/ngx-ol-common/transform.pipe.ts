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

import { Pipe, PipeTransform } from '@angular/core';
import {Coordinate} from 'ol/coordinate';
import {ProjectionLike, transform as transformCoordinate} from 'ol/proj';

/**
 * This pipe transforms a {@link Coordinate} from its source spatial reference (`inSR`) system to a destination
 * spatial reference system (`outSR`) using the OpenLayers `transform` function.
 *
 * @see {@link transformCoordinate}
 */
@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {

  /**
   * Transforms a {@link Coordinate} from one spatial reference system to another.
   * @param coordinate The {@link Coordinate} to transform
   * @param outSR The out put spatial reference system
   * @param inSR The optional input spatial reference system. (default: EPSG: 3857)
   */
  transform(coordinate: Coordinate | undefined, outSR: ProjectionLike, inSR?: ProjectionLike, ): Coordinate | undefined {
    if (!coordinate) {
      return;
    }
    return transformCoordinate(coordinate, inSR ?? 'EPSG:3857', outSR);
  }

}
