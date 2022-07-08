import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanRayongHistoryComponent } from './ability-plan-rayong-history.component';

describe('AbilityPlanRayongHistoryComponent', () => {
  let component: AbilityPlanRayongHistoryComponent;
  let fixture: ComponentFixture<AbilityPlanRayongHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanRayongHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanRayongHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
