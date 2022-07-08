import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridC3lpgComponent } from './optimization-data-grid-c3lpg.component';

describe('OptimizationDataGridC3lpgComponent', () => {
  let component: OptimizationDataGridC3lpgComponent;
  let fixture: ComponentFixture<OptimizationDataGridC3lpgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridC3lpgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridC3lpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
