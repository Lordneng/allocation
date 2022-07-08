import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePriceDataFromSmartPriceComponent } from './reference-price-data-from-smart-price.component';

describe('ReferencePriceDataFromSmartPriceComponent', () => {
  let component: ReferencePriceDataFromSmartPriceComponent;
  let fixture: ComponentFixture<ReferencePriceDataFromSmartPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePriceDataFromSmartPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePriceDataFromSmartPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
