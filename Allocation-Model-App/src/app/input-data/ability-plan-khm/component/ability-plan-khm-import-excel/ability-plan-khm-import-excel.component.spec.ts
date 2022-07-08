import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityPlanKhmImportExcelComponent } from './ability-plan-khm-import-excel.component';

describe('AbilityPlanKhmImportExcelComponent', () => {
  let component: AbilityPlanKhmImportExcelComponent;
  let fixture: ComponentFixture<AbilityPlanKhmImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityPlanKhmImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityPlanKhmImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
