import { TransformPipe } from './transform.pipe';
import {transform} from 'ol/proj';
import {Coordinate} from 'ol/coordinate';

describe('TransformPipe', () => {
  it('create an instance', () => {
    const pipe = new TransformPipe();
    expect(pipe).toBeTruthy();
  });

  it('transfrom from 3857  to 4326, default setting', () => {
    const pipe = new TransformPipe();
    const coordinate: Coordinate = [-11593664.2039172, 4528735.6964889];
    expect(transform(coordinate, 'EPSG:3857', 'EPSG:4326'))
      .toEqual(pipe.transform(coordinate, 'EPSG:4326') as Coordinate);
  });

  it('transfrom from 3857  to 4326 with outSR argument', () => {
    const pipe = new TransformPipe();
    const coordinate: Coordinate = [-11593664.2039172, 4528735.6964889];
    expect(transform(coordinate, 'EPSG:3857', 'EPSG:4326'))
      .toEqual(pipe.transform(coordinate, 'EPSG:4326', 'EPSG:3857') as Coordinate);
  });


});
