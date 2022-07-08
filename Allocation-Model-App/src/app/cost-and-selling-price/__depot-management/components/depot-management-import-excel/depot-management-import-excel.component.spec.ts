import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotManagementImportExcelComponent } from './depot-management-import-excel.component';

describe('DepotManagementImportExcelComponent', () => {
  let component: DepotManagementImportExcelComponent;
  let fixture: ComponentFixture<DepotManagementImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotManagementImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotManagementImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
