import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionReportPlanDetailComponent } from './distribution-report-plan-detail.component';

describe('DistributionReportPlanDetailComponent', () => {
  let component: DistributionReportPlanDetailComponent;
  let fixture: ComponentFixture<DistributionReportPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionReportPlanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionReportPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
