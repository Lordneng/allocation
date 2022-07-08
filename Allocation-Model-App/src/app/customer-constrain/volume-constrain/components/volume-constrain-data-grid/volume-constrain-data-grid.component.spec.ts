import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeConstrainDataGridComponent } from './volume-constrain-data-grid.component';

describe('VolumeConstrainDataGridComponent', () => {
  let component: VolumeConstrainDataGridComponent;
  let fixture: ComponentFixture<VolumeConstrainDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeConstrainDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeConstrainDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
