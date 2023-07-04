import { Pipe, PipeTransform } from '@angular/core';
import {Coordinate} from 'ol/coordinate';
import {ProjectionLike, transform as transformCoordinate} from 'ol/proj';

@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {

  transform(coordinate: Coordinate | undefined, inSR: ProjectionLike, outSR: ProjectionLike): Coordinate | undefined {
    if (!coordinate) {
      return;
    }
    return transformCoordinate(coordinate, inSR, outSR);
  }

}
