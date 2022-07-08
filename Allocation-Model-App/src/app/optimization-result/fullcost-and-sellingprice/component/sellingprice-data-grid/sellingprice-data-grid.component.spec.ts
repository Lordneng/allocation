import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingpriceDataGridComponent } from './sellingprice-data-grid.component';

describe('SellingpriceDataGridComponent', () => {
  let component: SellingpriceDataGridComponent;
  let fixture: ComponentFixture<SellingpriceDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingpriceDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingpriceDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
