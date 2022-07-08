import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostAndSellingPriceRoutingModule } from './cost-and-selling-price-routing.module';
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
import { ReportComponent } from './report/report.component';
import { TestcssComponent } from './testcss/testcss.component';
import { VolumeComponent } from './volume/volume.component';
import { VolumeDataGridComponent } from './volume/components/volume-data-grid/volume-data-grid.component';
import { VolumeHistoryComponent } from './volume/components/volume-history/volume-history.component';
import { VolumeMarginPerUnitComponent } from './volume/components/volume-margin-per-unit/volume-margin-per-unit.component';
import { VolumeSellingPriceComponent } from './volume/components/volume-selling-price/volume-selling-price.component';

// import { GridExComponent } from './grid-ex/grid-ex.component';
import { StickyDirective } from '../share/directives/sticky.directive';
@NgModule({
  declarations: [ReportComponent
    , TestcssComponent
    , VolumeComponent
    , VolumeDataGridComponent
    , VolumeSellingPriceComponent
    , VolumeMarginPerUnitComponent
    , VolumeHistoryComponent
    // , GridExComponent
  ],
  imports: [
    CommonModule,
    CostAndSellingPriceRoutingModule,
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
export class CostAndSellingPriceModule { }
