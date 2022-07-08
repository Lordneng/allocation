import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeDataGridComponent } from './Volume-data-grid.component';

describe('VolumeDataGridComponent', () => {
  let component: VolumeDataGridComponent;
  let fixture: ComponentFixture<VolumeDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
