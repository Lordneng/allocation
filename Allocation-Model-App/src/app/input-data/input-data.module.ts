import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostComponent } from './cost/cost.component';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HotkeyModule } from 'angular2-hotkeys';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PagesContainersModule } from '../containers/pages/pages.containers.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from '../containers/layout/layout.containers.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedDxModule } from '../share/shared-dx.module';
import { BootstrapModule } from '../share/bootstrap.module';
import { ReferencePriceComponent } from './reference-price/reference-price.component';
import { CostHistoryComponent } from './cost/component/cost-history/cost-history.component';
import { CostDataGridComponent } from './cost/component/cost-data-grid/cost-data-grid.component';
import { ReferencePriceDataGridComponent } from './reference-price/component/reference-price-data-grid/reference-price-data-grid.component';
import { ReferencePriceHistoryComponent } from './reference-price/component/reference-price-history/reference-price-history.component';
import { AbilityPlanRayongComponent } from './ability-plan-rayong/ability-plan-rayong.component';
import { AbilityPlanKhmComponent } from './ability-plan-khm/ability-plan-khm.component';
import { AbilityPlanRayongDataGridComponent } from './ability-plan-rayong/component/ability-plan-rayong-data-grid/ability-plan-rayong-data-grid.component';
import { AbilityPlanKhmDataGridComponent } from './ability-plan-khm/component/ability-plan-khm-data-grid/ability-plan-khm-data-grid.component';
import { AbilityPlanKhmHistoryComponent } from './ability-plan-khm/component/ability-plan-khm-history/ability-plan-khm-history.component';
import { AbilityPlanRayongHistoryComponent } from './ability-plan-rayong/component/ability-plan-rayong-history/ability-plan-rayong-history.component';
import { CostImportExcelComponent } from './cost/component/cost-import-excel/cost-import-excel.component';
import { ReferencepriceImportExcelComponent } from './reference-price/component/reference-price-import-excel/reference-price-import-excel.component';
import { AbilityPlanKhmImportExcelComponent } from './ability-plan-khm/component/ability-plan-khm-import-excel/ability-plan-khm-import-excel.component';
import { AbilityPlanRayongImportExcelComponent } from './ability-plan-rayong/component/ability-plan-rayong-import-excel/ability-plan-rayong-import-excel.component';
import { AbilityPentaneComponent } from './ability-pentane/ability-pentane.component';
import { AbilityPentaneDataGridComponent } from './ability-pentane/component/ability-pentane-data-grid/ability-pentane-data-grid.component';
import { AbilityPentaneDataHistoryComponent } from './ability-pentane/component/ability-pentane-data-history/ability-pentane-data-history.component';
import { ReferencePriceDataFromSmartPriceComponent } from './reference-price/component/reference-price-data-from-smart-price/reference-price-data-from-smart-price.component';
import { ReferencePriceDataFromSmartPriceGridComponent } from './reference-price/component/reference-price-data-from-smart-price-grid/reference-price-data-from-smart-price-grid.component';
import { AbilityRefineryComponent } from './ability-refinery/ability-refinery.component';
import { AbilityRefineryDataGridComponent } from './ability-refinery/component/ability-refinery-data-grid/ability-refinery-data-grid.component';
import { AbilityRefineryHistoryComponent } from './ability-refinery/component/ability-refinery-history/ability-refinery-history.component';
import { AbilityPlanRayongDataGridImportComponent } from './ability-plan-rayong/component/ability-plan-rayong-data-grid-import/ability-plan-rayong-data-grid-import.component';
import { AbilityPlanDataGridShipmentComponent } from './ability-plan-khm/component/ability-plan-data-grid-shipment/ability-plan-data-grid-shipment.component';
// import { GridExComponent } from './grid-ex/grid-ex.component';
import { StickyDirective } from '../share/directives/sticky.directive';
import { InputDataRoutingModule } from './input-data-routing.module';
import { CostSmartPriceDataGridComponent } from './cost/component/cost-smart-price-data-grid/cost-smart-price-data-grid.component';

@NgModule({
  declarations: [CostComponent
    , ReferencePriceComponent
    , CostHistoryComponent
    , CostDataGridComponent
    , ReferencePriceDataGridComponent
    , ReferencePriceHistoryComponent
    , AbilityPlanRayongComponent
    , AbilityPlanKhmComponent
    , AbilityPlanRayongDataGridComponent
    , AbilityPlanKhmDataGridComponent
    , AbilityPlanKhmHistoryComponent
    , AbilityPlanRayongHistoryComponent
    , CostImportExcelComponent
    , ReferencepriceImportExcelComponent
    , AbilityPlanKhmImportExcelComponent
    , AbilityPlanRayongImportExcelComponent
    , AbilityPentaneComponent
    , AbilityPentaneDataGridComponent
    , AbilityPentaneDataHistoryComponent
    , ReferencePriceDataFromSmartPriceComponent
    , ReferencePriceDataFromSmartPriceGridComponent
    , AbilityRefineryComponent
    , AbilityRefineryDataGridComponent
    , AbilityRefineryHistoryComponent
    , AbilityPlanRayongDataGridImportComponent
    , AbilityPlanDataGridShipmentComponent, CostSmartPriceDataGridComponent
    // , GridExComponent
  ],
  imports: [
    CommonModule,
    InputDataRoutingModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    DropzoneModule,
    PagesContainersModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    HotkeyModule.forRoot(),
    TabsModule.forRoot(),
    TranslateModule,
    LayoutContainersModule,
    PerfectScrollbarModule,
    CollapseModule,
    SharedDxModule,
    BootstrapModule
  ],
})
export class InputDataModule { }
