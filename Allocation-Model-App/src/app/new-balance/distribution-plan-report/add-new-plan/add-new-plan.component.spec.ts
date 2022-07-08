import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPlanComponent } from './add-new-plan.component';

describe('AddNewPlanComponent', () => {
  let component: AddNewPlanComponent;
  let fixture: ComponentFixture<AddNewPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
