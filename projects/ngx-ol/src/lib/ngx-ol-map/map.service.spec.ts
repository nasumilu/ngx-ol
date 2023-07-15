import { TestBed } from '@angular/core/testing';

import { NgxOlMapService } from './map.service';

describe('MapService', () => {
  let service: NgxOlMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxOlMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
