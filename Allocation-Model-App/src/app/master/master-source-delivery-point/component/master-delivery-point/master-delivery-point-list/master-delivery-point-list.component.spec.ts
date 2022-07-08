import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDeliveryPointListComponent } from './master-delivery-point-list.component';

describe('MasterDeliveryPointListComponent', () => {
  let component: MasterDeliveryPointListComponent;
  let fixture: ComponentFixture<MasterDeliveryPointListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDeliveryPointListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDeliveryPointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
