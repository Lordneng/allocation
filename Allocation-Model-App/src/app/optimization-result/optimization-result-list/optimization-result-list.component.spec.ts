import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationResultListComponent } from './optimization-result-list.component';

describe('OptimizationResultListComponent', () => {
  let component: OptimizationResultListComponent;
  let fixture: ComponentFixture<OptimizationResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
