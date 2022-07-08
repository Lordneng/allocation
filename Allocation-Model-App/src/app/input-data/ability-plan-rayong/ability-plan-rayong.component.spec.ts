import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanRayongComponent } from './ability-plan-rayong.component';

describe('AbilityPlanRayongComponent', () => {
  let component: AbilityPlanRayongComponent;
  let fixture: ComponentFixture<AbilityPlanRayongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanRayongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanRayongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
