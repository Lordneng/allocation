import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcostAndSellingpriceComponent } from './fullcost-and-sellingprice.component';

describe('FullcostAndSellingpriceComponent', () => {
  let component: FullcostAndSellingpriceComponent;
  let fixture: ComponentFixture<FullcostAndSellingpriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullcostAndSellingpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullcostAndSellingpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
