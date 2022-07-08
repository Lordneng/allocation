import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanRayongDataGridImportComponent } from './ability-plan-rayong-data-grid-import.component';

describe('AbilityPlanRayongDataGridImportComponent', () => {
  let component: AbilityPlanRayongDataGridImportComponent;
  let fixture: ComponentFixture<AbilityPlanRayongDataGridImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanRayongDataGridImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanRayongDataGridImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
