import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceReportComponent } from './balance-report.component';
import { BalanceReportRoutingModule } from './balance-report-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EthaneBalanceReportComponent } from './ethane-balance-report/ethane-balance-report.component';
import { Cl3lpgBalanceReportComponent } from './cl3lpg-balance-report/cl3lpg-balance-report.component';
import { NglBalanceReportComponent } from './ngl-balance-report/ngl-balance-report.component';
import { PentaneComponent } from './pentane/pentane.component';
import { SharedDxModule } from 'src/app/share/shared-dx.module';

@NgModule({
  declarations: [
    BalanceReportComponent,
    EthaneBalanceReportComponent,
    Cl3lpgBalanceReportComponent,
    NglBalanceReportComponent,
    PentaneComponent,
  ],
  imports: [
    CommonModule,
    BalanceReportRoutingModule,
    TabsModule.forRoot(),
    SharedDxModule,
  ],
  exports: [BalanceReportComponent],
})
export class BalanceReportModule {}
