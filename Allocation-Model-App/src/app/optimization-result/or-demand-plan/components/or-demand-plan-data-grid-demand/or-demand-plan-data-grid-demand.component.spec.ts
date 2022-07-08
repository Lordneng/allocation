import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrDemandPlanDataGridDemandComponent } from './or-demand-plan-data-grid-demand.component';

describe('OrDemandPlanDataGridDemandComponent', () => {
  let component: OrDemandPlanDataGridDemandComponent;
  let fixture: ComponentFixture<OrDemandPlanDataGridDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrDemandPlanDataGridDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrDemandPlanDataGridDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
