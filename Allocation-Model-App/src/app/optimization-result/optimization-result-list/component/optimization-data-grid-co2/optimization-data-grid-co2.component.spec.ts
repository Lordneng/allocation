import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridCo2Component } from './optimization-data-grid-co2.component';

describe('OptimizationDataGridCo2Component', () => {
  let component: OptimizationDataGridCo2Component;
  let fixture: ComponentFixture<OptimizationDataGridCo2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridCo2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridCo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
