import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { OptimizationResultRoutingModule } from './optimization-result-routing.module';
import { OptimizationResultListComponent } from './optimization-result-list/optimization-result-list.component';
import { FullcostAndSellingpriceComponent } from './fullcost-and-sellingprice/fullcost-and-sellingprice.component';
import { FullcostDataGridComponent } from './fullcost-and-sellingprice/component/fullcost-data-grid/fullcost-data-grid.component';
import { SellingpriceDataGridComponent } from './fullcost-and-sellingprice/component/sellingprice-data-grid/sellingprice-data-grid.component';
import { MarginperunitDataGridComponent } from './fullcost-and-sellingprice/component/marginperunit-data-grid/marginperunit-data-grid.component';
import { FullcostHistoryComponent } from './fullcost-and-sellingprice/component/fullcost-history/fullcost-history.component';
import { SmartPriceDataGridComponent } from './fullcost-and-sellingprice/component/smart-price-data-grid/smart-price-data-grid.component';
import { ExportComponent } from './export/export.component';
import { OrDemandPlanComponent } from './or-demand-plan/or-demand-plan.component';
import { OrDemandPlanVersionComponent } from './or-demand-plan/components/or-demand-plan-version/or-demand-plan-version.component';
import { OrDemandPlanDataGridDemandComponent } from './or-demand-plan/components/or-demand-plan-data-grid-demand/or-demand-plan-data-grid-demand.component';
import { OrDemandPlanDataGridInputComponent } from './or-demand-plan/components/or-demand-plan-data-grid-input/or-demand-plan-data-grid-input.component';
import { OrDemandPlanDataGridSourceComponent } from './or-demand-plan/components/or-demand-plan-data-grid-source/or-demand-plan-data-grid-source.component';
import { OptimizationVersionComponent } from './optimization-result-list/component/optimization-version/optimization-version.component';
import { OptimizationDataGridC3lpgComponent } from './optimization-result-list/component/optimization-data-grid-c3lpg/optimization-data-grid-c3lpg.component';
import { OptimizationDataGridNglComponent } from './optimization-result-list/component/optimization-data-grid-ngl/optimization-data-grid-ngl.component';
import { OptimizationDataGridCo2Component } from './optimization-result-list/component/optimization-data-grid-co2/optimization-data-grid-co2.component';
import { OptimizationDataGridPantaneComponent } from './optimization-result-list/component/optimization-data-grid-pantane/optimization-data-grid-pantane.component';
import { OptimizationDataGridC2Component } from './optimization-result-list/component/optimization-data-grid-c2/optimization-data-grid-c2.component';
import { OptimizationDataGridLrMonthlyComponent } from './optimization-result-list/component/optimization-data-grid-lr-monthly/optimization-data-grid-lr-monthly.component';
import { OptimizationDataGridVolumnComponent } from './optimization-result-list/component/optimization-data-grid-volumn/optimization-data-grid-volumn.component';

@NgModule({
  declarations: [
    OptimizationResultListComponent,
    OptimizationDataGridC2Component,
    FullcostAndSellingpriceComponent,
    FullcostDataGridComponent,
    SellingpriceDataGridComponent,
    MarginperunitDataGridComponent,
    FullcostHistoryComponent,
    SmartPriceDataGridComponent,
    ExportComponent,
    OrDemandPlanComponent,
    OrDemandPlanVersionComponent,
    OrDemandPlanDataGridInputComponent,
    OrDemandPlanDataGridDemandComponent,
    OrDemandPlanDataGridSourceComponent,
    OptimizationVersionComponent,
    OptimizationDataGridC3lpgComponent,
    OptimizationDataGridNglComponent,
    OptimizationDataGridCo2Component,
    OptimizationDataGridPantaneComponent,
    OptimizationDataGridLrMonthlyComponent,
    OptimizationDataGridVolumnComponent
  ],
  imports: [
    CommonModule,
    OptimizationResultRoutingModule,
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
    BootstrapModule,
  ]
})
export class OptimizationResultModule { }
