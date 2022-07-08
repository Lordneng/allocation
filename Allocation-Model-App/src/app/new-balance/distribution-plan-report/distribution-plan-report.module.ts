import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionPlanReportComponent } from './distribution-plan-report.component';
import { DistributionPlanReportRoutingModule } from './distribution-plan-report-routing.module';
import { SharedDxModule } from 'src/app/share/shared-dx.module';
import { AddNewPlanComponent } from './add-new-plan/add-new-plan.component';
import { DistributionReportPlanDetailComponent } from './distribution-report-plan-detail/distribution-report-plan-detail.component';

@NgModule({
  declarations: [DistributionPlanReportComponent, AddNewPlanComponent, DistributionReportPlanDetailComponent],
  imports: [CommonModule, DistributionPlanReportRoutingModule, SharedDxModule],
  exports: [DistributionPlanReportComponent],
})
export class DistributionPlanReportModule {}
