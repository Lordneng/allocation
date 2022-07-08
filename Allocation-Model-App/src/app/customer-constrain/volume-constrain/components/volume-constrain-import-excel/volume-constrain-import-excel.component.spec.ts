import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeConstrainImportExcelComponent } from './volume-constrain-import-excel.component';

describe('VolumeConstrainImportExcelComponent', () => {
  let component: VolumeConstrainImportExcelComponent;
  let fixture: ComponentFixture<VolumeConstrainImportExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeConstrainImportExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeConstrainImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
