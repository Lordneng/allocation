import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrDemandPlanDataGridInputComponent } from './or-demand-plan-data-grid-input.component';

describe('OrDemandPlanDataGridInputComponent', () => {
  let component: OrDemandPlanDataGridInputComponent;
  let fixture: ComponentFixture<OrDemandPlanDataGridInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrDemandPlanDataGridInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrDemandPlanDataGridInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
