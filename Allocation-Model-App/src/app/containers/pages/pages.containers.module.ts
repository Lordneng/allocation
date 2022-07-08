import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListPageHeaderComponent } from './list-page-header/list-page-header.component';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


@NgModule({
  declarations: [
    ListPageHeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    LayoutContainersModule,
    NgSelectModule,
    LightboxModule,
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [
    ListPageHeaderComponent,
  ]
})
export class PagesContainersModule { }
