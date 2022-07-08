import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustPlanReportComponent } from './adjust-plan-report.component';

describe('AdjustPlanReportComponent', () => {
  let component: AdjustPlanReportComponent;
  let fixture: ComponentFixture<AdjustPlanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustPlanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustPlanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
