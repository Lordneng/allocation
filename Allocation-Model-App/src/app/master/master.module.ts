import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { SharedDxModule } from '../share/shared-dx.module';
import { MasterProductCostComponent } from './master-product-cost/master-product-cost.component';
import { MasterReferencePriceComponent } from './master-reference-price/master-reference-price.component';
import { MasterProductSellComponent } from './master-product-sell/master-product-sell.component';
import { MasterContractComponent } from './master-contract/master-contract.component';
import { MasterDeliveryPointListComponent } from './master-source-delivery-point/component/master-delivery-point/master-delivery-point-list/master-delivery-point-list.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotkeyModule } from 'angular2-hotkeys';
import { MentionsModule } from '@flxng/mentions';
import { MasterSourceDeliveryPointComponent } from './master-source-delivery-point/master-source-delivery-point.component';
import { MasterSourceListComponent } from './master-source-delivery-point/component/master-source/master-source-list/master-source-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductInfoComponent } from './product/product-info/product-info.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { MentionModule } from 'angular-mentions';

@NgModule({
  declarations: [MasterProductCostComponent
    , MasterReferencePriceComponent
    , MasterProductSellComponent
    , MasterContractComponent
    , MasterSourceListComponent
    , MasterDeliveryPointListComponent
    , MasterSourceDeliveryPointComponent
    , MasterSourceListComponent
    , ProductListComponent
    , ProductInfoComponent
    , ProductDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MasterRoutingModule,
    ModalModule.forRoot(),
    HotkeyModule.forRoot(),
    SharedDxModule,
    HotkeyModule.forRoot(),
    SharedDxModule,
    MentionsModule,
    MentionModule
  ]
})
export class MasterModule { }
