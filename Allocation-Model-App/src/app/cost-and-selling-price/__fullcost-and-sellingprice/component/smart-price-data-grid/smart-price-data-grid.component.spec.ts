import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPriceDataGridComponent } from './smart-price-data-grid.component';

describe('SmartPriceDataGridComponent', () => {
  let component: SmartPriceDataGridComponent;
  let fixture: ComponentFixture<SmartPriceDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartPriceDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartPriceDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
