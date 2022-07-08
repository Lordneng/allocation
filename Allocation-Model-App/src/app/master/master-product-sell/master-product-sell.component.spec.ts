import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductSellComponent } from './master-product-sell.component';

describe('MasterProductSellComponent', () => {
  let component: MasterProductSellComponent;
  let fixture: ComponentFixture<MasterProductSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProductSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProductSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
