import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as data_costInput from '../../../examples/allocationdb.CostInput.json'
import * as moment from 'moment';
import productItems from 'src/app/data/products';
import * as _ from 'lodash';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  numberBoxReadOnly = true;
  numberBoxFormat = "#,##0";
  configDrop = {
    url: 'https://httpbin.org/post',
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  };
  form: FormGroup;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild('dxDataGridList') dxDataGridList: DxDataGridComponent;
  rows = productItems.slice(0, 20).map(({ title, sales, stock, category, date }) =>
    ({ title, sales, stock, category, date }));

  itemsPerPage = 10;
  ColumnMode = ColumnMode;
  columns = [
    { prop: 'แก้ไขโดย', name: 'แก้ไขโดย' },
    { prop: 'sales', name: 'Sales' },
    { prop: 'stock', name: 'Stock' },
    { prop: 'category', name: 'Category' },
    { prop: 'date', name: 'Date' }
  ];

  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  dynamicColumns: any[] = [
    // {
    //   dataField: "dataType",
    //   code: "dataType",
    //   caption: "Data Type"
    // },

  ];
  constructor(
    private router: Router, private modalService: BsModalService) { }


  onUploadError(event): void {
    console.log(event);
  }

  onUploadSuccess(event): void {
    console.log(event);
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onPage(event): void {
  }

  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event): void {
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      basicDate: new FormControl(new Date()),
    });
    const formatMonthName = 'MMM-yyyy';
    this.listMonth.push({ Month: 1, MonthName: moment('2021-01-01').format(formatMonthName) })
    this.listMonth.push({ Month: 2, MonthName: moment('2021-02-01').format(formatMonthName) })
    this.listMonth.push({ Month: 3, MonthName: moment('2021-03-01').format(formatMonthName) })
    this.listMonth.push({ Month: 4, MonthName: moment('2021-04-01').format(formatMonthName) })
    this.listMonth.push({ Month: 5, MonthName: moment('2021-05-01').format(formatMonthName) })
    this.listMonth.push({ Month: 6, MonthName: moment('2021-06-01').format(formatMonthName) })
    this.listMonth.push({ Month: 7, MonthName: moment('2021-07-01').format(formatMonthName) })
    this.listMonth.push({ Month: 8, MonthName: moment('2021-08-01').format(formatMonthName) })
    this.listMonth.push({ Month: 9, MonthName: moment('2021-09-01').format(formatMonthName) })
    this.listMonth.push({ Month: 10, MonthName: moment('2021-10-01').format(formatMonthName) })
    this.listMonth.push({ Month: 11, MonthName: moment('2021-11-01').format(formatMonthName) })
    this.listMonth.push({ Month: 12, MonthName: moment('2021-12-01').format(formatMonthName) })
    this.dynamicColumns.push({  // {
      dataField: "RowOrder",
      code: "RowOrder",
      caption: "#",
      minWidth: 20,
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: "product",
      code: "product",
      caption: "Product",
      fixed: true,
      fixedPosition: 'left'
    })
    _.each(this.listMonth, (item) => {
      this.dynamicColumns.push({  // {
        dataField: "M" + item.Month,
        code: item.Month,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: 'cellTemplate'
      })
    })

    let data = (data_costInput as any).default;

    // this.dataList = [];
    // _.each(data, (item) => {
    //   const obj: any = item;
    //   _.each(item.Items, (valses) => {
    //     obj["M" + valses.Month] = valses.Value
    //   })
    //   this.dataList.push(obj);
    // });
    this.dataList = [];
    _.each(_.filter(data, (item) => { return item.Product === 'ngl' }), (item) => {
      const obj: any = {};
      _.each(item.Items, (valses) => {
        obj["M" + valses.Month] = valses.Value
      })
      obj.product = item.Source + "(" + item.Currency + ")";
      obj.Cost = item.Product
      this.dataList.push(obj);
    });
  }
  onPaste(event: any, month: any, row: any) {
    console.log(event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        console.log(i3)
        this.dataList[row + index]["M" + (month + index3)] = _.trim(i3)
      });
    });

    return false;

  }
  updateRow($event: any) {
    console.log('$event', $event)
  }
  getCellCssClass(date) {
    var cssClass = "";

    // if(this.isWeekend(date))
    //     cssClass = "weekend";

    // this.holydays.forEach(function(item) {
    //     if(date.getDate() === item[0] && date.getMonth() === item[1]) {
    //         cssClass = "holyday";
    //         return false;
    //     }
    // });

    return cssClass;
  }
  onEditData($event) {
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      this.numberBoxFormat = "";
    }
    else {
      this.numberBoxReadOnly = true;
      this.numberBoxFormat = "#,###";
    }


  }
}
