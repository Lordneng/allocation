import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullcostDataGridComponent } from './fullcost-data-grid.component';

describe('FullcostDataGridComponent', () => {
  let component: FullcostDataGridComponent;
  let fixture: ComponentFixture<FullcostDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullcostDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullcostDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
