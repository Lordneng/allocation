import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistributionPlanReportComponent } from './distribution-plan-report.component';

const routes: Routes = [
  {
    path: '',
    component: DistributionPlanReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributionPlanReportRoutingModule {}
