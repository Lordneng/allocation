import { TestBed } from '@angular/core/testing';

import { AbilityReportService } from './ability-report.service';

describe('AbilityReportService', () => {
  let service: AbilityReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbilityReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
