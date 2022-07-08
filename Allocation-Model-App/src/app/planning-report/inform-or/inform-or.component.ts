import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ISidebar, SidebarService } from '../../containers/layout/sidebar/sidebar.service';
import { AbilityReportInformComponent } from './ability-report/ability-report.component';
import { ORDemandInformComponent } from './or-demand/or-demand.component';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inform-or',
  templateUrl: './inform-or.component.html',
  styleUrls: ['./inform-or.component.css']
})
export class InformORComponent implements OnInit {

  year: any;
  month: any;
  date: any;
  dateOld: any;
  yearSearch: any = '';
  orDemandPlanVersionList: any = [];
  m7VersionId: any;
  m7Version: any = null;
  numberBoxDigi = 0;

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
  @ViewChild('dataGridAbility') dataGridAbility: AbilityReportInformComponent;
  @ViewChild('dataORDemandInform') dataORDemandInform: ORDemandInformComponent;

  constructor(
    private hotkeysService: HotkeysService,
    private router: Router,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private sidebarService: SidebarService,
    private orDemandPlantService: OrDemandPlantService,) { 
      this.date = moment();
      this.dateOld = this.date;
      this.year = moment().year();
      this.month = moment().month() + 1;
      this.yearSearch = this.year;
    }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    // this.loaderService.show();
    setTimeout(() => {
      // this.accessMenuList();
      this.yearChange();
    }, 500);
  }

  onYearChange($event) {
    console.log('$event', $event)
    this.year = moment($event.value).format('yyyy');
    this.yearChange();
  }

  retrieveMasterData(): Observable<any> {
    const orDemandPlanVersionList = this.orDemandPlantService.getVersion(this.year, this.month);
    return forkJoin([orDemandPlanVersionList]);
  }

  yearChange() {

    console.log('this.year',this.year);
    console.log('this.month', this.month);

    let dateStart = moment(this.year + '-' + this.month + '-01');

    this.retrieveMasterData().subscribe((res) => {
      console.log('res :: ', res);
      this.orDemandPlanVersionList = res[0];
      this.dataORDemandInform.onYearChange(this.year, this.month, this.m7Version);
      this.dataGridAbility.onYearChange(this.year, this.month, this.m7Version);
    });
    
  }

  onAccept(evevt: any, callback?: any) {
    if(this.m7VersionId){

      this.m7Version = this.orDemandPlanVersionList.find((obj) => {
        return obj.id == this.m7VersionId;
      });

      this.yearChange();
    }
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
  }

  exportFile() {

    // DOC : https://www.ngdevelop.tech/export-to-excel-in-angular-6/

    if(!this.m7VersionId){
      Swal.fire({
        title: 'ไม่สามารถทำรายการได้',
        text: 'กรุณาเลือกข้อมูล OR Demand Plan Version',
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'ปิด',
      });

      return;
    }

    let abilityData = this.dataGridAbility.getDataList();
    let oRDemandData = this.dataORDemandInform.getDataList();

    console.log('abilityData',abilityData);
    console.log('oRDemandData',oRDemandData);
    // return;

    const title = 'Inform OR Report';
    const header = [];
    _.each(abilityData.table1.header, (data,index) => {
      header.push(data.caption);
    });
    const data = [];
    
    _.each(abilityData.table1.items, (item,indexItem) => {
      const dataItems = [];
      _.each(abilityData.table1.header, (data,index) => {
        // console.log('item.data',item[data.dataField]);
        dataItems.push(item[data.dataField]);
      });
      data[indexItem] = dataItems;
    });

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ability');

    // Add new row
    let titleRow = worksheet.addRow([title]);

    //Add Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA000' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    _.each(data, (d,index) => {
      let row = worksheet.addRow(d);
      let rowNum = row['_number'];
      if(rowNum%2 == 1){
        row.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE082' }
          }
        });
      }
    });

    // worksheet.addRows(null);

    worksheet.addRow([]);

    const headerImport = [];
    _.each(abilityData.table2.header, (data,index) => {
      headerImport.push(data.caption);
    });

    //Add Header Row
    let headerRowImport = worksheet.addRow(headerImport);
    headerRowImport.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA000' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    const dataImport = [];
    
    _.each(abilityData.table2.items, (item,indexItem) => {
      const dataItems = [];
      _.each(abilityData.table2.header, (data,index) => {
        // console.log('item.data',item[data.dataField]);
        dataItems.push(item[data.dataField]);
      });
      dataImport[indexItem] = dataItems;
    });

    _.each(dataImport, (d,index) => {
      let row = worksheet.addRow(d);
      let rowNum = row['_number'];
      if(rowNum%2 == 1){
        row.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE082' }
          }
        });
      }
    });

    /// Sheet OR Demand ///
    const title2 = 'OR Demand';
    const header2 = [];
    _.each(oRDemandData.table1.header, (data,index) => {
      header2.push(data.caption);
    });
    const data2 = [];
    
    _.each(oRDemandData.table1.items, (item,indexItem) => {
      const dataItems = [];
      _.each(oRDemandData.table1.header, (data,index) => {
        // console.log('item.data',item[data.dataField]);
        dataItems.push(item[data.dataField]);
      });
      data2[indexItem] = dataItems;
    });

    let worksheet2 = workbook.addWorksheet('OR Demand');

    // Add new row
    let titleRow2 = worksheet2.addRow([title2]);

    //Add Header Row
    let headerRow2 = worksheet2.addRow(header2);
    headerRow2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA000' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    _.each(data2, (d,index) => {
      let row = worksheet2.addRow(d);
      let rowNum = row['_number'];
      if(rowNum%2 == 1){
        row.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE082' }
          }
        });
      }
    });
    

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'InformOR_Report.xlsx');
    });
  }

  tabAbilityChange($event) {
    this.dataGridAbility.onYearChange(this.year, this.month, this.m7Version);
  }

  tabDemandChange($event) {
    this.dataORDemandInform.onYearChange(this.year, this.month, this.m7Version);
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

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }
}
