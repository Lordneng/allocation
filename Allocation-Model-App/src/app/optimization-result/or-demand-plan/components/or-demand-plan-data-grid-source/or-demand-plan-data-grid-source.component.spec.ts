import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrDemandPlanDataGridSourceComponent } from './or-demand-plan-data-grid-source.component';

describe('OrDemandPlanDataGridSourceComponent', () => {
  let component: OrDemandPlanDataGridSourceComponent;
  let fixture: ComponentFixture<OrDemandPlanDataGridSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrDemandPlanDataGridSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrDemandPlanDataGridSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
