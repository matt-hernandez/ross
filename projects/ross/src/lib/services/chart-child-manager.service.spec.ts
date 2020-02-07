import { TestBed, inject } from '@angular/core/testing';

import { ChartChildManagerService } from './chart-child-manager.service';

describe('ChartChildManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartChildManagerService]
    });
  });

  it('should be created', inject([ChartChildManagerService], (service: ChartChildManagerService) => {
    expect(service).toBeTruthy();
  }));
});
