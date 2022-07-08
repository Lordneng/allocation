import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptimizationResultListComponent } from './optimization-result-list/optimization-result-list.component';
import { FullcostAndSellingpriceComponent } from './fullcost-and-sellingprice/fullcost-and-sellingprice.component';
import { OrDemandPlanComponent } from './or-demand-plan/or-demand-plan.component';
import { ExportComponent } from './export/export.component';

const routes: Routes = [
  {
    path: 'optimization',
    component: OptimizationResultListComponent
  },
  {
    path: 'fullcost-and-sellingprice',
    component: FullcostAndSellingpriceComponent
  },
  {
    path: 'export',
    component: ExportComponent
  },
  {
    path: 'or-demand-plan',
    component: OrDemandPlanComponent
  }
  // {
  //   path: 'ethane-balance',
  //   component: EthaneBalanceComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptimizationResultRoutingModule { }
