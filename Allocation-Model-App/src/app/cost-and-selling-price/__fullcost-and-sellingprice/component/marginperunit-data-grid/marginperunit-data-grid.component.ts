import { MasterSourceDemandDeliveryService } from 'src/app/service/master-source-demand-delivery.service';
import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { v4 as uuid } from 'uuid';
import { CalMarginService } from 'src/app/service/cal-margin.service';
import { FullcostDataGridComponent } from '../fullcost-data-grid/fullcost-data-grid.component';
import { SellingpriceDataGridComponent } from '../sellingprice-data-grid/sellingprice-data-grid.component';

@Component({
  selector: 'app-marginperunit-data-grid',
  templateUrl: './marginperunit-data-grid.component.html',
  styleUrls: ['./marginperunit-data-grid.component.css']
})
export class MarginperunitDataGridComponent implements OnInit {
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;
  numberBoxFormat = '#,##0';
  numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  // sellCost
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'sellPriceCellTemplate';
  year: any = moment().year();
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;

  calMarginData: any = [];
  calMarginDataList: any = [];

  @Input() numberBoxReadOnly = true;
  @Input() maxVersion: any = 0;
  @ViewChild('marginDataGrid', { static: false }) marginDataGrid: DxDataGridComponent;
  @ViewChild('fullCostDataGrid') fullCostDataGrid: FullcostDataGridComponent;
  @ViewChild('sellingPriceDataGrid') sellingPriceDataGrid: SellingpriceDataGridComponent;

  constructor(
    private loaderService: NgxSpinnerService,
    private calMarginService: CalMarginService
  ) { }

  ngOnInit(): void {
    // this.onYearChange(this.year, this.version, this.maxVersion);
  }

  onYearChange(year: any, month: any, version: any, calMarginData?: any) {
    this.loaderService.show();
    this.year = year;
    this.month = month;
    this.version = version;
    // this.maxVersion = maxVersion;
    this.listMonth = []
    let dateStart = moment(this.year + '-' + this.month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        monthName: dateStart.format(this.formatMonthName),
      };

      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];

    this.dynamicColumns.push({
      dataField: 'productName',
      code: 'product',
      caption: 'Product',
      // groupIndex: 0,
      // width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'unitName',
      code: 'unit',
      caption: 'Unit',
      // width: 100,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'sourceName',
      code: 'source',
      caption: 'Source',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'demandName',
      code: 'demand',
      caption: 'Demand',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicColumns.push({
      dataField: 'deliveryName',
      code: 'deliveryPoint',
      caption: 'Delivery Point',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    _.each(this.listMonth, (item) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        caption: item.monthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate,
        fixed: true,
        width: 80
      });
    });

    this.retrieveMasterData().subscribe(res => {
      this.masterData.fullCostManual = res[0];
      this.masterData.sellingPriceManual = res[1];
      this.calMarginData = calMarginData;
      this.retrieveData();
    });

  }

  retrieveMasterData(): Observable<any> {
    // const marginPerUnit = this.calMarginService.getList(this.month, this.year, this.version, 'E834C5F2-ABE8-EB11-AB4B-005056B2E9E2', '77A698B0-A185-EC11-AB51-005056B2E9E2', '458A2AC6-597E-EC11-AB51-005056B2E9E2');
    const fullCostManual = this.calMarginService.getFollCostManual(this.month, this.year, this.version);
    const sellingPriceManual = this.calMarginService.getFollCostManual(this.month, this.year, this.version);
    return forkJoin([fullCostManual, sellingPriceManual]);
  }

