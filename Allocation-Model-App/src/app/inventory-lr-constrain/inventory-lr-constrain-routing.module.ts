import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TankCapComponent } from './tank-cap/tank-cap.component';
import { LRByLegalComponent } from './lr-by-legal/lr-by-legal.component';
import { DepotManagementComponent } from './depot-management/depot-management.component';
// import { GridExComponent } from './grid-ex/grid-ex.component';

const routes: Routes = [
  {
    path: 'tank-cap',
    component: TankCapComponent
  },
  {
    path: 'lr-by-legal',
    component: LRByLegalComponent
  },
  {
    path: 'depot-management',
    component: DepotManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryLRConstrainRoutingModule { }
