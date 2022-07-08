import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanKhmComponent } from './ability-plan-khm.component';

describe('AbilityPlanKhmComponent', () => {
  let component: AbilityPlanKhmComponent;
  let fixture: ComponentFixture<AbilityPlanKhmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanKhmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanKhmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
