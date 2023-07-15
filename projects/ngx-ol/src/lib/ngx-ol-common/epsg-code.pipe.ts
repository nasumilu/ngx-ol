import { Pipe, PipeTransform } from '@angular/core';
import {Projection, ProjectionLike} from 'ol/proj';

@Pipe({
  name: 'epsgCode'
})
export class NgxOlEPSGCodePipe implements PipeTransform {

  transform(projection: ProjectionLike): string {
    return projection instanceof Projection ? projection.getCode() : (projection ?? '');
  }

}
