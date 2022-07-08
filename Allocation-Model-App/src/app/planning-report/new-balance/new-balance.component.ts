import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { Workbook } from 'exceljs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AbilityReportComponent } from './ability-report/ability-report.component';
import { BalanceReportComponent } from './balance-report/balance-report.component';
import { DistributionPlanReportComponent } from './distribution-plan-report/distribution-plan-report.component';
import { AdjustPlanReportComponent } from './adjust-plan-report/adjust-plan-report.component';

@Component({
  selector: 'app-new-balance',
  templateUrl: './new-balance.component.html',
  styleUrls: ['./new-balance.component.css']
})
export class NewBalanceComponent implements OnInit {

  year: any;
  month: any;
  date: any;
  dateOld: any;
  yearSearch: any = '';
  sidebar: ISidebar;
  subscription: Subscription;
  dataInfo: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('dataGridAbility') dataGridAbility: AbilityReportComponent;
  @ViewChild('dataGridBalance') dataGridBalance: BalanceReportComponent;
  @ViewChild('dataGridDisPlant') dataGridDisPlant: DistributionPlanReportComponent;
  @ViewChild('dataGridAdjustPlant') dataGridAdjustPlant: AdjustPlanReportComponent;

  constructor(
    private hotkeysService: HotkeysService,
    private router: Router,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private sidebarService: SidebarService,) {
      this.date = moment();
      this.dateOld = this.date;
      this.year = moment().year();
      this.month = moment().month() + 1;
      this.yearSearch = this.year;
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.yearChange();
    }, 500);
  }

  yearChange() {

    console.log('this.year',this.year);
    console.log('this.month', this.month);

    this.dataGridAbility.onYearChange(this.year, this.month);
    this.dataGridBalance.onYearChange(this.year, this.month);
    this.dataGridDisPlant.onYearChange(this.year, this.month);
    this.dataGridAdjustPlant.onYearChange(this.year, this.month);
    
    this.loaderService.hide();
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
    console.log('ee', e);
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }

  exportFile() {

    // DOC : https://www.ngdevelop.tech/export-to-excel-in-angular-6/

    // if(!this.m7VersionId){
    //   Swal.fire({
    //     title: 'ไม่สามารถทำรายการได้',
    //     text: 'กรุณาเลือกข้อมูล OR Demand Plan Version',
    //     icon: 'warning',
    //     showConfirmButton: true,
    //     confirmButtonText: 'ปิด',
    //   });

    //   return;
    // }

    let workbook = new Workbook();

    // TAB Ability
    this.dataGridAbility.getWorkSheet(workbook);

    // TAB Balance { Ethane, CL3LPG, NGL, PENTANE }
    this.dataGridBalance.getWorkSheet(workbook);

    // TAB แผนจำหน่าย
    this.dataGridDisPlant.getWorkSheet(workbook);

    // TAB ปรับแผนจำหน่าย
    this.dataGridAdjustPlant.getWorkSheet(workbook);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'New_Balance_Report.xlsx');
    });
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  searchClick() {
    this.loaderService.show();
    this.year = moment(this.date).format('yyyy');
    this.month = moment(this.date).format('M');
    this.yearChange();
    this.modalRef.hide();
  }
  searchCancelClick() {
    this.date = this.dateOld;
    this.modalRef.hide();
  }
}
