import { TestBed, inject } from '@angular/core/testing';

import { LegendSwatchService } from './legend-swatch.service';

describe('LegendSwatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegendSwatchService]
    });
  });

  it('should be created', inject([LegendSwatchService], (service: LegendSwatchService) => {
    expect(service).toBeTruthy();
  }));
});
