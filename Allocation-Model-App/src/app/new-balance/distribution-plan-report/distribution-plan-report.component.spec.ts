import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionPlanReportComponent } from './distribution-plan-report.component';

describe('DistributionPlanReportComponent', () => {
  let component: DistributionPlanReportComponent;
  let fixture: ComponentFixture<DistributionPlanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionPlanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionPlanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
