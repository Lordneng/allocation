import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanRayongImportExcelComponent } from './ability-plan-rayong-import-excel.component';

describe('AbilityPlanRayongImportExcelComponent', () => {
  let component: AbilityPlanRayongImportExcelComponent;
  let fixture: ComponentFixture<AbilityPlanRayongImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanRayongImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanRayongImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
