import {CoordinatePipe, toCoordinateTplFactory, toDMSStringFactory, toXYStringFactory} from './coordinate.pipe';
import {Coordinate, format, toStringHDMS, toStringXY} from 'ol/coordinate';

describe('CoordinatePipe', () => {

  const pipe = new CoordinatePipe([toXYStringFactory(), toCoordinateTplFactory(), toDMSStringFactory()]);

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('expect default csv xy coordinate format', () => {
    const coordinate: Coordinate = [-9930000.9764, 4230385.0594];
    const formatted = pipe.transform(coordinate, 'xy', 6);
    expect(formatted).toEqual(toStringXY(coordinate, 6));
  });

  it('expect fraction digits of 2', () => {
    const coordinate: Coordinate = [-9930000.9764, 4230385.0594];
    const formatted = pipe.transform(coordinate, 'xy', 2);
    expect(formatted).toEqual(toStringXY(coordinate, 2));
  });

  it('expect output to use template', () => {
    const coordinate: Coordinate = [-9930000.9764, 4230385.0594];
    const template = '[{x}, {y}]'
    const formatted = pipe.transform(coordinate, 'tpl',3, template);
    expect(formatted).toEqual(format(coordinate, template, 3))
  });

  it('expect output to use dms', () => {
    const coordinate: Coordinate = [-9930000.9764, 4230385.0594];
    const formatted = pipe.transform(coordinate, 'dms',3);
    expect(formatted).toEqual(toStringHDMS(coordinate, 3))
  });

});
