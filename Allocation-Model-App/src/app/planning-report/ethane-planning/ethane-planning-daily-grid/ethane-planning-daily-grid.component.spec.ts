import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthanePlanningDailyGridComponent } from './ethane-planning-daily-grid.component';

describe('EthanePlanningDailyGridComponent', () => {
  let component: EthanePlanningDailyGridComponent;
  let fixture: ComponentFixture<EthanePlanningDailyGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthanePlanningDailyGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthanePlanningDailyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
