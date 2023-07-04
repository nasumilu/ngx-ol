/**
 * Copyright 2023 Michael Lucas <nasumilu.@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Inject, InjectionToken, Pipe, PipeTransform} from '@angular/core';
import {Coordinate, format, toStringHDMS, toStringXY} from 'ol/coordinate';

/**
 * Interface used to format a {@link Coordinate} into a string.
 */
export interface CoordinateFormatter {

  /**
   * @description
   * The type used to identify this formatter, this value should uniquely identify this formatter.
   */
  type: string;

  /**
   * @description
   * Formats a {@link Coordinate} as a string.
   *
   * @param coordinate The coordinate to format
   * @param fractionDigits The number of least significant digits. (left of decimal)
   * @param args All other additional arguments needed to format the coordinate.
   */
  format(coordinate: Coordinate, fractionDigits: number, ...args: unknown[]): string;
}

export const COORDINATE_FORMATTER = new InjectionToken<CoordinateFormatter>('CoordinateFormatterToken');

/**
 * Pipe provides the means to format a {@link Coordinate} into a string using any provided {@link CoordinateFormatter}.
 *
 * This module provides three {@link CoordinateFormatter}:
 *
 * 1. 'xy' formatter which utilizes the OpenLayers {@link toStringXY} function.
 * 2. 'dms' formatter which utilizes the OpenLayers {@link toStringHDMS} function.
 * 3. 'tpl' formatter which utilizes the OpenLayers {@link format} function.
 *
 * If necessary an application may provide their own {@link CoordinateFormatter} provider using the
 * `COORDINATE_FORMATTER` injection token.
 *
 * ### Usage
 *
 * ```
 *  {{ [-13536462.0499, 5788684.7428] | coordinate: 'xy' }}
 *
 *  Expected Output: -13536462.0499, 5788684.7428
 *
 *  {{ [-10722552.69934033, 5572230.17736016] | coordinate: 'xy: 6 }}
 *
 *  Expected Output: -10722552.699340, 5572230.177360
 *
 *  {{ [-28069840, 2727399] | transform: 'EPSG:3857': 'EPSG:4326' | coordinate: 'dms' }}
 *
 *  The coordinate is first transformed to WGS-84 before formatting to degree, minutes, and seconds
 *  Expected Output: 23° 47′ 11″ N 107° 50′ 40″ E
 *
 * {{ [-27080333.4285489485, 2851087.094565 ] | coordinate: 'tpl': 1: 'My Location: {x}, {y}' }}
 *
 * Expected Output: My Location: -27080333.4, 2851087.1
 * ```
 */
@Pipe({
  name: 'coordinate'
})
export class CoordinatePipe implements PipeTransform {

  constructor(@Inject(COORDINATE_FORMATTER) private readonly formatters: CoordinateFormatter[]) {
  }

  /**
   * Transform a {@link Coordinate} into a string value. The expected output depends on the {@link CoordinateFormatter}
   * selected using the mandatory `type` argument.
   */
  transform(coordinate: Coordinate | undefined, type: string, fractionDigits?: number | string, ...args: unknown[]): string {
    if (!coordinate) {
      return '';
    }

    if (typeof fractionDigits === 'string') {
      fractionDigits = parseInt(fractionDigits);
    }

    const formatter = this.formatters.find(formatter => formatter.type === type);

    if (!formatter) {
      throw Error(`No CoordinateFormatter provider found for type ${type}!

      Provided CoordinateFormatter types are: ${this.formatters.map(formatter => formatter.type).join(' | ')}.
      `)
    }
    return formatter.format(coordinate, fractionDigits ?? 0, ...args);
  }

}

/**
 * Factory used to provide the 'xy' {@link CoordinateFormatter}
 */
export function toXYStringFactory(): CoordinateFormatter {
  return {
    type: 'xy',
    format: toStringXY
  };
}

/**
 * Factory used to provide the 'dms' {@link CoordinateFormatter}
 */
export function toDMSStringFactory(): CoordinateFormatter {
  return {
    type: 'dms',
    format: toStringHDMS
  }
}

/**
 * Factory used to provide the 'tpl' {@link CoordinateFormatter}
 */
export function toCoordinateTplFactory(): CoordinateFormatter {
  return {
    type: 'tpl',
    format: (coordinate: Coordinate, fractionDigits, template: string ): string =>
      format(coordinate, template, fractionDigits)
  }
}
