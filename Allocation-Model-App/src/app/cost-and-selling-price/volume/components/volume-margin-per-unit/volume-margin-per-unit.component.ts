import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleChanges } from '@angular/core';
import { MasterSourceDemandDeliveryService } from 'src/app/service/master-source-demand-delivery.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-volume-margin-per-unit',
  templateUrl: './volume-margin-per-unit.component.html',
  styleUrls: ['./volume-margin-per-unit.component.css']
})
export class VolumeMarginPerUnitComponent implements OnInit {
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  numberBoxDigi = 0;

  dynamicColumns: any[] = [];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = moment().format('yyyy');
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  @Input() maxVersion: any = 0;
  constructor(
      private demandDeliveryService: MasterSourceDemandDeliveryService,
      private loaderService: NgxSpinnerService) { }

  @ViewChild('dxDataGridList', { static: false }) dxDataGridList: DxDataGridComponent;
  ngOnInit(): void {

      // this.onYearChange(this.year, this.version, this.maxVersion);
  }
  
  onYearChange(year: any, version: any, maxVersion) {

      this.loaderService.show();

      this.year = year;
      this.version = version;
      this.maxVersion = maxVersion;
      this.listMonth = []
      this.listMonth.push({ Month: 1, MonthName: moment(this.year + '-01-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 2, MonthName: moment(this.year + '-02-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 3, MonthName: moment(this.year + '-03-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 4, MonthName: moment(this.year + '-04-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 5, MonthName: moment(this.year + '-05-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 6, MonthName: moment(this.year + '-06-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 7, MonthName: moment(this.year + '-07-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 8, MonthName: moment(this.year + '-08-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 9, MonthName: moment(this.year + '-09-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 10, MonthName: moment(this.year + '-10-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 11, MonthName: moment(this.year + '-11-01').format(this.formatMonthName) })
      this.listMonth.push({ Month: 12, MonthName: moment(this.year + '-12-01').format(this.formatMonthName) })

      this.dynamicColumns = [];
      this.dynamicColumns.push({
          dataField: 'product',
          code: 'product',
          caption: '',
          groupIndex: 1,
          width: 180,
          fixed: true,
          fixedPosition: 'left'
      })

      this.dynamicColumns.push({
          dataField: 'unit',
          code: 'unit',
          caption: 'Unit',
          width: 80,
          fixed: true,
          fixedPosition: 'left'
      })

      this.dynamicColumns.push({
          dataField: 'source',
          code: 'source',
          caption: 'Source',
          alignment: 'center',
          width: 120,
          fixed: true,
          fixedPosition: 'left'
      })

      this.dynamicColumns.push({
          dataField: 'demand',
          code: 'demand',
          caption: 'Demand',
          width: 250,
          fixed: true,
          fixedPosition: 'left'
      })

      this.dynamicColumns.push({
          dataField: 'deliveryPoint',
          code: 'deliveryPoint',
          caption: 'Delivery point',
          alignment: 'center',
          width: 100,
          fixed: true,
          fixedPosition: 'left'
      })

      _.each(this.listMonth, (item) => {
          this.dynamicColumns.push({
              dataField: 'M' + item.Month,
              code: item.Month,
              caption: item.MonthName,
              dataType: 'number',
              cellTemplate: this.cellTemplate
          })
      })

      this.retrieveMasterData().subscribe(res => {
          this.masterData.masterDemand = res[0];
          this.loaderService.hide();
      });

  }

  retrieveMasterData(): Observable<any> {

      const masterDemand = this.demandDeliveryService.getList();
      return forkJoin([masterDemand]);

  }

  retrieveData() {

      _.each(this.masterData.masterCosts, (item) => {
          let data = _.filter(this.masterData.costs, (itemCost) => {
              return itemCost.cost === item.value;
          });
          item.dataList = _.orderBy(data, ['rowOrder'], ['asc'])
          data = _.filter(this.masterData.costMaxVersion, (itemCost) => {
              return itemCost.cost === item.value;
          });
          item.dataListMaxVersion = _.orderBy(data, ['rowOrder'], ['asc'])

          if (item.dataList && item.dataList.length <= 0) {
              _.each(this.masterData.masterProducts, (itemProduct) => {
                  item.dataList.push({ product: itemProduct.name, rowOrder: itemProduct.rowOrder });
                  item.dataListMaxVersion.push({ product: itemProduct.name, rowOrder: itemProduct.rowOrder });
              });
          }

      })
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

  onEditData($event) {
      this.loaderService.show();
      if (this.numberBoxReadOnly) {
          this.numberBoxReadOnly = false;
      }
      else {
          this.numberBoxReadOnly = true;
      }

      this.loaderService.hide();
  }

  getDataSave() {
      let datalist = [];
      _.each(this.masterData.masterCosts, (item) => {
          _.each(item.dataList, (itemProduct) => {
              let data: any = {};
              data.year = this.year;
              data.cost = item.value;
              data.product = itemProduct.product;
              data.rowOrder = _.toNumber(itemProduct.rowOrder);
              if (this.maxVersion) {
                  data.version = _.toNumber(this.maxVersion) + 1;
              } else {
                  data.version = 1;
              }

              _.each(this.listMonth, (itemMonth) => {
                  data['M' + itemMonth.Month] = _.toNumber(itemProduct['M' + itemMonth.Month]);
              })
              datalist.push(data);
          })

      })
      return datalist;
  }
  getDataMaxVersion(item: any, itemTemp: any) {

      return item.dataListMaxVersion[itemTemp.rowIndex][itemTemp.column.dataField]
  }
}