  retrieveData() {
    // console.log("this.calMarginData >> ", this.calMarginData);
    // console.log("this.listMonth >> ", this.listMonth);
    let productData = _.uniqBy(_.cloneDeep(this.calMarginData), 'productName');
    // prepare data month
    this.calMarginDataList = [];
    _.each(productData, (item) => {
      _.each(this.listMonth, (i) => {
        item['id'] = _.toUpper(uuid());
        const findData = _.find(_.cloneDeep(this.calMarginData), (x) => {
          return x.productName === item.productName && _.toNumber(x.monthValue) === _.toNumber(i.month) && _.toNumber(x.yearValue) === _.toNumber(i.year)
        });

        if (!this.masterData.fullCostManual.length && !this.masterData.sellingPriceManual.length) {
          item['M' + i.month + i.year] = (findData ? (findData?.sellingPriceValue - findData?.fullCostValue) : 0);
        }
        else {
          // find manual full cost
          let fullCostManualValue = _.find(_.cloneDeep(this.masterData.fullCostManual), it => {
            return it.product === item.productName
              && it.source === item.sourceName
              && it.deliveryPoint === item.deliveryName
              && it.demand === item.demandName
              && _.toNumber(it.month) === _.toNumber(i.month)
              && _.toNumber(it.year) === _.toNumber(i.year)
          });

          // find manual selling price
          let sellingPriceManualValue = _.find(_.cloneDeep(this.masterData.sellingPriceManual), it => {
            return it.product === item.productName
              && it.source === item.sourceName
              && it.deliveryPoint === item.deliveryName
              && it.demand === item.demandName
              && _.toNumber(it.month) === _.toNumber(i.month)
              && _.toNumber(it.year) === _.toNumber(i.year)
          });

          let fullCostValue = (fullCostManualValue ? fullCostManualValue.value : (findData && findData.fullCostValue ? findData?.fullCostValue : 0));
          let sellingPriceValue = (sellingPriceManualValue ? sellingPriceManualValue.value : (findData && findData.sellingPriceValue ? findData?.sellingPriceValue : 0));

          item['M' + i.month + i.year] = (sellingPriceValue - fullCostValue);
          item['fullCostValue_M' + i.month + i.year] = (findData ? findData?.fullCostValue : 0);
          item['sellingPriceValue_M' + i.month + i.year] = (findData ? findData?.sellingPriceValue : 0);

        }

      });
      this.calMarginDataList.push(item);
    });

    // console.log("this.sellPriceList >> ", this.calMarginDataList);
    this.gridRefresh();
    this.loaderService.hide();

  }

  onFullCostSellingPriceManualChangeValue(actionFrom: any, data: any) {

    // console.log('actionFrom :: ', actionFrom);
    // console.log('data :: ', data);
    _.each(data, (item) => {

      let findList = _.find(this.calMarginDataList, i => {
        return i.product === item.productName
          && i.source === item.sourceName
          && i.deliveryPoint === item.deliveryName
          && i.demand === item.demandName
      });

      // console.log("findList >> ", findList);
      if (findList) {
        if (actionFrom === 'fullCost') {
          findList['M' + item.valueMonth + item.year] = (findList['sellingPriceValue_M' + item.valueMonth + item.year] - item.value);
        } else {
          findList['M' + item.valueMonth + item.year] = item.value - (findList['fullCostValue_M' + item.valueMonth + item.year]);
        }
      }

    });

  }

  onEditData($event) {
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      _.each(this.dynamicColumns, (item) => {
        if (item.cellTemplate === 'cellTemplate') {
          item.cellTemplate = 'cellEditTemplate'
        }
      })
    }
    else {
      this.numberBoxReadOnly = true;

      _.each(this.dynamicColumns, (item) => {
        if (item.cellTemplate === 'cellEditTemplate') {
          item.cellTemplate = 'cellTemplate'
        }
      })

    }
    if (this.marginDataGrid && this.marginDataGrid.instance) {
      setTimeout(() => {
        this.marginDataGrid.instance.refresh();
      }, 100);
    }
    this.loaderService.hide();
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log(event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        data[row + index]['M' + (month + index3)] = _.trim(i3)
      });
    });

    return false;

  }

  gridRefresh() {
    if (this.marginDataGrid && this.marginDataGrid.instance) {
      this.marginDataGrid.instance.state(null)
    }
  }

  getDataGridList() {
    return this.masterData.marginPerUnit;
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  clearList() {
    this.calMarginDataList = [];
    this.gridRefresh();
  }

}
