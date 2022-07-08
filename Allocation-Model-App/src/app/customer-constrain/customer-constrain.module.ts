import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { CustomerConstrainRoutingModule } from './customer-constrain-routing.module';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerInfoComponent } from './customer/customer-info/customer-info.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { ContractInfoComponent } from './contract/contract-info/contract-info.component';
import { ArchwizardModule } from 'angular-archwizard';
import { ConditionSettingComponent } from './contract/component/condition-setting/condition-setting.component';
import { MentionsModule } from '@flxng/mentions';
import { TurnAroundListComponent } from './turn-around/turn-around-list/turn-around-list.component';
import { TurnAroundDetailComponent } from './turn-around/turn-around-detail/turn-around-detail.component';
import { MentionModule } from 'angular-mentions';

import { VolumeConstrainComponent } from './volume-constrain/volume-constrain.component';
import { VolumeConstrainDataGridComponent } from './volume-constrain/components/volume-constrain-data-grid/volume-constrain-data-grid.component';
import { VolumeConstrainHistoryComponent } from './volume-constrain/components/volume-constrain-history/volume-constrain-history.component';
import { VolumeConstrainMeterDataGridComponent } from './volume-constrain/components/volume-constrain-meter-data-grid/volume-constrain-meter-data-grid.component';
import { VolumeConstrainImportExcelComponent } from './volume-constrain/components/volume-constrain-import-excel/volume-constrain-import-excel.component';

@NgModule({
  declarations: [CustomerListComponent
    , CustomerInfoComponent
    , CustomerDetailComponent
    , ContractListComponent
    , ContractInfoComponent
    , ConditionSettingComponent
    , TurnAroundListComponent
    , TurnAroundDetailComponent
    , VolumeConstrainComponent
    , VolumeConstrainDataGridComponent
    , VolumeConstrainHistoryComponent
    , VolumeConstrainMeterDataGridComponent
    , VolumeConstrainImportExcelComponent
  ],

  imports: [
    CommonModule,
    CustomerConstrainRoutingModule,
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
    ArchwizardModule,
    MentionsModule,
    MentionModule
  ]
})
export class CustomerConstrainModule {
  // static forRoot(): ModuleWithProviders<CustomerConstrainModule> {
  //   return {
  //     ngModule: CustomerConstrainModule
  //   };
  // }
}
