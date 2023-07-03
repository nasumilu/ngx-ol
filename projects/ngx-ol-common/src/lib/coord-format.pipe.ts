import { Pipe, PipeTransform } from '@angular/core';
import {Coordinate, toStringXY} from "ol/coordinate";

@Pipe({
  name: 'coordFormat'
})
export class NgxOlCoordinateFormatPipe implements PipeTransform {

  transform(value: Coordinate, fractionDigits?: number): string {
    return toStringXY(value, fractionDigits);
  }

}
