import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationVersionComponent } from './optimization-version.component';

describe('OptimizationVersionComponent', () => {
  let component: OptimizationVersionComponent;
  let fixture: ComponentFixture<OptimizationVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
