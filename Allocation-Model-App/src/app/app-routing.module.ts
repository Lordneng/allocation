import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  // canActivate: [LoginGuardService]
},
{
  path: '',
  component: HomeComponent,
},
{
  path: 'home',
  component: HomeComponent,
  // canActivate: [AuthGuardService]
},
{
  path: 'customer-constrain',
  loadChildren: () =>
    import('./customer-constrain/customer-constrain.module').then((m) => m.CustomerConstrainModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'cost-and-selling-price',
  loadChildren: () =>
    import('./cost-and-selling-price/cost-and-selling-price.module').then((m) => m.CostAndSellingPriceModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'input-data',
  loadChildren: () =>
    import('./input-data/input-data.module').then((m) => m.InputDataModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'optimization-result',
  loadChildren: () =>
    import('./optimization-result/optimization-result.module').then((m) => m.OptimizationResultModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'inventory-lr-constrain',
  loadChildren: () =>
    import('./inventory-lr-constrain/inventory-lr-constrain.module').then((m) => m.InventoryLRConstrainModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'master',
  loadChildren: () =>
    import('./master/master.module').then((m) => m.MasterModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'system',
  loadChildren: () =>
    import('./system/system.module').then((m) => m.SystemModule),
  // canActivate: [AuthGuardService]
},
{
  path: 'planning-report',
  loadChildren: () =>
    import('./planning-report/planning-report.module').then((m) => m.PlanningReportModule),
  // canActivate: [AuthGuardService]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
