import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostSmartPriceDataGridComponent } from './cost-smart-price-data-grid.component';

describe('CostSmartPriceDataGridComponent', () => {
  let component: CostSmartPriceDataGridComponent;
  let fixture: ComponentFixture<CostSmartPriceDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostSmartPriceDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostSmartPriceDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
