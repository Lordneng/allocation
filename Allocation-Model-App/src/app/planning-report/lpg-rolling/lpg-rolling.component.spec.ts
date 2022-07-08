import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LpgRollingComponent } from './lpg-rolling.component';

describe('LpgRollingComponent', () => {
  let component: LpgRollingComponent;
  let fixture: ComponentFixture<LpgRollingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LpgRollingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LpgRollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
