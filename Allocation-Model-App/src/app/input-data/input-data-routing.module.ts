import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostComponent } from './cost/cost.component';
import { AbilityPlanRayongComponent } from './ability-plan-rayong/ability-plan-rayong.component';
import { AbilityPlanKhmComponent } from './ability-plan-khm/ability-plan-khm.component';
// import { VolumeConstrainComponent } from './input-data/volume-constrain/volume-constrain.component';
import { ReferencePriceComponent } from './reference-price/reference-price.component';
import { AbilityPentaneComponent } from './ability-pentane/ability-pentane.component';
import { AbilityRefineryComponent } from './ability-refinery/ability-refinery.component';
// import { GridExComponent } from './grid-ex/grid-ex.component';

const routes: Routes = [ {
  path: 'cost',
  component: CostComponent
},{
  path: 'reference-price',
  component: ReferencePriceComponent
},{
  path: 'ability-plan-rayong',
  component: AbilityPlanRayongComponent
},{
  path: 'ability-plan-khm',
  component: AbilityPlanKhmComponent
},{
  path: 'ability-pentane',
  component: AbilityPentaneComponent
},{
  path: 'ability-refinery',
  component: AbilityRefineryComponent
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
export class InputDataRoutingModule { }
