import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotManagementMeterDataGridComponent } from './depot-management-meter-data-grid.component';

describe('DepotManagementMeterDataGridComponent', () => {
  let component: DepotManagementMeterDataGridComponent;
  let fixture: ComponentFixture<DepotManagementMeterDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotManagementMeterDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotManagementMeterDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
