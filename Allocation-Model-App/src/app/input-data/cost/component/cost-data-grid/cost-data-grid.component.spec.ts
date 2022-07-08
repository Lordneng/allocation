import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDataGridComponent } from './cost-data-grid.component';

describe('CostDataGridComponent', () => {
  let component: CostDataGridComponent;
  let fixture: ComponentFixture<CostDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
