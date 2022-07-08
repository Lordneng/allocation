import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencePriceDataFromSmartPriceGridComponent } from './reference-price-data-from-smart-price-grid.component';

describe('ReferencePriceDataFromSmartPriceGridComponent', () => {
  let component: ReferencePriceDataFromSmartPriceGridComponent;
  let fixture: ComponentFixture<ReferencePriceDataFromSmartPriceGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencePriceDataFromSmartPriceGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencePriceDataFromSmartPriceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
