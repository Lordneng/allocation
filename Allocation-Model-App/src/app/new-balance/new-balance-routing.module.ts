import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewBalanceComponent} from './new-balance.component';


const routes: Routes = [
  {
    path: '',
    component: NewBalanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewBalanceRoutingModule { }
