import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanRayongDataGridComponent } from './ability-plan-rayong-data-grid.component';

describe('AbilityPlanRayongDataGridComponent', () => {
  let component: AbilityPlanRayongDataGridComponent;
  let fixture: ComponentFixture<AbilityPlanRayongDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanRayongDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanRayongDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
