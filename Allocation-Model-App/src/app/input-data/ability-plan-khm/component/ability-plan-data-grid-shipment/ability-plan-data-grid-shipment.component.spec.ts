import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanDataGridShipmentComponent } from './ability-plan-data-grid-shipment.component';

describe('AbilityPlanDataGridShipmentComponent', () => {
  let component: AbilityPlanDataGridShipmentComponent;
  let fixture: ComponentFixture<AbilityPlanDataGridShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanDataGridShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanDataGridShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
