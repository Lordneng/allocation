import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AbilityReportComponent} from './ability-report.component';


const routes: Routes = [
  {
    path: '',
    component: AbilityReportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbilityReportRoutingModule { }
