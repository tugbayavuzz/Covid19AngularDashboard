import { TestBed } from '@angular/core/testing';

import { DataServicesService } from './data.service';

describe('DataServicesService', () => {
  let service: DataServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});



