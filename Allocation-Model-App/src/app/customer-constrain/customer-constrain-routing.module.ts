import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractInfoComponent } from './contract/contract-info/contract-info.component';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { TurnAroundListComponent  } from './turn-around/turn-around-list/turn-around-list.component';
import { TurnAroundDetailComponent } from './turn-around/turn-around-detail/turn-around-detail.component';
import { VolumeConstrainComponent } from './volume-constrain/volume-constrain.component';
const routes: Routes = [ {
  path: 'contract',
  component: ContractListComponent
},{
  path: 'contract/contract-info',
  component: ContractInfoComponent
},{
  path: 'customer',
  component: CustomerListComponent
},{
  path: 'customer-info',
  component: CustomerInfoComponent
},{
  path: 'customer/customer-detail',
  component: CustomerDetailComponent
},{
  path: 'turn-around',
  component: TurnAroundListComponent
},{
  path: 'turn-around/turn-around-detail',
  component: TurnAroundDetailComponent
},{
  path: 'volume-constrain',
  component: VolumeConstrainComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerConstrainRoutingModule { }
