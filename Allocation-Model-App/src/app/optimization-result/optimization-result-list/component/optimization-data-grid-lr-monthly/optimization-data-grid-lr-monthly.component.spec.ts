import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridLrMonthlyComponent } from './optimization-data-grid-lr-monthly.component';

describe('OptimizationDataGridLrMonthlyComponent', () => {
  let component: OptimizationDataGridLrMonthlyComponent;
  let fixture: ComponentFixture<OptimizationDataGridLrMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridLrMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridLrMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
