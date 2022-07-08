import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencepriceImportExcelComponent } from './reference-price-import-excel.component';

describe('ReferencepriceImportExcelComponent', () => {
  let component: ReferencepriceImportExcelComponent;
  let fixture: ComponentFixture<ReferencepriceImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencepriceImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencepriceImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
