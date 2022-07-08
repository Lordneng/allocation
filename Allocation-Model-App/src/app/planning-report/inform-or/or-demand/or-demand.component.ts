import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { MasterContractService } from 'src/app/service/master-contract.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-or-demand-inform',
  templateUrl: './or-demand.component.html',
  styleUrls: ['./or-demand.component.css'],
})
export class ORDemandInformComponent implements OnInit {

  dataList: any = [];
  cellTemplate = 'cellTemplate';
  dynamicColumns: any[] = [];
  m7version: any;
  year: any = '2021';
  @Input() numberBoxDigi = 0;
  @Input() month: any = 1;
  listMonth = [];
  masterData: any = {};

  formatMonthName = 'MMM-yyyy';

  @ViewChild('dataGridOrDemand', { static: false }) dataGridOrDemand: DxDataGridComponent;
  constructor(
    private loaderService: NgxSpinnerService,
    private masterContractService: MasterContractService,
    private orDemandPlantService: OrDemandPlantService,
    ) { }

  onToolbarPreparing(e){  
    e.toolbarOptions.visible = false;  
  } 

  ngOnInit(): void {}

  onYearChange(year: any, month: any, m7version: any, dataImport?: any, callback?: any) {
    this.loaderService.show();
    this.m7version = m7version;
    this.month = month;
    this.year = year;
    this.dataList = [];
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    dateStart = dateStart.add(1, 'M');
    for (let index = 1; index <= 12; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        MonthName: dateStart.format(this.formatMonthName),
        visible: true,
      };
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'sourceName',
      code: 'Source',
      caption: 'Source',
      fixed: true,
      fixedPosition: 'left',
    });
    this.dynamicColumns.push({
      dataField: 'demandName',
      code: 'Demand',
      caption: 'Demand',
      fixed: true,
      fixedPosition: 'left',
    });
    this.dynamicColumns.push({
      dataField: 'deliveryName',
      code: 'DeliveryPoint',
      caption: 'Delivery Point',
      fixed: true,
      fixedPosition: 'left',
    });

    _.each(this.listMonth, (item) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        caption: item.MonthName,
        format: 'fixedPoint',
        dataType: 'number',
        precision: 2,
        cellTemplate: this.cellTemplate
      });
    });

    this.loaderService.hide();

    this.retrieveMasterData().subscribe(res => {
      console.log("res source TAB 2 :: ", res);
      this.masterData.masterContractProduct = res[0];
      this.masterData.masterData = res[1];
      this.setRetrieveData();
      if (callback) {
        callback();
      }
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterContractProduct = this.masterContractService.getGen(this.year, this.month);
    const masterDataManual = this.orDemandPlantService.getListValue(this.year, this.month, this.m7version?.version);
    return forkJoin([masterContractProduct, masterDataManual]);
  }

  setRetrieveData() {

    if(this.masterData.masterData?.length > 0){

      _.each(this.masterData.masterContractProduct, (item, index) => {
        let objectPush: any = item;
        objectPush.id = index;
  
        _.each(this.listMonth, async (itemMonth) => {
          const data = this.masterData.masterData?.filter(
            data => data.sourceName == item.sourceName &&
              data.demandName == item.demandName &&
              data.deliveryName == item.deliveryName &&
              data.monthValue == itemMonth.month &&
              data.yearValue == itemMonth.year);
          if (data?.length > 0) {
            objectPush['M' + itemMonth.month + itemMonth.year] = data[0].value;
            //objectPush['RealM' + itemMonth.month + itemMonth.year] = await this.getValueFromSourceDelivery(item.sourceName, item.demandName, item.deliveryName, item.transportationTypeCode, itemMonth.month, itemMonth.year);
          } else {
            objectPush['M' + itemMonth.month + itemMonth.year] = 0;
            //objectPush['M' + itemMonth.month + itemMonth.year] = await this.getValueFromSourceDelivery(item.sourceName, item.demandName, item.deliveryName, item.transportationTypeCode, itemMonth.month, itemMonth.year);
          }
        });
  
        this.dataList.push(objectPush);
      })

    }

  }

  getDataList(){
    let dataListRes: any = [];

    dataListRes.table1 = {
      header: this.dynamicColumns,
      items: this.dataList
    }

    return dataListRes;
  }

  onRowPrepared(e) {
    if (e.rowType == 'data' && e.dataIndex%2 == 0) {  
      // e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#FFFDE7';
    }
    if (e.rowType === 'data' && e.data.type == 'Total') {
      e.rowElement.style.fontWeight = "bolder";
      // e.rowElement.style.backgroundColor = '#ECEFF1';
    }
  }
  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 2) {
      // e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 2)] === true) {
      // e.cellElement.classList.add('backgroundColorPaste');

    }
  }
}
