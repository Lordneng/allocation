import { Component, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RefPricesService } from 'src/app/service/reference-prices.service';
import { MasterReferencePricesService } from "src/app/service/master-reference-prices.service";
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import data from 'src/app/constants/menu';
import { BaseService } from 'src/app/service/base.service';
import { MasterUnitService } from 'src/app/service/master-unit.service';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-optimization-data-grid-c2',
  templateUrl: './optimization-data-grid-c2.component.html',
  styleUrls: ['./optimization-data-grid-c2.component.css']
})
export class OptimizationDataGridC2Component implements OnInit {
  dataList: any = [];
  dataListRevision: any = [];
  dataListVersion0: any = [];
  dataListAbility0: any = [];
  dataListAbility0Version0: any = [];
  dataListAbility1: any = [];
  dataListAbility1Version0: any = [];
  dataListStandardRate: any = [];
  dataListStandardRateVersion0: any = [];
  dataListAllocate: any = [];
  dataListAllocateVersion0: any = [];
  dataListSCG: any = [];
  dataListSCGVersion0: any = [];
  dataListGC: any = [];
  dataListGCVersion0: any = [];
  dataListBalance: any = [];
  dataListBalanceVersion0: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  @Input() numberBoxDigi = 0;
  numberBoxFormat = '#,##0';
  // numberBoxDigi = 0;

