import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostImportExcelComponent } from './cost-import-excel.component';

describe('CostImportExcelComponent', () => {
  let component: CostImportExcelComponent;
  let fixture: ComponentFixture<CostImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
