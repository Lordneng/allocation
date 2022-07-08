import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotkeyModule } from 'angular2-hotkeys';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NewBalanceComponent } from './new-balance.component';
import { SharedDxModule } from '../../share/shared-dx.module';
import { NewBalanceRoutingModule } from './new-balance-routing.module';
import { AbilityReportModule } from './ability-report/ability-report.module';
import { BalanceReportModule } from './balance-report/balance-report.module';
import { DistributionPlanReportModule } from './distribution-plan-report/distribution-plan-report.module';
@NgModule({
  declarations: [NewBalanceComponent],
  imports: [
    NewBalanceRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    HotkeyModule.forRoot(),
    TabsModule.forRoot(),
    SharedDxModule,
    AbilityReportModule,
    BalanceReportModule,
    DistributionPlanReportModule,
  ],
})
export class NewBalanceModule {}
