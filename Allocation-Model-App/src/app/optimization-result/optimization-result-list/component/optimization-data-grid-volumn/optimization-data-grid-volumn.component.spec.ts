import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationDataGridVolumnComponent } from './optimization-data-grid-volumn.component';

describe('OptimizationDataGridVolumnComponent', () => {
  let component: OptimizationDataGridVolumnComponent;
  let fixture: ComponentFixture<OptimizationDataGridVolumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationDataGridVolumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationDataGridVolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
