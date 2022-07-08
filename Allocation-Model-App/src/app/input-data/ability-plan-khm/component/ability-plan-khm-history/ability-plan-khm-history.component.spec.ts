import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanKhmHistoryComponent } from './ability-plan-khm-history.component';

describe('AbilityPlanKhmHistoryComponent', () => {
  let component: AbilityPlanKhmHistoryComponent;
  let fixture: ComponentFixture<AbilityPlanKhmHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanKhmHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanKhmHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
