import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthanePlanningGridComponent } from './ethane-planning-grid.component';

describe('EthanePlanningGridComponent', () => {
  let component: EthanePlanningGridComponent;
  let fixture: ComponentFixture<EthanePlanningGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthanePlanningGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthanePlanningGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
