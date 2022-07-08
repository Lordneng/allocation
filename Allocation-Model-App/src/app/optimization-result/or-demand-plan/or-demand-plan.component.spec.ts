import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrDemandPlanComponent } from './or-demand-plan.component';

describe('OrDemandPlanComponent', () => {
  let component: OrDemandPlanComponent;
  let fixture: ComponentFixture<OrDemandPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrDemandPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrDemandPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
