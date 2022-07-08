import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NglBalanceReportComponent } from './ngl-balance-report.component';

describe('NglBalanceReportComponent', () => {
  let component: NglBalanceReportComponent;
  let fixture: ComponentFixture<NglBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NglBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NglBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
