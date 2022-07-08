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
// import { GridExComponent } from './grid-ex/grid-ex.component';
import { StickyDirective } from '../share/directives/sticky.directive';
import { InventoryLRConstrainRoutingModule } from './inventory-lr-constrain-routing.module';
import { TankCapComponent } from './tank-cap/tank-cap.component';
import { TankCapDataHistoryComponent } from './tank-cap/component/tank-cap-data-history/tank-cap-data-history.component';
import { TankCapDataGridComponent } from './tank-cap/component/tank-cap-data-grid/tank-cap-data-grid.component';
import { LRByLegalComponent } from './lr-by-legal/lr-by-legal.component';
import { LRByLegalHistoryComponent } from './lr-by-legal/components/lr-by-legal-history/lr-by-legal-history.component';
import { LRByLegalMeterDataGridComponent } from './lr-by-legal/components/lr-by-legal-meter-data-grid/lr-by-legal-meter-data-grid.component';
import { DepotManagementComponent } from './depot-management/depot-management.component';
import { DepotManagementDataGridComponent } from './depot-management/components/depot-management-data-grid/depot-management-data-grid.component';
import { DepotManagementHistoryComponent } from './depot-management/components/depot-management-history/depot-management-history.component';
import { DepotManagementImportExcelComponent } from './depot-management/components/depot-management-import-excel/depot-management-import-excel.component';
import { DepotManagementMeterDataGridComponent } from './depot-management/components/depot-management-meter-data-grid/depot-management-meter-data-grid.component';

@NgModule({
  declarations: [
    TankCapComponent,
    TankCapDataGridComponent,
    TankCapDataHistoryComponent,
    LRByLegalComponent,
    LRByLegalHistoryComponent,
    LRByLegalMeterDataGridComponent,
    DepotManagementComponent,
    DepotManagementDataGridComponent,
    DepotManagementHistoryComponent,
    DepotManagementMeterDataGridComponent,
    DepotManagementImportExcelComponent,
  ],
  imports: [
    CommonModule,
    InventoryLRConstrainRoutingModule,
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
export class InventoryLRConstrainModule { }
