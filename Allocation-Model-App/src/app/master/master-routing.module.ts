import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterContractComponent } from './master-contract/master-contract.component';
import { MasterProductCostComponent } from './master-product-cost/master-product-cost.component';
import { MasterProductSellComponent } from './master-product-sell/master-product-sell.component';
import { MasterReferencePriceComponent } from './master-reference-price/master-reference-price.component';
import { MasterSourceDeliveryPointComponent } from './master-source-delivery-point/master-source-delivery-point.component';
import { ProductInfoComponent } from './product/product-info/product-info.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';


const routes: Routes = [
{
  path: 'master-product-cost',
  component: MasterProductCostComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'master-reference-price',
  component: MasterReferencePriceComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'master-product-sell',
  component: MasterProductSellComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'master-contract',
  component: MasterContractComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'master-source-delivery-point',
  component: MasterSourceDeliveryPointComponent,
  // canActivate: [LoginGuardService]
},
{
  path: 'product',
  component: ProductListComponent
},{
  path: 'product/product-detail',
  component: ProductDetailComponent
},
{
  path: 'product/product-info',
  component: ProductInfoComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
