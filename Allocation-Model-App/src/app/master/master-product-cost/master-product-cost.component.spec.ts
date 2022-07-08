import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductCostComponent } from './master-product-cost.component';

describe('MasterProductCostComponent', () => {
  let component: MasterProductCostComponent;
  let fixture: ComponentFixture<MasterProductCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProductCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProductCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
