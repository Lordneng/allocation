import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceReportComponent } from './balance-report.component';

const routes: Routes = [
  {
    path: '',
    component: BalanceReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceReportRoutingModule {}
