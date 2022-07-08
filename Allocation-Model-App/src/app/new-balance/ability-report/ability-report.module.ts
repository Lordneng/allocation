import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbilityReportRoutingModule } from './ability-report-routing.module';
import { AbilityReportComponent } from './ability-report.component';
import { SharedDxModule } from 'src/app/share/shared-dx.module';

@NgModule({
  declarations: [AbilityReportComponent],
  imports: [CommonModule, AbilityReportRoutingModule, SharedDxModule],
  exports: [AbilityReportComponent],
})
export class AbilityReportModule {}
