import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeConstrainMeterDataGridComponent } from './volume-constrain-meter-data-grid.component';

describe('VolumeConstrainMeterDataGridComponent', () => {
  let component: VolumeConstrainMeterDataGridComponent;
  let fixture: ComponentFixture<VolumeConstrainMeterDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeConstrainMeterDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeConstrainMeterDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
