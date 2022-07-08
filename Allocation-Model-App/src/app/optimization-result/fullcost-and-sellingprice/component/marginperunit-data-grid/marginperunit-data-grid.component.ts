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
  cellTemplate = 'cellTemplate';
  year: any = moment().year();
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;

  calMarginData: any = [];
  calMarginDataList: any = [];
  isFirstLoad: boolean = true;

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

  async onYearChange(year: any, month: any, version: any, calMarginData: any, dynamicColumns: any, listMonth: any) {
    // this.loaderService.show();

    this.isFirstLoad = true;
    this.year = year;
    this.month = month;
    this.version = version;
    this.listMonth = listMonth;
    // this.maxVersion = maxVersion;
    this.dynamicColumns = dynamicColumns;
    this.calMarginDataList = calMarginData;
  }

  async retrieveData() {
    // console.log("this.calMarginData >> ", this.calMarginData);
    // console.log("this.listMonth >> ", this.listMonth);
    // let productData = _.uniqBy(_.cloneDeep(this.calMarginData), 'productName');
    let productData = _.uniqBy(_.cloneDeep(this.calMarginData), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
    // prepare data month
    this.calMarginDataList = [];
    _.each(productData, (item) => {
      _.each(this.listMonth, (i) => {
        item['id'] = _.toUpper(uuid());
        const findData = _.find(_.cloneDeep(this.calMarginData), (x) => {
          return x.productName === item.productName &&
            x.customerName === item.customerName &&
            x.customerPlantName === item.customerPlantName &&
            x.sourceId === item.sourceId &&
            x.deliveryId === item.deliveryId &&
            x.demandName === item.demandName &&
            x.conditionsOfSaleId === item.conditionsOfSaleId &&
            _.toNumber(x.monthValue) === _.toNumber(i.month) &&
            _.toNumber(x.yearValue) === _.toNumber(i.year)
        });

        if (!this.masterData.fullCostManual.length && !this.masterData.sellingPriceManual.length) {
          item['M' + i.month + i.year] = (findData ? (findData?.sellingPriceValue - findData?.fullCostValue) : 0);
          item['fullCostValue_M' + i.month + i.year] = findData?.fullCostValue;
          item['sellingPriceValue_M' + i.month + i.year] = findData?.sellingPriceValue;
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

    this.calMarginDataList = _.orderBy(this.calMarginDataList, ['productName', 'customerPlantName'], ['asc', 'asc']);
    // console.log("this.sellPriceList >> ", this.calMarginDataList);
    // this.gridRefresh();
    // this.loaderService.hide();
    console.log('margin');
  }

  onFullCostSellingPriceManualChangeValue(actionFrom: any, data: any) {

    console.log('actionFrom :: ', actionFrom);
    console.log('data :: ', data);
    _.each(data, (item) => {

      let findList = _.find(this.calMarginDataList, i => {
        return i.product === item.productName
          && i.source === item.sourceName
          && i.deliveryPoint === item.deliveryName
          && i.demand === item.demandName
      });

      console.log("findList >> ", findList);
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

  gridRefresh(calBack?) {

    if (this.isFirstLoad) {
      this.gridState(calBack);
      return;
    }

    if (this.marginDataGrid && this.marginDataGrid.instance) {
      this.marginDataGrid.instance.refresh()
      if (calBack) {
        calBack();
      }
    }
  }
  gridState(calBack?) {
    if (this.marginDataGrid && this.marginDataGrid.instance) {
      this.isFirstLoad = false;
      this.marginDataGrid.instance.state(null)
      if (calBack) {
        calBack();
      }
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
    this.gridState();
  }

}
