import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LRByLegalMeterDataGridComponent } from './lr-by-legal-meter-data-grid.component';

describe('LRByLegalMeterDataGridComponent', () => {
  let component: LRByLegalMeterDataGridComponent;
  let fixture: ComponentFixture<LRByLegalMeterDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LRByLegalMeterDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LRByLegalMeterDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
