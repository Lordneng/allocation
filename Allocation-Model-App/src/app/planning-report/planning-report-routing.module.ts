import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewBalanceComponent } from './new-balance/new-balance.component';
import { InformORComponent } from './inform-or/inform-or.component';
import { EthanePlanningComponent } from './ethane-planning/ethane-planning.component';
import { LpgRollingComponent } from './lpg-rolling/lpg-rolling.component';
import { SummaryComponent } from './summary/summary.component';


const routes: Routes = [
{
  path: 'new-balance',
  component: NewBalanceComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'inform-or',
  component: InformORComponent,
},
{
  path: 'ethane-planning',
  component: EthanePlanningComponent,
},
{
  path: 'lpg-rolling',
  component: LpgRollingComponent,
},
{
  path: 'summary',
  component: SummaryComponent,
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningReportRoutingModule { }
