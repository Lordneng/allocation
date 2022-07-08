import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthaneBalanceReportComponent } from './ethane-balance-report.component';

describe('EthaneBalanceReportComponent', () => {
  let component: EthaneBalanceReportComponent;
  let fixture: ComponentFixture<EthaneBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthaneBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthaneBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
