import { TestBed } from '@angular/core/testing';

import { NgxOlProjectionService } from './projection.service';

describe('NgxOlProjectionService', () => {
  let service: NgxOlProjectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxOlProjectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
