import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Cl3lpgBalanceReportComponent } from './cl3lpg-balance-report.component';

describe('Cl3lpgBalanceReportComponent', () => {
  let component: Cl3lpgBalanceReportComponent;
  let fixture: ComponentFixture<Cl3lpgBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cl3lpgBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cl3lpgBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
