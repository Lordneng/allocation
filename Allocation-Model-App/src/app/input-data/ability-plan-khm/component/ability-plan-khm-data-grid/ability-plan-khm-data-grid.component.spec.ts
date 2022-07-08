import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanKhmDataGridComponent } from './ability-plan-khm-data-grid.component';

describe('AbilityPlanKhmDataGridComponent', () => {
  let component: AbilityPlanKhmDataGridComponent;
  let fixture: ComponentFixture<AbilityPlanKhmDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanKhmDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanKhmDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
