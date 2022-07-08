import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridNglComponent } from './optimization-data-grid-ngl.component';

describe('OptimizationDataGridNglComponent', () => {
  let component: OptimizationDataGridNglComponent;
  let fixture: ComponentFixture<OptimizationDataGridNglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridNglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridNglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
