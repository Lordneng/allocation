import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSourceDeliveryPointComponent } from './master-source-delivery-point.component';

describe('MasterSourceDeliveryPointComponent', () => {
  let component: MasterSourceDeliveryPointComponent;
  let fixture: ComponentFixture<MasterSourceDeliveryPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSourceDeliveryPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSourceDeliveryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
