import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { CostComponent } from './cost/cost.component';
// import { ExportComponent } from './export/export.component';
// import { FullcostAndSellingpriceComponent } from './fullcost-and-sellingprice/fullcost-and-sellingprice.component';
// import { AbilityPlanRayongComponent } from './input-data/ability-plan-rayong/ability-plan-rayong.component';
// import { AbilityPlanKhmComponent } from './input-data/ability-plan-khm/ability-plan-khm.component';
// import { VolumeConstrainComponent } from './input-data/volume-constrain/volume-constrain.component';
// import { ReferencePriceComponent } from './reference-price/reference-price.component';
// import { TankCapComponent } from './tank-cap/tank-cap.component';
import { ReportComponent } from './report/report.component';
import { TestcssComponent } from './testcss/testcss.component';
import { VolumeComponent } from './volume/volume.component';
// import { AbilityPentaneComponent } from './input-data/ability-pentane/ability-pentane.component';
// import { AbilityRefineryComponent } from './input-data/ability-refinery/ability-refinery.component';
// import { LRByLegalComponent } from './lr-by-legal/lr-by-legal.component';
// import { DepotManagementComponent } from './depot-management/depot-management.component';
// import { GridExComponent } from './grid-ex/grid-ex.component';

const routes: Routes = [{
  path: 'report',
  component: ReportComponent
}, {
  path: 'volume',
  component: VolumeComponent
}
  // ,{
  //   path: 'grid-ex',
  //   component: GridExComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostAndSellingPriceRoutingModule { }
