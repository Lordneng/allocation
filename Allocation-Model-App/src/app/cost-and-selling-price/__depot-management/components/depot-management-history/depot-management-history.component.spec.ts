import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotManagementHistoryComponent } from './depot-management-history.component';

describe('DepotManagementHistoryComponent', () => {
  let component: DepotManagementHistoryComponent;
  let fixture: ComponentFixture<DepotManagementHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepotManagementHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepotManagementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
