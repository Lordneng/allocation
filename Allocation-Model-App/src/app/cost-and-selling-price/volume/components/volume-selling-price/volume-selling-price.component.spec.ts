import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeSellingPriceComponent } from './Volume-selling-price.component';

describe('VolumeSellingPriceComponent', () => {
  let component: VolumeSellingPriceComponent;
  let fixture: ComponentFixture<VolumeSellingPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeSellingPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeSellingPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
