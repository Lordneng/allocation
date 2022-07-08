import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrDemandPlanVersionComponent } from './or-demand-plan-version.component';

describe('OrDemandPlanVersionComponent', () => {
  let component: OrDemandPlanVersionComponent;
  let fixture: ComponentFixture<OrDemandPlanVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrDemandPlanVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrDemandPlanVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