  dynamicColumns: any[] = [];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = '2021';
  @Input() month: any = 1;
  monthNow: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};

  popupVisible = false;
  popupVisibleEdit = false;
  popupEditSpacialVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  isRecursive = false;
  recursiveMonth: any = 0;
  dataMaster: any = [];
  dataInfoPopup: any = {};
  validateResult: any = { isValid: true };
  isWithOutDemandAI: boolean = false;

  isFirstLoad: boolean = true;
  @Input() dataInfo: any = {};
  @Input() maxVersion: any = 0;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('targetGroupPopup', { static: true }) validationGroupPopup: DxValidationGroupComponent;
  @ViewChild('dataGridAbility0', { static: false }) dataGridAbility0: DxDataGridComponent;
  @ViewChild('dataGridAbility1', { static: false }) dataGridAbility1: DxDataGridComponent;
  @ViewChild('dataGridStandardRate', { static: false }) dataGridStandardRate: DxDataGridComponent;
  @ViewChild('dataGridAllocate', { static: false }) dataGridAllocate: DxDataGridComponent;
  @ViewChild('dataGridSCG', { static: false }) dataGridSCG: DxDataGridComponent;
  @ViewChild('dataGridGC', { static: false }) dataGridGC: DxDataGridComponent;
  @ViewChild('dataGridBalance', { static: false }) dataGridBalance: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChildren(DxDataGridComponent) dataGrids: QueryList<DxDataGridComponent>

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fas fa-plus",
          onClick: this.addClick.bind(this),
        },
      }
    );
  }
  constructor(private masterCostsService: MasterCostsService,
    private refPricesService: RefPricesService,
    private modalService: BsModalService,
    private masterPricesService: MasterReferencePricesService,
    private loaderService: NgxSpinnerService,
    private unitService: MasterUnitService,
    private baseService: BaseService,
    private optimizationsService: OptimizationsService) { }

  ngOnInit(): void {
    //จำลองข้อมูล
  }

  ngAfterViewInit(): void { }

  async onYearChange(year: any, month: any, version: any, maxVersion, isWithOutDemandAI: boolean, listMonth: any, dynamicColumns: any, revisionMonth: any, dataList: any, dataListRevision: any, masterUnit) {
    // this.loaderService.show();
    this.isFirstLoad = true;
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.isWithOutDemandAI = isWithOutDemandAI;
    this.dynamicColumns = dynamicColumns;


    this.dataMaster.masterUnit = masterUnit;
    this.dataList = dataList;
    this.dataListRevision = dataListRevision;
    this.listMonth = listMonth;

    this.dataListAbility0 = [];
    this.dataListAbility1 = [];
    this.dataListStandardRate = [];
    this.dataListAllocate = [];
    this.dataListSCG = [];
    this.dataListGC = [];
    this.dataListBalance = [];

    // let dateStart = moment(this.year + '-' + month + '-01');
    // dateStart = moment(dateStart).add(1, 'M');
    // let monthStart = dateStart.month();
    // let yearStart = dateStart.year();
    // for (let index = 1; index < 13; index++) {
    //   const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName), visible: true }
    //   this.listMonth.push(data);

    //   dateStart = dateStart.add(1, 'M');
    //   monthStart = dateStart.month();
    //   yearStart = dateStart.year();
    // }

    // const column0 = {
    //   dataField: 'production',
    //   code: 'production',
    //   caption: 'Production',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '250'
    // };

    // const column1 = {
    //   dataField: 'unit',
    //   code: 'unit',
    //   caption: 'Unit',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '100',
    //   alignment: 'center'
    // };

    // this.dynamicColumns = [];
    // let revisionMonth = {};
    // this.dynamicColumns.push(column0);
    // this.dynamicColumns.push(column1);

    // _.each(this.listMonth, (item, index) => {
    //   this.dynamicColumns.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     name: 'M' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     dataType: 'number',
    //     cellTemplate: this.cellTemplate,
    //     month: item.Month,
    //     year: item.Year
    //   })

    //   revisionMonth['listRevision' + 'M' + item.Month + item.Year] = [];
    // })

    // this.retrieveMasterData().subscribe(res => {
    //   console.log("res :: ", res);
    //   this.masterData.masterPrices = res[0];
    //   this.masterData.refPrices = res[1];
    //   this.masterData.refPricesVersion0 = _.cloneDeep(res[1]);
    //   this.masterData.refPricesManual = res[2];
    //   this.isRecursive = false;
    //   this.retrieveData(dataImport);
    //   if (callback) {
    //     callback();
    //   }
    // });

    //ใส่ production และ Unit กรณีไม่มีการบันทึกข้อมู,ใน database
    this.dataListAbility0.push({
      rowOrder: 1,
      production: 'Total C2',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility0'
    });

    this.dataListAbility0.push({
      rowOrder: 2,
      production: 'Low CO2 (ETU 65 Ton/hr.)',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility0'
    });

    this.dataListAbility0.push({
      rowOrder: 3,
      production: 'Diff New - Old(Total C2)',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility0'
    });

    this.dataListAbility0.push({
      rowOrder: 4,
      production: 'Diff New - Old(Low CO2)',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility0'
    });

    this.dataListAbility1.push({
      rowOrder: 1,
      production: 'Total C2',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility1'
    });

    this.dataListAbility1.push({
      rowOrder: 2,
      production: 'Low CO2 (ETU 65 Ton/hr.)',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility1'
    });

    this.dataListAbility1.push({
      rowOrder: 3,
      production: 'Total C2',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListAbility1'
    });

    this.dataListAbility1.push({
      rowOrder: 4,
      production: 'Low CO2 (ETU 65 Ton/hr.)',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListAbility1'
    });

    this.dataListStandardRate.push({
      rowOrder: 1,
      production: 'Total C2 to GC',
      unit: 'Ton/hr.',
      isViewOnly: false,
      headerName: 'dataListStandardRate'
    });

    this.dataListStandardRate.push({
      rowOrder: 2,
      production: 'C2 Low CO2 to SCG',
      unit: 'Ton/hr.',
      isViewOnly: false,
      headerName: 'dataListStandardRate'
    });

    this.dataListStandardRate.push({
      rowOrder: 3,
      production: 'GSP C2 Low CO2 Production < 65 Ton/hr.',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListStandardRate'
    });

    this.dataListAllocate.push({
      rowOrder: 1,
      production: 'GC',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListAllocate'
    });

    this.dataListAllocate.push({
      rowOrder: 2,
      production: 'SCG',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListAllocate'
    });

    this.dataListSCG.push({
      rowOrder: 1,
      production: 'SCG Demand',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 2,
      production: 'SCG Demand',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 3,
      production: 'SCG Demand',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 4,
      production: 'SCG Demand',
      unit: 'Ton/day',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 5,
      production: 'Allo C2 Low CO2 to SCG',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 6,
      production: 'Allo C2 Low CO2 to SCG',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 7,
      production: 'Allo C2 Low CO2 to SCG',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListSCG.push({
      rowOrder: 8,
      production: 'Allo C2 Low CO2 to SCG',
      unit: 'Ton/day',
      isViewOnly: true,
      headerName: 'dataListSCG'
    });

    this.dataListGC.push({
      rowOrder: 1,
      production: 'Allo C2 Low CO2 to GC',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 2,
      production: 'Allo C2 High CO2 to GC',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 3,
      production: 'Total Allo to GC',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 4,
      production: 'Allo C2 Low CO2 to GC',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 5,
      production: 'Allo C2 High CO2 to GC',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 6,
      production: 'Allo C2 Low CO2 to GC',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 7,
      production: 'Allo C2 High CO2 to GC',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListGC.push({
      rowOrder: 8,
      production: 'Total Allo to GC',
      unit: 'Ton/hr.',
      isViewOnly: true,
      headerName: 'dataListGC'
    });

    this.dataListBalance.push({
      rowOrder: 1,
      production: 'Total C2',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListBalance'
    });

    this.dataListBalance.push({
      rowOrder: 2,
      production: 'C2 Low CO2',
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListBalance'
    });

    this.dataListSCG[0] = _.merge(this.dataListSCG[0], revisionMonth);

    this.setDataList();
    this.dataMaster.standardRate = { GC: 260, SCG: 15 };

    _.each(this.dataListStandardRate, (it) => {
      if (it.production != 'GSP C2 Low CO2 Production < 65 Ton/hr.') {
        let standardRate = (it.production === 'Total C2 to GC' ? this.dataMaster.standardRate.GC : this.dataMaster.standardRate.SCG);
        _.each(this.listMonth, (item, index) => {
          it['M' + item.Month + item.Year] = standardRate;
        });
      }
    });

    // console.log('this.dataListStandardRate >> ', this.dataListStandardRate);
    // console.log("this.dataMaster > ", this.dataMaster.standardRate);

  }

  setDataList() {
    console.log('setDataList C2')
    _.each(this.dataListAbility0, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListAbility1, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListStandardRate, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListAllocate, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListSCG, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          const filterRevision = _.filter(_.cloneDeep(this.dataListRevision), { optimizationC2Id: i.id });
          if (filterRevision) {
            item['listRevisionM' + i.monthValue + i.yearValue] = filterRevision;
            // find manual
            const findManual = _.orderBy(_.cloneDeep(filterRevision), ['rowOrder'], ['DESC']);
            if (findManual && findManual[0]?.isManual) {
              item['M' + i.monthValue + i.yearValue] = findManual[0]?.valueManual || 0;
              item['isPasteM' + i.monthValue + i.yearValue] = true;
            }
          }
        });
      }
    });

    _.each(this.dataListGC, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListBalance, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    // console.log('this.dataListSCG >> ', this.dataListSCG);

  }


  onPaste(event: any, month: any, row: any, data: any) {
    console.log(event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        data[row + index]['M' + (month + index3)] = _.trim(i3).replace(',', '')
      });
    });

    return false;
  }

  onEditData($event) {
    // this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
    }
    else {
      this.numberBoxReadOnly = true;
    }
    // this.loaderService.hide();
  }

  // onEditData($event) {
  //   this.loaderService.show();
  //   if (this.numberBoxReadOnly) {
  //     this.numberBoxReadOnly = false;
  //     _.each(this.dynamicColumns, (item) => {
  //       if (item.cellTemplate === 'cellTemplate') {
  //         item.cellTemplate = 'cellEditTemplate'
  //       }
  //     })
  //   }
  //   else {
  //     this.numberBoxReadOnly = true;

  //     _.each(this.dynamicColumns, (item) => {
  //       if (item.cellTemplate === 'cellEditTemplate') {
  //         item.cellTemplate = 'cellTemplate'
  //       }
  //     })

  //   }
  //   if (this.dataGridList && this.dataGridList.instance) {
  //     console.log('data', this.dynamicColumns);
  //     setTimeout(() => {
  //       this.dataGridList.instance.state(null);
  //     }, 100);
  //   }
  //   this.loaderService.hide();
  // }

  getDataSave(isSaveAs: boolean, isWithOutDemandAI?: boolean, versionSave?: number) {
    console.log("this.dataListSCG >> ", this.dataListSCG);
    let dataSave: any = {};
    dataSave.optimizationC2 = [];
    dataSave.optimizationC2Revision = [];
    // dataSave.optimizationVersion = {};
    // let versionSave = this.version;
    // if (!isSaveAs) {
    //   versionSave = (!this.version ? 1 : this.version);
    // }
    // else {
    //   versionSave = (!this.version ? 1 : this.version + 1);
    // }

    let allDataList = [
      ...this.dataListAbility0,
      ...this.dataListAbility1,
      ...this.dataListStandardRate,
      ...this.dataListAllocate,
      ...this.dataListSCG,
      ...this.dataListGC,
      ...this.dataListBalance
    ];

    console.log("allDataList >>", allDataList);

    _.each(allDataList, (i) => {
      _.each(this.listMonth, (x) => {

        let optimizationC2Id = uuid();

        dataSave.optimizationC2.push({
          id: optimizationC2Id,
          productionGroup: i?.headerName,
          production: i?.production,
          unit: i?.unit,
          isViewOnly: i?.isViewOnly,
          year: _.toNumber(this.year),
          month: _.toNumber(this.month),
          version: versionSave,
          yearValue: x.Year,
          monthValue: x.Month,
          value: i["M" + x.Month + x.Year] || 0,
          remark: i["RemarkM" + x.Month + x.Year] || null,
          isWithOutDemandAI: isWithOutDemandAI
        });

        if (i['listRevisionM' + x.Month + x.Year]?.length) {
          _.each(_.cloneDeep(i['listRevisionM' + x.Month + x.Year]), (v) => {
            dataSave.optimizationC2Revision.push({
              optimizationC2Id: optimizationC2Id,
              unit: v?.unit,
              value: v?.value,
              remark: v?.remark,
              workDay: v?.workDay,
              isManul: (v?.isManul ? v?.isManul : false),
              valueManual: v?.valueManual || null,
              year: _.toNumber(this.year),
              month: _.toNumber(this.month),
              version: versionSave,
              rowOrder: v?.rowOrder,
              activeStatus: 1,
              isWithOutDemandAI: isWithOutDemandAI
            });
          });
        }

      });
    });

    console.log('dataSave ', dataSave);
    return dataSave;
  }
  gridRefresh(calBack?) {
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoad) {
      this.gridState(calBack);
      return;
    }

    if (this.dataGridAbility0 && this.dataGridAbility0.instance) {
      this.dataGridAbility0.instance.refresh();
      this.dataGridAbility1.instance.refresh();
      this.dataGridStandardRate.instance.refresh();
      this.dataGridAllocate.instance.refresh();
      this.dataGridSCG.instance.refresh();
      this.dataGridGC.instance.refresh();
      this.dataGridBalance.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridState(calBack?) {
    if (this.dataGridAbility0 && this.dataGridAbility0.instance) {
      this.isFirstLoad = false;
      this.dataGridAbility0.instance.state(null);
      this.dataGridAbility1.instance.state(null);
      this.dataGridStandardRate.instance.state(null);
      this.dataGridAllocate.instance.state(null);
      this.dataGridSCG.instance.state(null);
      this.dataGridGC.instance.state(null);
      this.dataGridBalance.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }
  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }


  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  itemClick(event: any, row: any, columnIndex: any, data: any, item: any, dataField: any, monthEdit?: any, yearEdit?: any) {
    if (event.itemData.text === 'Paste') {
      navigator.clipboard.readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningIndex = columnIndex;
            _.each(i2.split('\t'), (i3, index3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (dataText && _.isNumber(dataText)) {
                if (columnIndex <= 12) {
                  let month = this.listMonth[runningIndex].Month;
                  let year = this.listMonth[runningIndex].Year;
                  data[row + index]['isPasteM' + month + year] = true;
                  data[row + index]['M' + month + year] = dataText;
                  runningIndex++;
                }
              } else {
                Swal.fire({
                  title: 'ไม่สารถนำข้อมูลมาแสดงเพิ่ม',
                  text: 'เนื่องจากข้อมูลที่ Copy มาไม่เป็นตัวเลข',
                  icon: 'error',
                  showConfirmButton: true,
                  confirmButtonText: 'ปิด'
                  //timer: 1000
                })
                return false;
              }
            });
          });
        })
        // (A3) OPTIONAL -CANNOT ACCESS CLIPBOARD
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });
    } else if (event.itemData.text === 'Edit') {
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      })
      this.titleEdit = title.caption + " : " + item.production;
      item.title = this.titleEdit;
      item.month = monthEdit;
      item.year = yearEdit;
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.dataFieldEdit = dataField;
      if (this.dataEdit?.production === 'SCG Demand') {
        this.popupVisible = true;
      }
      else {
        this.popupEditSpacialVisible = true;
      }

    }
  }

  popupSaveClick = () => {
    // console.log("this.dataEdit", this.dataEdit);
    this.dataEdit[this.dataFieldEdit] = (this.dataEdit['listRevision' + this.dataFieldEdit][0] ? this.dataEdit['listRevision' + this.dataFieldEdit][0]['value'] : 0);
    // console.log("SCG ::: ", this.dataListSCG);
    this.setSCGDiff();
    this.popupVisible = false;
  }

  popupCancelClick = () => {
    this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    this.popupVisible = false;
  }

  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 1 && !e.data.isViewOnly) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.columnIndex === 0 && !e.data.isViewOnly) {
      e.cellElement.classList.add('colorEdit');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + (e.column.dataField)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  addClick() {
    // console.log('this.dataEdit >> ', this.dataEdit);
    this.dataInfoPopup = {};
    this.dataInfoPopup.workDay = this.daysInMonth(this.dataEdit?.month, this.dataEdit?.year);
    this.popupVisibleEdit = true;
  }

  popupEditSaveClick = () => {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        if (this.dataInfoPopup?.isEdit) {
          let findForUpdate = _.find(this.dataEdit['listRevision' + this.dataFieldEdit], { id: this.dataInfoPopup.id });
          if (this.dataInfoPopup.isManual) {
            let findDataFromBase = _.find(_.cloneDeep(this.dataListRevision), { id: this.dataInfoPopup.id });
            this.dataInfoPopup.valueManual = findDataFromBase?.value;
          }
          findForUpdate = this.dataInfoPopup;
        }
        else {
          this.dataInfoPopup.id = uuid();
          this.dataInfoPopup.rowOrder = (this.dataEdit['listRevision' + this.dataFieldEdit].length + 1);
          this.dataEdit['listRevision' + this.dataFieldEdit].push(this.dataInfoPopup);
          this.dataEdit['listRevision' + this.dataFieldEdit] = _.orderBy(this.dataEdit['listRevision' + this.dataFieldEdit], ['rowOrder'], ['desc']);
        }

        this.popupVisibleEdit = false;

      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  popupEditCancelClick = () => {
    this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    this.dataInfoPopup = {};

    setTimeout(() => {
      this.popupVisibleEdit = false;
    }, 100);
  }

  editClick(event: any, item: any) {
    item.isEdit = true;
    this.dataInfoPopup = {};
    this.dataInfoPopup = item;
    this.popupVisibleEdit = true;
  }

  deleteClick(event: any, item: any) {
    _.remove(this.dataEdit['listRevision' + this.dataFieldEdit], { id: item?.id });
  }

  onIsManualValueChange(values: any): void {
    this.dataInfoPopup.isManual = values.currentTarget.checked;
  }

  setAbility(data) {
    console.log(data)
    if (data && data.length > 0) {
      const dataTotal = _.filter(data, (item) => { return item.productionPlant === 'Total' })
      _.each(dataTotal, (item) => {
        this.dataListAbility1[0]['M' + item.monthValue + item.yearValue] = item.value;
        const date = moment(item.yearValue + '-' + item.monthValue + '-01');
        this.dataListAbility1[2]['M' + item.monthValue + item.yearValue] = item.value / 24 / date.daysInMonth() * 1000;

      })
      const dataLowCO2 = _.filter(data, (item) => { return item.productionPlant === 'Low CO2' })
      _.each(dataLowCO2, (item) => {
        this.dataListAbility1[1]['M' + item.monthValue + item.yearValue] = item.value;
        const date = moment(item.yearValue + '-' + item.monthValue + '-01');
        this.dataListAbility1[3]['M' + item.monthValue + item.yearValue] = item.value / 24 / date.daysInMonth() * 1000;

      })
    } else {
      _.each(this.listMonth, (item) => {
        _.each(this.dataListAbility1, (data) => {
          data['M' + item.Month + item.Year] = null;
        })
      })
    }
    this.setAbilityDiff();
  }

  setAbilityOld(data) {
    console.log(data)
    if (data && data.length > 0) {
      const dataTotal = _.filter(data, (item) => { return item.productionPlant === 'Total' })
      _.each(dataTotal, (item) => {
        this.dataListAbility0[0]['M' + item.monthValue + item.yearValue] = item.value;
        // const date = moment(item.yearValue + '-' + item.monthValue + '-01');
        // this.dataListAbility1[2]['M' + item.monthValue + item.yearValue] = item.value / 24 / date.daysInMonth() * 1000;

      })
      const dataLowCO2 = _.filter(data, (item) => { return item.productionPlant === 'Low CO2' })
      _.each(dataLowCO2, (item) => {
        this.dataListAbility0[1]['M' + item.monthValue + item.yearValue] = item.value;
        // const date = moment(item.yearValue + '-' + item.monthValue + '-01');
        // this.dataListAbility1[3]['M' + item.monthValue + item.yearValue] = item.value / 24 / date.daysInMonth() * 1000;

      })
    } else {
      _.each(this.listMonth, (item) => {
        //_.each(this.dataListAbility0, (data) => {
        this.dataListAbility0[0]['M' + item.Month + item.Year] = null;
        this.dataListAbility0[1]['M' + item.Month + item.Year] = null;
        //})
      })
    }
    this.setAbilityDiff();
  }

  setAbilityDiff() {
    _.each(this.listMonth, (item) => {
      // if (('M' + item.Month + item.Year in this.dataListAbility1[0]) && ('M' + item.Month + item.Year in this.dataListAbility0[0])) {
      this.dataListAbility0[2]['M' + item.Month + item.Year] = this.dataListAbility1[0]['M' + item.Month + item.Year] - this.dataListAbility0[0]['M' + item.Month + item.Year];
      this.dataListAbility0[3]['M' + item.Month + item.Year] = this.dataListAbility1[1]['M' + item.Month + item.Year] - this.dataListAbility0[1]['M' + item.Month + item.Year];
      // standard rate
      this.dataListStandardRate[2]['M' + item.Month + item.Year] = this.dataListAbility1[2]['M' + item.Month + item.Year] - 275;
      // Allocate
      this.dataListAllocate[0]['M' + item.Month + item.Year] = (this.dataListStandardRate[0]['M' + item.Month + item.Year] / (this.dataListStandardRate[0]['M' + item.Month + item.Year] + this.dataListStandardRate[1]['M' + item.Month + item.Year]) * this.dataListStandardRate[2]['M' + item.Month + item.Year]);
      this.dataListAllocate[1]['M' + item.Month + item.Year] = (this.dataListStandardRate[1]['M' + item.Month + item.Year] / (this.dataListStandardRate[0]['M' + item.Month + item.Year] + this.dataListStandardRate[1]['M' + item.Month + item.Year]) * this.dataListStandardRate[2]['M' + item.Month + item.Year]);
      // Balance
      this.dataListBalance[0]['M' + item.Month + item.Year] = (this.dataListAbility1[0]['M' + item.Month + item.Year] - this.dataListGC[3]['M' + item.Month + item.Year] - this.dataListGC[4]['M' + item.Month + item.Year] - this.dataListSCG[5]['M' + item.Month + item.Year] ? this.dataListAbility1[0]['M' + item.Month + item.Year] - this.dataListGC[3]['M' + item.Month + item.Year] - this.dataListGC[4]['M' + item.Month + item.Year] - this.dataListSCG[5]['M' + item.Month + item.Year] : 0);
      this.dataListBalance[1]['M' + item.Month + item.Year] = (this.dataListAbility1[1]['M' + item.Month + item.Year] - this.dataListSCG[5]['M' + item.Month + item.Year] - this.dataListGC[3]['M' + item.Month + item.Year] ? this.dataListAbility1[1]['M' + item.Month + item.Year] - this.dataListSCG[5]['M' + item.Month + item.Year] - this.dataListGC[3]['M' + item.Month + item.Year] : 0);
      // }
    })

    // console.log("this.dataListBalance >> ", this.dataListBalance);
  }

  setSCGDiff() {
    _.each(this.listMonth, (item) => {
      this.dataListSCG[1]['M' + item.Month + item.Year] = this.dataListSCG[0]['M' + item.Month + item.Year] / 1000;
      this.dataListSCG[2]['M' + item.Month + item.Year] = this.dataListSCG[1]['M' + item.Month + item.Year] / 24 / (this.dataListSCG[0]['listRevisionM' + item.Month + item.Year][0] ? this.dataListSCG[0]['listRevisionM' + item.Month + item.Year][0]['workDay'] : 0) * 1000;
      this.dataListSCG[3]['M' + item.Month + item.Year] = this.dataListSCG[2]['M' + item.Month + item.Year] * 24
    })
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  onEditSpacialSubmit() {
    // console.log('this.dataEdit >> ', this.dataEdit);
    if (this.validationGroupPopup && this.validationGroupPopup.instance) {
      this.validateResult = this.validationGroupPopup.instance.validate();
      if (this.validateResult.isValid) {
        this.popupEditSpacialVisible = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  onEditSpacialCancel() {
    this.popupEditSpacialVisible = false;
  }

  renderDataFromMergeAllo(mergeAlloC2Data: any) {

    console.log("mergeAlloC2Data >> ", mergeAlloC2Data);

    //#region  C2 GC
    if (mergeAlloC2Data['merge_allocation']['C2 GC']) {
      const C2GC = mergeAlloC2Data['merge_allocation']['C2 GC'];
      _.each(_.cloneDeep(C2GC['Allo C2 High CO2 to GC']), (item, index) => {
        let findData = _.find(this.dataListGC, t => {
          return t.production === "Allo C2 High CO2 to GC" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

      _.each(_.cloneDeep(C2GC['Allo C2 Low CO2 to GC']), (item, index) => {
        let findData = _.find(this.dataListGC, t => {
          return t.production === "Allo C2 Low CO2 to GC" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

      _.each(_.cloneDeep(C2GC['Total Allo to GC']), (item, index) => {
        let findData = _.find(this.dataListGC, t => {
          return t.production === "Total Allo to GC" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

      _.each(_.cloneDeep(C2GC['Balance C2 Low CO2']), (item, index) => {
        let findData = _.find(this.dataListBalance, t => {
          return t.production === "C2 Low CO2" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

      _.each(_.cloneDeep(C2GC['Balance Total C2']), (item, index) => {
        let findData = _.find(this.dataListBalance, t => {
          return t.production === "Total C2" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

    }

    //#endregion

    //#region C2 SCG
    if (mergeAlloC2Data['merge_allocation']['C2 SCG']) {
      console.log("mergeAlloC2Data['merge_allocation']['C2 SCG'] >> ", mergeAlloC2Data['merge_allocation']['C2 SCG']);
      const C2GC = mergeAlloC2Data['merge_allocation']['C2 SCG'];
      _.each(_.cloneDeep(C2GC['Allo C2 Low CO2 to SCG']), (item, index) => {
        let findData = _.find(this.dataListSCG, t => {
          return t.production === "Allo C2 Low CO2 to SCG" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            findData['M' + it.Month + it.Year] = item['value'][inx];
          });
        }
      });

      _.each(_.cloneDeep(C2GC['SCG Demand']), (item, index) => {
        let findData = _.find(this.dataListSCG, t => {
          return t.production === "SCG Demand" && _.toLower(t.unit.replace(".", "")) === _.toLower(item?.unit.replace(".", ""))
        });
        if (findData) {
          // if (findData.unit === 'TON') {
          // const filterRevision = _.filter(_.cloneDeep(this.dataListRevision), { optimizationC2Id: i.id });
          // _.each(_.cloneDeep(this.listMonth), (it, inx) => {
          //   findData['M' + it.Month + it.Year] = item['value'][inx];
          // });
          // findData.['listRevision' + 'M' + item.Month + item.Year]
          //ให้อ๊อตทำเอาค่ามาใส่ใน Revision ด้วย
          // }
          _.each(_.cloneDeep(this.listMonth), (it, inx) => {
            if (findData.unit === 'TON') {
              let filterRevision = findData['listRevisionM' + it.Month + it.Year];
              if (filterRevision?.length == 0) {
                findData['M' + it.Month + it.Year] = item['value'][inx];
                findData['listRevisionM' + it.Month + it.Year] = [{
                  unit: 'TON/Month',
                  value: item['value'][inx],
                  remark: 'optimization',
                  workDay: this.daysInMonth(it.Month, it.Year),
                  isManul: false,
                  valueManual: null,
                  year: _.toNumber(this.year),
                  month: _.toNumber(this.month),
                  version: this.version,
                  rowOrder: 1,
                  activeStatus: 1,
                  isWithOutDemandAI: this.isWithOutDemandAI
                }];
              }
              else {
                if (filterRevision?.isManual === false) {
                  findData['M' + it.Month + it.Year] = item['value'][inx];
                }
              }
            }
            else {
              findData['M' + it.Month + it.Year] = item['value'][inx];
            }
          });
        }
      });
    }
    //#endregion
  }

  // _.each(filterData, i => {
  //   item['M' + i.monthValue + i.yearValue] = i.value;
  //   const filterRevision = _.filter(_.cloneDeep(this.dataListRevision), { optimizationC2Id: i.id });
  //   if (filterRevision) {
  //     item['listRevisionM' + i.monthValue + i.yearValue] = filterRevision;
  //     // find manual
  //     const findManual = _.orderBy(_.cloneDeep(filterRevision), ['rowOrder'], ['DESC']);
  //     if (findManual && findManual[0]?.isManual) {
  //       item['M' + i.monthValue + i.yearValue] = findManual[0]?.valueManual || 0;
  //       item['isPasteM' + i.monthValue + i.yearValue] = true;
  //     }
  //   }
  // });



  refreshAllGrids() {
    this.dataGrids.forEach(function (dataGrid) {
      dataGrid.instance.refresh();
    })
  }

}
