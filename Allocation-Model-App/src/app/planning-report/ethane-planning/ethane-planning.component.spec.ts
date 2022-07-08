import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthanePlanningComponent } from './ethane-planning.component';

describe('EthanePlanningComponent', () => {
  let component: EthanePlanningComponent;
  let fixture: ComponentFixture<EthanePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthanePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthanePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
