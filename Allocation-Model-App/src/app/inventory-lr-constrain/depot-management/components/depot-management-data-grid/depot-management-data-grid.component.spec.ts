import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotManagementDataGridComponent } from './depot-management-data-grid.component';

describe('DepotManagementDataGridComponent', () => {
  let component: DepotManagementDataGridComponent;
  let fixture: ComponentFixture<DepotManagementDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotManagementDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotManagementDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
