import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridPantaneComponent } from './optimization-data-grid-pantane.component';

describe('OptimizationDataGridPantaneComponent', () => {
  let component: OptimizationDataGridPantaneComponent;
  let fixture: ComponentFixture<OptimizationDataGridPantaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridPantaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridPantaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
