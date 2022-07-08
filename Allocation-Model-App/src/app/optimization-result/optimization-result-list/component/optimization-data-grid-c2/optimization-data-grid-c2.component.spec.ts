import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridC2Component } from './optimization-data-grid-c2.component';

describe('OptimizationDataGridC2Component', () => {
  let component: OptimizationDataGridC2Component;
  let fixture: ComponentFixture<OptimizationDataGridC2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridC2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridC2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
