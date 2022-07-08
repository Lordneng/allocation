import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningReportRoutingModule } from './planning-report-routing.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotkeyModule } from 'angular2-hotkeys';
import { SharedDxModule } from '../share/shared-dx.module';
import { NewBalanceComponent } from './new-balance/new-balance.component';
import { DistributionPlanReportComponent } from './new-balance/distribution-plan-report/distribution-plan-report.component';
import { AdjustPlanReportComponent } from './new-balance/adjust-plan-report/adjust-plan-report.component';
import { BalanceReportComponent } from './new-balance/balance-report/balance-report.component';
import { AbilityReportComponent } from './new-balance/ability-report/ability-report.component';
import { EthaneBalanceReportComponent } from './new-balance/balance-report/ethane-balance-report/ethane-balance-report.component';
import { Cl3lpgBalanceReportComponent } from './new-balance/balance-report/cl3lpg-balance-report/cl3lpg-balance-report.component';
import { NglBalanceReportComponent } from './new-balance/balance-report/ngl-balance-report/ngl-balance-report.component';
import { PentaneComponent } from './new-balance/balance-report/pentane/pentane.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InformORComponent } from './inform-or/inform-or.component';
import { AbilityReportInformComponent } from './inform-or/ability-report/ability-report.component';
import { ORDemandInformComponent } from './inform-or/or-demand/or-demand.component';
import { EthanePlanningComponent } from './ethane-planning/ethane-planning.component';
import { EthanePlanningGridComponent } from './ethane-planning/ethane-planning-grid/ethane-planning-grid.component';
import { EthanePlanningDailyGridComponent } from './ethane-planning/ethane-planning-daily-grid/ethane-planning-daily-grid.component';
import { LpgRollingComponent } from './lpg-rolling/lpg-rolling.component';
import { SummaryComponent } from './summary/summary.component';
@NgModule({
  declarations: [
    NewBalanceComponent, DistributionPlanReportComponent, AdjustPlanReportComponent, BalanceReportComponent, AbilityReportComponent,
    InformORComponent, AbilityReportInformComponent, ORDemandInformComponent,
    EthaneBalanceReportComponent,
    Cl3lpgBalanceReportComponent,
    NglBalanceReportComponent,
    PentaneComponent,
    EthanePlanningComponent,
    EthanePlanningGridComponent,
    EthanePlanningDailyGridComponent,
    LpgRollingComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    PlanningReportRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    HotkeyModule.forRoot(),
    SharedDxModule,
    TabsModule.forRoot(),
  ]
})
export class PlanningReportModule { }
