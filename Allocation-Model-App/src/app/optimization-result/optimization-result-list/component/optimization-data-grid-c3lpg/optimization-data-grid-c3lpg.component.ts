import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { MasterContractService } from 'src/app/service/master-contract.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-optimization-data-grid-c3lpg',
  templateUrl: './optimization-data-grid-c3lpg.component.html',
  styleUrls: ['./optimization-data-grid-c3lpg.component.css']
})
export class OptimizationDataGridC3lpgComponent implements OnInit {

  dataList: any = [];
  dataListRevision: any = [];
  dataListVersion0: any = [];

  dataListBalanceC3LPG: any = [];
  dataListBalanceC3: any = [];
  dataListBalanceLPG: any = [];
  dataListBalanceLPGPetro: any = [];
  dataListBalanceLPGDom: any = [];
  dataListSupply0: any = [];
  dataListSupply1: any = [];
  dataListSupply2: any = [];
  dataListNewBalance: any = [];
  dataListC3Import: any = [];
  dataListDemand: any = [];
  dataListSum: any = [];
  dataListCheck: any = [];

  dataListBalanceVersion0: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  @Input() numberBoxDigi = 0;
  numberBoxFormat = '#,##0';
  // numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dynamicColumnsSupply: any[] = [];
  dynamicColumnsDemand: any[] = [];
  dynamicColumnsNewBalance: any[] = [];

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

  listNewBalance: any = [];
  listC3Import: any = [];

  listPetro: any = [];
  listPetroC2Subsititue: any = [];
  listDomestic: any = [];
  listDemand1: any = [];
  listDemand2: any = [];
  revisionMonth = {};

  isFirstLoadBalance: boolean = true;
  isFirstLoadSupply: boolean = true;
  isFirstLoadDemand: boolean = true;
  @Input() dataInfo: any = {};
  @Input() maxVersion: any = 0;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('targetGroupPopup', { static: true }) validationGroupPopup: DxValidationGroupComponent;
  @ViewChild('dataGrid1', { static: false }) dataGrid1: DxDataGridComponent;
  @ViewChild('dataGrid2', { static: false }) dataGrid2: DxDataGridComponent;
  @ViewChild('dataGrid3', { static: false }) dataGrid3: DxDataGridComponent;
  @ViewChild('dataGrid4', { static: false }) dataGrid4: DxDataGridComponent;
  @ViewChild('dataGrid5', { static: false }) dataGrid5: DxDataGridComponent;
  @ViewChild('dataGrid6', { static: false }) dataGrid6: DxDataGridComponent;
  @ViewChild('dataGrid7', { static: false }) dataGrid7: DxDataGridComponent;
  @ViewChild('dataGrid8', { static: false }) dataGrid8: DxDataGridComponent;
  @ViewChild('dataGrid9', { static: false }) dataGrid9: DxDataGridComponent;
  @ViewChild('dataGrid10', { static: false }) dataGrid10: DxDataGridComponent;
  @ViewChild('dataGrid11', { static: false }) dataGrid11: DxDataGridComponent;
  @ViewChild('dataGrid12', { static: false }) dataGrid12: DxDataGridComponent;
  @ViewChild('dataGrid13', { static: false }) dataGrid13: DxDataGridComponent;
  @ViewChild('tabSet', { static: false }) tabSet: TabsetComponent;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

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
    private masterContractService: MasterContractService,
    private optimizationsService: OptimizationsService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  async onYearChange(year: any, month: any, version: any, maxVersion, isWithOutDemandAI: boolean, listMonth: any, dynamicColumns: any, revisionMonth: any, dataList: any, dataListRevision: any, masterUnit, masterContract: any, dynamicColumnsSupply: any, dynamicColumnsDemand: any, dynamicColumnsNewBalance: any) {
    // this.loaderService.show();
    this.isFirstLoadBalance = true;
    this.isFirstLoadDemand = true;
    this.isFirstLoadSupply = true;
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.isWithOutDemandAI = isWithOutDemandAI;

    this.revisionMonth = revisionMonth;
    this.dataMaster.masterUnit = masterUnit;
    this.dataList = dataList;
    this.dataListRevision = dataListRevision;
    this.dataMaster.masterContract = masterContract;
    this.dynamicColumns = dynamicColumns;
    this.dynamicColumnsSupply = dynamicColumnsSupply;
    this.dynamicColumnsDemand = dynamicColumnsDemand;
    this.dynamicColumnsNewBalance = dynamicColumnsNewBalance;
    this.listMonth = listMonth;

    this.dataListBalanceC3LPG = [];
    this.dataListBalanceC3 = [];
    this.dataListBalanceLPG = [];
    this.dataListBalanceLPGPetro = [];
    this.dataListBalanceLPGDom = [];
    this.dataListSupply0 = [];
    this.dataListSupply1 = [];
    this.dataListSupply2 = [];
    this.dataListNewBalance = [];
    this.dataListC3Import = [];
    this.dataListDemand = [];
    this.dataListSum = [];
    this.dataListCheck = [];

    // let dateStart = moment(this.year + '-' + month + '-01');
    // dateStart = moment(dateStart).add(1, 'M');
    // let monthStart = dateStart.month();
    // let yearStart = dateStart.year();
    // for (let index = 1; index < 13; index++) {
    //   const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName), visible: true, totalDay: this.daysInMonth((monthStart + 1), yearStart) }
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

    // const column2 = {
    //   dataField: 'source',
    //   code: 'source',
    //   caption: 'Source',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '100',
    //   alignment: 'center'
    // };

    // const supplySource = {
    //   dataField: 'source',
    //   code: 'source',
    //   caption: 'Source',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '250',
    //   alignment: 'left'
    // }

    // const columnsDemand0 = {
    //   dataField: 'customerType',
    //   code: 'customerType',
    //   caption: 'Customer Type',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '150',
    // };

    // const columnsDemand1 = {
    //   dataField: 'source',
    //   code: 'source',
    //   caption: 'Source',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '200',
    // };

    // const columnsDemand2 = {
    //   dataField: 'demand',
    //   code: 'demand',
    //   caption: 'Demand',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '200',
    // };

    // const columnsDemand3 = {
    //   dataField: 'deliveryPoint',
    //   code: 'deliveryPoint',
    //   caption: 'Delivery Point',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '200',
    // };

    // const columnsNewBalance0 = {
    //   dataField: 'source',
    //   code: 'source',
    //   caption: 'Source',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '200',
    // };

    // const columnsNewBalance1 = {
    //   dataField: 'demand',
    //   code: 'demand',
    //   caption: 'Demand',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '200',
    // };

    // const columnsNewBalance2 = {
    //   dataField: 'deliveryPoint',
    //   code: 'deliveryPoint',
    //   caption: 'Delivery Point',
    //   fixed: true,
    //   fixedPosition: 'left',
    //   width: '250',
    // };

    // this.dynamicColumns = [];
    // this.dynamicColumnsSupply = [];
    // this.dynamicColumnsDemand = [];
    // this.dynamicColumnsNewBalance = [];

    // this.dynamicColumns.push(column0);
    // this.dynamicColumns.push(column1);
    // this.dynamicColumns.push(column2);

    // this.dynamicColumnsSupply.push(supplySource);

    // this.dynamicColumnsDemand.push(columnsDemand0);
    // this.dynamicColumnsDemand.push(columnsDemand1);
    // this.dynamicColumnsDemand.push(columnsDemand2);
    // this.dynamicColumnsDemand.push(columnsDemand3);

    // this.dynamicColumnsNewBalance.push(columnsNewBalance0);
    // this.dynamicColumnsNewBalance.push(columnsNewBalance1);
    // this.dynamicColumnsNewBalance.push(columnsNewBalance2);

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
    //   });

    //   this.dynamicColumnsSupply.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     name: 'M' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     dataType: 'number',
    //     cellTemplate: this.cellTemplate,
    //     month: item.Month,
    //     year: item.Year
    //   });

    //   this.dynamicColumnsDemand.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     name: 'M' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     dataType: 'number',
    //     cellTemplate: this.cellTemplate,
    //     month: item.Month,
    //     year: item.Year
    //   });

    //   this.dynamicColumnsNewBalance.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     name: 'M' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     dataType: 'number',
    //     cellTemplate: this.cellTemplate,
    //     month: item.Month,
    //     year: item.Year
    //   });

    //   this.revisionMonth['listRevision' + 'M' + item.Month + item.Year] = [];
    // })

    //ใส่ production และ Unit กรณีไม่มีการบันทึกข้อมู,ใน database

    //#region dataListBalanceC3LPG

    this.dataListBalanceC3LPG.push({
      rowOrder: 1,
      source: 'GSP RY',
      production: 'C3/LPG Tank capacity (47,475.6 TON)',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceC3LPG'
    });

    this.dataListBalanceC3LPG.push({
      rowOrder: 2,
      source: 'GSP RY',
      production: 'C3/LPG End Inventory',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceC3LPG'
    });

    this.dataListBalanceC3LPG.push({
      rowOrder: 3,
      source: 'GSP RY',
      production: '% C3/LPG Inventory',
      unit: '%',
      isViewOnly: true,
      headerName: 'dataListBalanceC3LPG'
    });

    this.dataListBalanceC3LPG.push({
      rowOrder: 4,
      source: 'GSP RY',
      production: 'Import จ่ายแทน GSP',
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListBalanceC3LPG'
    });

    this.dataListBalanceC3LPG.push({
      rowOrder: 5,
      source: 'GSP RY',
      production: 'รอจำหน่าย',
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListBalanceC3LPG'
    });

    this.dataListBalanceC3LPG.push({
      rowOrder: 6,
      source: 'GSP RY',
      production: 'ดึง Unknow untax',
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListBalanceC3LPG'
    });

    //#endregion

    //#region dataListBalanceC3

    this.dataListBalanceC3.push({
      rowOrder: 1,
      source: 'GSP RY',
      production: 'C3 Tank capacity (10,820.4 TON)',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceC3'
    });

    this.dataListBalanceC3.push({
      rowOrder: 2,
      source: 'GSP RY',
      production: 'C3 End Inventory',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceC3'
    });

    this.dataListBalanceC3.push({
      rowOrder: 3,
      source: 'GSP RY',
      production: 'Cross to LPG (normal cross C3 to aerosol 1,000 Ton/เดือน)',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceC3'
    });

    this.dataListBalanceC3.push({
      rowOrder: 4,
      source: 'GSP RY',
      production: '% Inventory',
      unit: '%',
      isViewOnly: true,
      headerName: 'dataListBalanceC3'
    });

    //#endregion

    //#region dataListBalanceLPG

    this.dataListBalanceLPG.push({
      rowOrder: 1,
      source: 'GSP RY',
      production: 'LPG Tank capacity (36,655.2 TON)',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceLPG'
    });

    this.dataListBalanceLPG.push({
      rowOrder: 2,
      source: 'GSP RY',
      production: 'LPG End Inventory',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceLPG'
    });

    this.dataListBalanceLPG.push({
      rowOrder: 3,
      source: 'GSP RY',
      production: '% Inventory (<30% จจ. พิจารณาดึง import แทน C3 Cross to LPG)',
      unit: '%',
      isViewOnly: true,
      headerName: 'dataListBalanceLPG'
    });

    //#endregion

    //#region dataListBalanceLPGPetro

    this.dataListBalanceLPGPetro.push({
      rowOrder: 1,
      source: 'GSP RY',
      production: 'LPG Petro Tank capacity (11,502 TON)',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceLPGPetro'
    });

    this.dataListBalanceLPGPetro.push({
      rowOrder: 2,
      source: 'GSP RY',
      production: 'LPG Petro End Inventory',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceLPGPetro'
    });

    this.dataListBalanceLPGPetro.push({
      rowOrder: 3,
      source: 'GSP RY',
      production: 'LPG Petro Cross to LPG Dom',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceLPGPetro'
    });

    this.dataListBalanceLPGPetro.push({
      rowOrder: 4,
      source: 'GSP RY',
      production: '% LPG Petro Inventory (>30%)',
      unit: '%',
      isViewOnly: true,
      headerName: 'dataListBalanceLPGPetro'
    });

    //#endregion

    //#region dataListBalanceLPGDom

    this.dataListBalanceLPGDom.push({
      rowOrder: 1,
      source: 'GSP RY',
      production: 'LPG Dom Tank capacity (25,153.2 TON)',
      unit: 'TON',
      isViewOnly: true,
      headerName: 'dataListBalanceLPGDom'
    });

    this.dataListBalanceLPGDom.push({
      rowOrder: 2,
      source: 'GSP RY',
      production: 'LPG Dom End Inventory',
      unit: 'TON',
      isViewOnly: false,
      headerName: 'dataListBalanceLPGDom'
    });

    this.dataListBalanceLPGDom.push({
      rowOrder: 3,
      source: 'GSP RY',
      production: '% LPG Dom Inventory (>30%)',
      unit: '%',
      isViewOnly: true,
      headerName: 'dataListBalanceLPGDom'
    });

    //#endregion

    //#region dataListSupply0

    this.dataListSupply0.push({
      rowOrder: 1,
      source: 'C3 GSP RY',
      production: 'C3 GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 2,
      source: 'LPG GSP RY',
      production: 'LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 3,
      source: 'LPG GSP RY - Petro',
      production: 'LPG GSP RY - Petro',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 4,
      source: 'LPG GSP RY - Dom',
      production: 'LPG GSP RY - Dom',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 5,
      source: 'C3/LPG GSP RY',
      production: 'C3/LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 6,
      source: 'IRPC',
      production: 'IRPC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 7,
      source: 'GC',
      production: 'GC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 8,
      source: 'SPRC',
      production: 'SPRC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 9,
      source: 'PTTEP/LKB',
      production: 'PTTEP/LKB',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 10,
      source: 'GSP KHM',
      production: 'GSP KHM',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    this.dataListSupply0.push({
      rowOrder: 11,
      source: 'Total Supply',
      production: 'Total Supply',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply0'
    });

    //#endregion

    //#region dataListSupply1

    this.dataListSupply1.push({
      rowOrder: 1,
      source: 'C3 GSP RY',
      production: 'C3 GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 2,
      source: 'LPG GSP RY',
      production: 'LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 3,
      source: 'LPG GSP RY - Petro',
      production: 'LPG GSP RY - Petro',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 4,
      source: 'LPG GSP RY - Dom',
      production: 'LPG GSP RY - Dom',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 5,
      source: 'C3/LPG GSP RY',
      production: 'C3/LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 6,
      source: 'IRPC',
      production: 'IRPC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 7,
      source: 'GC',
      production: 'GC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 8,
      source: 'SPRC',
      production: 'SPRC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 9,
      source: 'PTTEP/LKB',
      production: 'PTTEP/LKB',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 10,
      source: 'GSP KHM',
      production: 'GSP KHM',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    this.dataListSupply1.push({
      rowOrder: 11,
      source: 'Total Supply',
      production: 'Total Supply',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply1'
    });

    //#endregion

    //#region dataListSupply2

    this.dataListSupply2.push({
      rowOrder: 1,
      source: 'C3 GSP RY',
      production: 'C3 GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 2,
      source: 'LPG GSP RY',
      production: 'LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 3,
      source: 'LPG GSP RY - Petro',
      production: 'LPG GSP RY - Petro',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 4,
      source: 'LPG GSP RY - Dom',
      production: 'LPG GSP RY - Dom',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 5,
      source: 'C3/LPG GSP RY',
      production: 'C3/LPG GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 6,
      source: 'IRPC',
      production: 'IRPC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 7,
      source: 'GC',
      production: 'GC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 8,
      source: 'SPRC',
      production: 'SPRC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 9,
      source: 'PTTEP/LKB',
      production: 'PTTEP/LKB',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 10,
      source: 'GSP KHM',
      production: 'GSP KHM',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    this.dataListSupply2.push({
      rowOrder: 11,
      source: 'Total Supply',
      production: 'Total Supply',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSupply2'
    });

    //#endregion

    //#region dataListDemand

    // this.dataListDemand.push({
    //   rowOrder: 1,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'GC (C3)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 2,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'GC (LPG)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 3,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'SCG (C3)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 4,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'MOC (Sub C3)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 5,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'ROC (LPG Dom spec)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 6,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'ROC (LPG)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 7,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'MOC (LPG)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 8,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'SCG (LPG)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 9,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'HMC (C3)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 10,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'PTTAC (C3)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 11,
    //   customerType: 'Petro',
    //   source: 'GSP RY',
    //   demand: 'PTTAC (C3 Spot)',
    //   deliveryPoint: 'GSP RY',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 12,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR (C3)',
    //   deliveryPoint: 'GSP RY (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 13,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR (LPG ไม่มีกลิ่น)',
    //   deliveryPoint: 'GSP RY (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 14,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'MT ก่อนหัก import',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 15,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'BRP',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 16,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 17,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'PTT TANK (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 18,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'SGP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 19,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'UGP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 20,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'BCP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 21,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'BCP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 22,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Big gas',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 23,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Big gas',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 24,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PAP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 25,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PAP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 26,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'PAP',
    //   deliveryPoint: 'PTT TANK (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 27,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'WP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 28,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'WP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 30,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Chevron',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 31,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'IRPC',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 32,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'IRPC',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 33,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Atlas',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 34,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Atlas',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 34,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'ESSO',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 35,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'ESSO',
    //   deliveryPoint: 'BRP',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 36,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'ESSO',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 37,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'UNO',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 38,
    //   customerType: 'M.7',
    //   source: 'GSP RY',
    //   demand: 'Orchid',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 39,
    //   customerType: 'M.7',
    //   source: 'IRPC',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'IRPC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 40,
    //   customerType: 'M.7',
    //   source: 'IRPC',
    //   demand: 'WP',
    //   deliveryPoint: 'IRPC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 41,
    //   customerType: 'M.7',
    //   source: 'IRPC',
    //   demand: 'Atlas',
    //   deliveryPoint: 'IRPC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 42,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 43,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 44,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'PTT TANK (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 45,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'BCP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 46,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'BCP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 47,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PAP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 48,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PAP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 49,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'PAP',
    //   deliveryPoint: 'PTT TANK (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 50,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'WP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 51,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'WP',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 52,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'IRPC',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 53,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'IRPC',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 54,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'Atlas',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 55,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'Atlas',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 56,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'ESSO',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 57,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'ESSO',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 58,
    //   customerType: 'M.7',
    //   source: 'GC',
    //   demand: 'Orchid',
    //   deliveryPoint: 'PTT TANK',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 59,
    //   customerType: 'M.7',
    //   source: 'SPRC',
    //   demand: 'SGP',
    //   deliveryPoint: 'MT',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 60,
    //   customerType: 'M.7',
    //   source: 'SPRC',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'SPRC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 61,
    //   customerType: 'M.7',
    //   source: 'SPRC',
    //   demand: 'PAP',
    //   deliveryPoint: 'SPRC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 62,
    //   customerType: 'M.7',
    //   source: 'SPRC',
    //   demand: 'WP',
    //   deliveryPoint: 'SPRC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 63,
    //   customerType: 'M.7',
    //   source: 'SPRC',
    //   demand: 'Atlas',
    //   deliveryPoint: 'SPRC',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 64,
    //   customerType: 'M.7',
    //   source: 'PTTEP (LKB)',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'PTTEP/LKB (Truck)',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    // this.dataListDemand.push({
    //   rowOrder: 65,
    //   customerType: 'M.7',
    //   source: 'GSP KHM',
    //   demand: 'PTTOR',
    //   deliveryPoint: 'GSP KHM',
    //   unit: '',
    //   isViewOnly: true,
    //   headerName: 'dataListDemand'
    // });

    //#endregion

    //#region dataListSum

    this.dataListSum.push({
      rowOrder: 1,
      customerType: 'Demand Petro',
      source: 'GSP RY',
      demand: 'Petro',
      deliveryPoint: 'GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 2,
      customerType: 'Petro M.7',
      source: 'GSP RY',
      demand: 'GC+ROC',
      deliveryPoint: 'GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 3,
      customerType: 'Petro Non M.7',
      source: 'GSP RY',
      demand: 'HMC+PTTAC',
      deliveryPoint: 'GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 4,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'M.7 C3+LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 5,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'M.7 LPG Total Demand',
      deliveryPoint: 'PTT TANK',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 6,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'M.7 LPG Total Demand',
      deliveryPoint: 'MT+BRP',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 7,
      customerType: 'Demand M.7',
      source: 'GSP RY',
      demand: 'M.7 C3+LPG Total Demand',
      deliveryPoint: 'หน้า GSP RY',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 8,
      customerType: 'Demand M.7',
      source: 'SPRC+EP+KHM',
      demand: 'M.7',
      deliveryPoint: 'All Refinery',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 9,
      customerType: 'Demand M.7',
      source: 'GSP RY',
      demand: 'M.7 LPG Total Demand ',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 10,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'PTTOR C3+LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 11,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'PTTOR C3+LPG หัก C3 Truck/Ordourant',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 12,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'SGP+UGP LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 13,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'PAP LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 14,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'WP LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 15,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'Chevron LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 16,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'BCP LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 17,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'Big Gas LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 18,
      customerType: 'Demand M.7',
      source: 'All Source',
      demand: 'Atlas LPG Total Demand',
      deliveryPoint: 'All Delivery Point',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    this.dataListSum.push({
      rowOrder: 19,
      customerType: 'Demand Petro + M.7',
      source: 'All',
      demand: 'Total Demand Petro + M.7',
      deliveryPoint: 'All',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListSum'
    });

    //#endregion

    //#region dataListCheck

    this.dataListCheck.push({
      rowOrder: 1,
      source: 'GC',
      production: 'GC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListCheck'
    });

    this.dataListCheck.push({
      rowOrder: 2,
      source: 'SPRC',
      production: 'SPRC',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListCheck'
    });

    this.dataListCheck.push({
      rowOrder: 3,
      source: 'PTTEP/LKB',
      production: 'PTTEP/LKB',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListCheck'
    });

    this.dataListCheck.push({
      rowOrder: 4,
      source: 'GSP KHM',
      production: 'GSP KHM',
      unit: '',
      isViewOnly: true,
      headerName: 'dataListCheck'
    });

    //#endregion

    this.dataListBalanceC3LPG[3] = _.merge(this.dataListBalanceC3LPG[3], this.revisionMonth);
    this.dataListBalanceC3LPG[4] = _.merge(this.dataListBalanceC3LPG[4], this.revisionMonth);
    this.dataListBalanceC3LPG[5] = _.merge(this.dataListBalanceC3LPG[5], this.revisionMonth);

    this.dataListBalanceC3[2] = _.merge(this.dataListBalanceC3[2], this.revisionMonth);
    this.dataListBalanceLPGPetro[2] = _.merge(this.dataListBalanceLPGPetro[2], this.revisionMonth);

    console.log(" this.dataList dom", this.dataListBalanceLPGDom);
    console.log("this.listMonth >> ", this.listMonth);

    // this.retrieveMasterData().subscribe(res => {
    //   console.log("res C3Lpg > ", res);
    //   this.dataMaster.masterUnit = res[0];
    //   this.dataList = res[1];
    //   this.dataListRevision = res[2];
    //   this.dataMaster.masterContract = res[3]

    this.setNewBalanceAndC3ImportAndDemand();
    this.setDataList();
    //});

  }

  retrieveMasterData(): Observable<any> {
    const masterUnit = this.unitService.getList();
    const optimizationData = this.optimizationsService.getListC3Lpg(this.year, this.month, this.version, this.isWithOutDemandAI);
    const optimizationRevisionData = this.optimizationsService.getRevisionListC3Lpg(this.year, this.month, this.version, this.isWithOutDemandAI);
    const masterContract = this.masterContractService.getGen(this.year, this.month);
    return forkJoin([masterUnit, optimizationData, optimizationRevisionData, masterContract]);
  }

  addClick() {
    // console.log('this.dataEdit >> ', this.dataEdit);
    this.dataInfoPopup.workDay = this.daysInMonth(this.dataEdit?.month, this.dataEdit?.year);
    console.log("this.dataInfoPopup.workDay >> ", this.dataInfoPopup.workDay);
    this.popupVisibleEdit = true;
  }

  editClick(event: any, item: any) {
    item.isEdit = true;
    this.dataInfoPopup = item;
    this.popupVisibleEdit = true;
  }

  deleteClick(event: any, item: any) {
    _.remove(this.dataEdit['listRevision' + this.dataFieldEdit], { id: item?.id });
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
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
  gridRefresh(calBack?) {
    if (this.tabSet.tabs[0].active === true) {
      this.gridTabBalanceRefresh(calBack);
    } else if (this.tabSet.tabs[1].active === true) {
      this.gridTabSupplyRefresh(calBack);
    } else if (this.tabSet.tabs[2].active === true) {
      this.gridTabDemandRefresh(calBack);
    }
  }
  gridTabBalanceRefresh(calBack?) {
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoadBalance) {
      this.gridTabBalanceState(calBack);
      return;
    }

    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.dataGrid1.instance.refresh();
      this.dataGrid2.instance.refresh();
      this.dataGrid3.instance.refresh();
      this.dataGrid4.instance.refresh();
      this.dataGrid5.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridTabBalanceState(calBack?) {
    if (this.dataGrid1 && this.dataGrid1.instance) {
      console.log('isFirstLoad')
      this.isFirstLoadBalance = false;
      this.dataGrid1.instance.state(null);
      this.dataGrid2.instance.state(null);
      this.dataGrid3.instance.state(null);
      this.dataGrid4.instance.state(null);
      this.dataGrid5.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }

  gridTabSupplyRefresh(calBack?) {
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoadSupply) {
      this.gridTabSupplyState(calBack);
      return;
    }

    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.dataGrid6.instance.refresh();
      this.dataGrid7.instance.refresh();
      this.dataGrid8.instance.refresh();
      this.dataGrid9.instance.refresh();
      this.dataGrid10.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridTabSupplyState(calBack?) {
    if (this.dataGrid1 && this.dataGrid1.instance) {
      console.log('isFirstLoad')
      this.isFirstLoadSupply = false;
      this.dataGrid6.instance.state(null);
      this.dataGrid7.instance.state(null);
      this.dataGrid8.instance.state(null);
      this.dataGrid9.instance.state(null);
      this.dataGrid10.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }
  gridTabDemandRefresh(calBack?) {
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoadDemand) {
      this.gridTabDemandState(calBack);
      return;
    }

    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.dataGrid11.instance.refresh();
      this.dataGrid12.instance.refresh();
      this.dataGrid13.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridTabDemandState(calBack?) {
    if (this.dataGrid1 && this.dataGrid1.instance) {
      console.log('isFirstLoad')
      this.isFirstLoadDemand = false;
      this.dataGrid11.instance.state(null);
      this.dataGrid12.instance.state(null);
      this.dataGrid13.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }
  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  itemClick(event: any, month: any, row: any, data: any, item: any, dataField: any, monthEdit?: any, yearEdit?: any) {
    if (event.itemData.text === 'Paste') {
      navigator.clipboard.readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            _.each(i2.split('\t'), (i3, index3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (dataText && _.isNumber(dataText)) {
                // const refTo = _.replace(data[row + index].referencePriceNameTo, new RegExp(' ', 'g'), '');
                // if (refTo === 'PP:CFRSEA') {
                const formula = _.find(_.cloneDeep(this.masterData.masterPrices), mProduct => { return mProduct.referencePriceNameFrom == data[row + index].referencePriceNameFrom && mProduct.referencePriceNameTo == data[row + index].referencePriceNameTo && mProduct.unit == data[row + index].unit }).formula;
                dataText = eval(dataText + formula);
                // }
                data[row + index]['isPasteM' + (month + index3)] = true;
                data[row + index]['M' + (month + index3)] = dataText;
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
      console.log("Edit >> ", item);
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      })
      this.titleEdit = title.caption + " : " + item.production;
      if (!item?.production) {
        this.titleEdit = title.caption + " : ( " + item.source + " - " + item.demand + " - " + item.deliveryPoint + " )";
      }

      item.title = this.titleEdit;
      item.month = monthEdit;
      item.year = yearEdit;
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.dataFieldEdit = dataField;
      if (this.dataEdit['listRevision' + this.dataFieldEdit]) {
        this.popupVisible = true;
      }
      else {
        this.popupEditSpacialVisible = true;
      }
    }
  }

  getDataSave(isSaveAs: boolean, isWithOutDemandAI?: boolean, versionSave?: number) {

    let dataSave: any = {};
    dataSave.optimizationC3Lpg = [];
    dataSave.optimizationC3LpgRevision = [];

    let allDataList = [
      ...this.dataListBalanceC3LPG,
      ...this.dataListBalanceC3,
      ...this.dataListBalanceLPG,
      ...this.dataListBalanceLPGPetro,
      ...this.dataListBalanceLPGDom,
      ...this.dataListSupply0,
      ...this.dataListSupply1,
      ...this.dataListSupply2,
      ...this.dataListNewBalance,
      ...this.dataListC3Import,
      ...this.dataListDemand,
      ...this.dataListSum,
      ...this.dataListCheck,
    ];

    console.log("allDataList >>", allDataList);

    _.each(allDataList, (i) => {
      _.each(this.listMonth, (x) => {

        let _id = uuid();

        dataSave.optimizationC3Lpg.push({
          id: _id,
          productionGroup: i?.headerName,
          production: i?.production,
          customerType: i?.customerType || null,
          unit: i?.unit,
          source: i?.source || null,
          demand: i?.demand || null,
          deliveryPoint: i?.deliveryPoint || null,
          isViewOnly: i?.isViewOnly,
          year: _.toNumber(this.year),
          month: _.toNumber(this.month),
          version: versionSave,
          yearValue: x.Year,
          monthValue: x.Month,
          value: i["M" + x.Month + x.Year] || 0,
          remark: i["RemarkM" + x.Month + x.Year] || null,
          rowOrder: i?.rowOrder,
          isWithOutDemandAI: isWithOutDemandAI
        });

        if (i['listRevisionM' + x.Month + x.Year]?.length) {
          _.each(_.cloneDeep(i['listRevisionM' + x.Month + x.Year]), (v) => {
            dataSave.optimizationC3LpgRevision.push({
              optimizationC3LpgId: _id,
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

  setDataList() {

    _.each(this.dataListBalanceC3LPG, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          const filterRevision = _.filter(_.cloneDeep(this.dataListRevision), { optimizationC3LpgId: i.id });
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

    _.each(this.dataListBalanceC3, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          const filterRevision = _.filter(_.cloneDeep(this.dataListBalanceC3), { optimizationC3LpgId: i.id });
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

    _.each(this.dataListBalanceLPG, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListBalanceLPGPetro, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          const filterRevision = _.filter(_.cloneDeep(this.dataListBalanceLPGPetro), { optimizationC3LpgId: i.id });
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

    _.each(this.dataListBalanceLPGDom, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, production: item.production, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListSupply0, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, source: item.source, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListSupply1, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, source: item.source, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListSupply2, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, source: item.source, unit: item.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListNewBalance, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), {
        productionGroup: item?.headerName
        , source: item?.source
        , demand: item?.demand
        , deliveryPoint: item?.deliveryPoint
      });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListC3Import, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), {
        productionGroup: item?.headerName
        , source: item?.source
        , demand: item?.demand
        , deliveryPoint: item?.deliveryPoint
      });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListDemand, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), {
        productionGroup: item?.headerName
        , customerType: item?.customerType
        , source: item?.source
        , demand: item?.demand
        , deliveryPoint: item?.deliveryPoint
      });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListSum, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), {
        productionGroup: item?.headerName
        , customerType: item?.customerType
        , source: item?.source
        , demand: item?.demand
        , deliveryPoint: item?.deliveryPoint
      });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListCheck, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item.headerName, source: item.source });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    // console.log('this.dataListSCG >> ', this.dataListSCG);

  }

  popupSaveClick = () => {
    this.dataEdit[this.dataFieldEdit] = (this.dataEdit['listRevision' + this.dataFieldEdit][0] ? this.dataEdit['listRevision' + this.dataFieldEdit][0]['value'] : 0);
    this.popupVisible = false;
  }

  popupCancelClick = () => {
    this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    this.popupVisible = false;
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

        setTimeout(() => {
          this.dataInfoPopup = {};
        }, 100);

        console.log("this.dataInfoPopup >> ", this.dataInfoPopup);
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

  setCalculateData() {

    //#region New Balance

    // :: New Balance :: //
    // Import : PTTOR : MT
    const ImportPttorMt = _.find(this.dataListNewBalance, { sourceCode: "LPG Import", deliveryPointCode: "MT", customerCode: "PTTOR" });
    // Import : PTTOR : BRP
    const ImportPttorBrp = _.find(this.dataListNewBalance, { sourceCode: "LPG Import", deliveryPointCode: "BRP", customerCode: "PTTOR" });
    // Import : SGP : MT
    const ImportSgpMt = _.find(this.dataListNewBalance, { sourceCode: "LPG Import", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'SGP' });
    // Import : UGP : MT
    const ImportUgpMt = _.find(this.dataListNewBalance, { sourceCode: "LPG Import", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'UGP' });

    // GSP RY : PTTOR : MT
    const GspRyPttorMt = _.find(this.dataListNewBalance, { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "PTTOR" });
    // GSP RY : PTTOR : BRP
    const GspRyPttorBrp = _.find(this.dataListNewBalance, { sourceCode: "GSPRY", deliveryPointCode: "BRP", customerCode: "PTTOR" });
    // GSP RY : SGP : MT
    const GspRySgpMt = _.find(this.dataListNewBalance, { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'SGP' });
    // GSP RY : UGP : MT
    const GspRyUgpMt = _.find(this.dataListNewBalance, { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'UGP' });

    const demand124 = _.find(_.cloneDeep(this.listDemand2), { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "PTTOR" });
    const demand125 = _.find(_.cloneDeep(this.listDemand2), { sourceCode: "GSPRY", deliveryPointCode: "BRP", customerCode: "PTTOR" });
    const demand128 = _.find(_.cloneDeep(this.listDemand2), { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'SGP' });
    const demand129 = _.find(_.cloneDeep(this.listDemand2), { sourceCode: "GSPRY", deliveryPointCode: "MT", customerCode: "SGC/UGP", customerPlantName: 'UGP' });

    //#endregion

    //#region C3Import

    // GSP RY : SCG (Sum C3) : GSP RY
    const GSPRY_SCG_GSPRY = _.find(this.dataListC3Import, { source: "GSP RY", deliveryPoint: "GSP RY", demand: "SCG (Sum C3)" });
    // GSP RY : GC (C3/LPG) : GSP RY
    const GSPRY_GC_GSPRY = _.find(this.dataListC3Import, { source: "GSP RY", deliveryPoint: "GSP RY", demand: "GC (C3/LPG)" });
    // C3 import Split : SCG : SCG
    const c3ImportSplitScgScg = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "C3ImportSplit", deliveryPointCode: "SCG", customerCode: "SCG" });

    const demand111 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "GC", productName: "C3" });
    const demand112 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "GC", productName: "LPG" });
    const demand113 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "C3ImportSplitCargo", deliveryPointCode: "SCG", customerCode: "SCG" });
    const demand114 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "SCG" });
    const demand116 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "ROC", productName: "LPG" });
    const demand117 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "MOC", productName: "LPG" });
    const demand118 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "SCG", productName: "LPG" });
    const demand119 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "HMC", productName: "C3" });
    const demand120 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "PTTAC", productName: "C3" });
    const demand121 = _.find(_.cloneDeep(this.listDemand1), { sourceCode: "GSPRY", deliveryPointCode: "GSPRY", customerCode: "PTTAC/SPOT", productName: "C3" });

    //#endregion

    _.each(this.listMonth, (item) => {
      // % C3/LPG Inventory
      this.dataListBalanceC3LPG[2]['M' + item.Month + item.Year] = this.dataListBalanceC3LPG[1]['M' + item.Month + item.Year]
        / this.dataListBalanceC3LPG[0]['M' + item.Month + item.Year];

      // % Inventory
      this.dataListBalanceC3[3]['M' + item.Month + item.Year] = this.dataListBalanceC3[1]['M' + item.Month + item.Year]
        / this.dataListBalanceC3[0]['M' + item.Month + item.Year];

      // % Inventory (<30% จจ. พิจารณาดึง import แทน C3 Cross to LPG)
      this.dataListBalanceLPG[2]['M' + item.Month + item.Year] = this.dataListBalanceLPG[1]['M' + item.Month + item.Year]
        / this.dataListBalanceLPG[0]['M' + item.Month + item.Year];

      // Total Supply 0
      this.dataListSupply0[10]['M' + item.Month + item.Year] = this.dataListSupply0[0]['M' + item.Month + item.Year]
        + this.dataListSupply0[1]['M' + item.Month + item.Year]
        + this.dataListSupply0[2]['M' + item.Month + item.Year]
        + this.dataListSupply0[3]['M' + item.Month + item.Year]
        + this.dataListSupply0[4]['M' + item.Month + item.Year]
        + this.dataListSupply0[5]['M' + item.Month + item.Year]
        + this.dataListSupply0[6]['M' + item.Month + item.Year]
        + this.dataListSupply0[7]['M' + item.Month + item.Year]
        + this.dataListSupply0[8]['M' + item.Month + item.Year]
        + this.dataListSupply0[9]['M' + item.Month + item.Year];

      // Total Supply 1
      this.dataListSupply1[10]['M' + item.Month + item.Year] = this.dataListSupply1[0]['M' + item.Month + item.Year]
        + this.dataListSupply1[1]['M' + item.Month + item.Year]
        + this.dataListSupply1[2]['M' + item.Month + item.Year]
        + this.dataListSupply1[3]['M' + item.Month + item.Year]
        + this.dataListSupply1[4]['M' + item.Month + item.Year]
        + this.dataListSupply1[5]['M' + item.Month + item.Year]
        + this.dataListSupply1[6]['M' + item.Month + item.Year]
        + this.dataListSupply1[7]['M' + item.Month + item.Year]
        + this.dataListSupply1[8]['M' + item.Month + item.Year]
        + this.dataListSupply1[9]['M' + item.Month + item.Year];

      // C3/LPG GSP RY
      this.dataListSupply2[4] = this.dataListSupply1[4]['M' + item.Month + item.Year]
        - this.dataListSupply0[4]['M' + item.Month + item.Year];
      // IRPC
      this.dataListSupply2[5] = this.dataListSupply1[5]['M' + item.Month + item.Year]
        - this.dataListSupply0[5]['M' + item.Month + item.Year];
      // GC
      this.dataListSupply2[6] = this.dataListSupply1[6]['M' + item.Month + item.Year]
        - this.dataListSupply0[6]['M' + item.Month + item.Year];
      // SPRC
      this.dataListSupply2[7] = this.dataListSupply1[7]['M' + item.Month + item.Year]
        - this.dataListSupply0[7]['M' + item.Month + item.Year];
      // PTTEP/LKB
      this.dataListSupply2[8] = this.dataListSupply1[8]['M' + item.Month + item.Year]
        - this.dataListSupply0[8]['M' + item.Month + item.Year];
      // GSP KHM
      this.dataListSupply2[9] = this.dataListSupply1[9]['M' + item.Month + item.Year]
        - this.dataListSupply0[9]['M' + item.Month + item.Year];
      // Total Supply 2
      this.dataListSupply2[10]['M' + item.Month + item.Year] = this.dataListSupply2[0]['M' + item.Month + item.Year]
        + this.dataListSupply2[1]['M' + item.Month + item.Year]
        + this.dataListSupply2[2]['M' + item.Month + item.Year]
        + this.dataListSupply2[3]['M' + item.Month + item.Year]
        + this.dataListSupply2[4]['M' + item.Month + item.Year]
        + this.dataListSupply2[5]['M' + item.Month + item.Year]
        + this.dataListSupply2[6]['M' + item.Month + item.Year]
        + this.dataListSupply2[7]['M' + item.Month + item.Year]
        + this.dataListSupply2[8]['M' + item.Month + item.Year]
        + this.dataListSupply2[9]['M' + item.Month + item.Year];

      //#region New Balance

      if (ImportPttorMt) {  // Import : PTTOR : MT
        // =IF(AK124>(AK8+AK10),(AK8+AK10),AK124)
        let calValue = 0;

        if (_.toNumber(demand124['M' + item.Month + item.Year]) > (_.toNumber(this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year]) + _.toNumber(this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year]))) {
          calValue = (this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year] + this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year]) || 0;
        }
        else {
          calValue = demand124['M' + item.Month + item.Year] || 0;
        }
        // AK79 / AK83
        ImportPttorMt['M' + item.Month + item.Year] = calValue || 0;
      }

      let X8 = _.toNumber(this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year]);
      let X10 = _.toNumber(this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year]);
      let X79X83 = ImportPttorMt['M' + item.Month + item.Year];
      let X124 = _.toNumber(demand124['M' + item.Month + item.Year]);
      let X125 = _.toNumber(demand125['M' + item.Month + item.Year]);
      let X128 = _.toNumber(demand128['M' + item.Month + item.Year]);
      let X129 = _.toNumber(demand129['M' + item.Month + item.Year]);

      let X81 = (X8 + X10 === X79X83 ? 0 : ((X8 + X10) - X124)) || 0;
      let X85 = (X81 < X128 ? X81 : X128) || 0;
      let X82 = ((X79X83 + X85) > X8 ? 0 : (X8 - (X79X83 + X85))) || 0;
      let X87 = (X124 - X8 - X10);

      if (ImportPttorBrp) { // Import : PTTOR : BRP
        // =AK82-AK129
        // AK82=IF(AK83+AK85>AK8,0,AK8-(AK83+AK85))
        //   - AK83=ImportPttorMt['M' + item.Month + item.Year]
        //   - AK85=IF(AK81<AK128,AK81,AK128)
        //      - AK81=IF((AK8+AK10)=AK79,0,(AK8+AK10)-AK124)
        //        - (AK8+AK10)=(this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year] + this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year])
        //        - AK79=ImportPttorMt['M' + item.Month + item.Year]
        //        - AK124=demand124['M' + item.Month + item.Year]
        //      - AK128=demand128['M' + item.Month + item.Year]
        // AK129=demand129['M' + item.Month + item.Year]

        let calValue = (X82 - X129) || 0;
        ImportPttorBrp['M' + item.Month + item.Year] = calValue;

      }

      if (ImportSgpMt) { // Import : SGP : MT
        // =IF(AK81<AK128,AK81,AK128)
        //    - AK81=IF((AK8+AK10)=AK79,0,(AK8+AK10)-AK124)
        //        - (AK8+AK10)=(this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year] + this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year])
        //        - AK79=ImportPttorMt['M' + item.Month + item.Year]
        //        - AK124=demand124['M' + item.Month + item.Year]
        //    - AK128=demand128['M' + item.Month + item.Year]

        let calValue = (X81 < X128 ? X81 : X128) || 0;
        ImportSgpMt['M' + item.Month + item.Year] = calValue;

      }

      if (ImportUgpMt) { // Import : UGP : MT
        // =IF(AK129<AK82,AK129,AK82)
        //  - AK129=demand129['M' + item.Month + item.Year]
        //  - AK82=IF(AK83+AK85>AK8,0,AK8-(AK83+AK85))
        //   - AK83=ImportPttorMt['M' + item.Month + item.Year]
        //   - AK85=IF(AK81<AK128,AK81,AK128)
        //      - AK81=IF((AK8+AK10)=AK79,0,(AK8+AK10)-AK124)
        //        - (AK8+AK10)=(this.dataListBalanceC3LPG[3]['M' + item.Month + item.Year] + this.dataListBalanceC3LPG[5]['M' + item.Month + item.Year])
        //        - AK79=ImportPttorMt['M' + item.Month + item.Year]
        //        - AK124=demand124['M' + item.Month + item.Year]
        //      - AK128=demand128['M' + item.Month + item.Year]

        let calValue = (X129 < X82 ? X129 : X82) || 0;
        ImportUgpMt['M' + item.Month + item.Year] = calValue;

      }

      if (GspRyPttorMt) { // GSP RY : PTTOR : MT
        // =IF(AK87<0,0,AK87)
        //  - AK87=AK124-AK8-AK10

        let calValue = (X87 < 0 ? 0 : X87) || 0;
        GspRyPttorMt['M' + item.Month + item.Year] = calValue;

      }

      if (GspRyPttorBrp) { // GSP RY : PTTOR : BRP
        // =AK125+AK88
        //   - AK125=demand125['M' + item.Month + item.Year]
        //   - AK88 = AK84 = ImportSgpMt['M' + item.Month + item.Year]

        let X84X88 = _.toNumber(ImportSgpMt['M' + item.Month + item.Year]);
        let calValue = (X125 + X84X88) || 0;
        GspRyPttorBrp['M' + item.Month + item.Year] = calValue;

      }

      if (GspRySgpMt) { // GSP RY : SGP : MT
        // =IF(AK89<0,0,AK89)
        //  - AK89=IF(AK87>0,AK128,AK128+AK87)
        //    - AK87=AK124-AK8-AK10

        let X89 = (X87 > 0 ? X128 : (X128 + X87)) || 0;
        let calValue = (X89 < 0 ? 0 : X89) || 0;
        GspRySgpMt['M' + item.Month + item.Year] = calValue;

      }

      if (GspRyUgpMt) { // GSP RY : UGP : MT
        // =IF(AK90<0,0,AK90)
        //  - AK90=IF(AK89>=0,AK129,AK129+AK89)

        let X89 = (X87 > 0 ? X128 : (X128 + X87)) || 0;
        let X90 = (X89 >= 0 ? X129 : (X129 + X89)) || 0;
        let calValue = (X90 < 0 ? 0 : X90) || 0;
        GspRyUgpMt['M' + item.Month + item.Year] = calValue;

      }

      //#endregion

      //#region C3Import

      //  -AK100=C3 รายย้อน:SCG:SCG
      //  -AK101=C3 รายย้อน:MOC:SCG
      //  -AK102=C3 รายย้อน:GC:GC

      let X98 = (c3ImportSplitScgScg ? c3ImportSplitScgScg['M' + item.Month + item.Year] : 0);
      let X100 = 0;
      let X101 = 0;
      let X102 = 0;
      let X111 = (demand111 ? demand111['M' + item.Month + item.Year] : 0);
      let X112 = (demand112 ? demand112['M' + item.Month + item.Year] : 0);
      let X113 = (demand113 ? demand113['M' + item.Month + item.Year] : 0);
      let X114 = (demand114 ? demand114['M' + item.Month + item.Year] : 0);
      let X116 = (demand116 ? demand116['M' + item.Month + item.Year] : 0);
      let X117 = (demand117 ? demand117['M' + item.Month + item.Year] : 0);
      let X118 = (demand118 ? demand118['M' + item.Month + item.Year] : 0);
      let X119 = (demand119 ? demand119['M' + item.Month + item.Year] : 0);
      let X120 = (demand120 ? demand120['M' + item.Month + item.Year] : 0);
      let X121 = (demand121 ? demand121['M' + item.Month + item.Year] : 0);

      if (GSPRY_SCG_GSPRY) {
        // =AK113+AK114+AK98
        let calValue = (X113 + X114 + X98) || 0;
        GSPRY_SCG_GSPRY['M' + item.Month + item.Year] = calValue;
      }

      if (GSPRY_GC_GSPRY) {
        // =AK111+AK112
        let calValue = (X111 + X112) || 0;
        GSPRY_GC_GSPRY['M' + item.Month + item.Year] = calValue;
      }

      //#endregion

      //#region Demand Domestic

      let X62 = this.dataListSupply1[7]['M' + item.Month + item.Year];
      let X71 = this.dataListSupply2[3]['M' + item.Month + item.Year];
      let X72 = this.dataListSupply2[4]['M' + item.Month + item.Year];
      let X73 = this.dataListSupply2[5]['M' + item.Month + item.Year];

      let SPRC_PTTOR_SPRC = _.find(_.cloneDeep(this.listDemand2), { sourceCode: "SPRC", deliveryPointCode: "SPRC", customerCode: "PTTOR" });
      if (SPRC_PTTOR_SPRC) {
        // =AK62-AK171-AK172-AK173
        let calValue = (X62 - X71 - X72 - X73) || 0;
        SPRC_PTTOR_SPRC['M' + item.Month + item.Year] = calValue;
      }

      //#endregion

      //#region Sum

      // *-*-*-*-*-* Petro
      // =AK100+AK101+AK102+AK111+AK112+AK113+AK114+AK116+AK117+AK118
      this.dataListSum[1]['M' + item.Month + item.Year] = (X100 + X101 + X102 + X111 + X112 + X113 + X114 + X116 + X117 + X118) || 0;
      // =AK119+AK120+AK121
      this.dataListSum[2]['M' + item.Month + item.Year] = (X119 + X120 + X121) || 0;
      // =AK178+AK179
      this.dataListSum[0]['M' + item.Month + item.Year] = this.dataListSum[1]['M' + item.Month + item.Year] + this.dataListSum[2]['M' + item.Month + item.Year];

      // *-*-*-*-*-* M.7

      // =SUM(AK124:AK175) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const filterForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.deliveryPointCode != 'GSPRYTRUCK';
      });

      const sumX124X175 = _.sumBy(filterForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[3]['M' + item.Month + item.Year] = sumX124X175 || 0;
      // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // Sum Demand ลูกค้า M7 Source PTT Tank +n PTT Tank Truck /////////////////////////////////////////////////////////////////////////////////////
      // =AK126+AK127+AK131+AK133+AK135+AK136+AK138+AK139+AK141+AK143+AK146+AK147+AK148+AK153+AK154+AK156+AK158+AK159+AK161+AK163+AK165+AK167+AK168
      const filterPttTankForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === 'PTTTANK' || x.sourceCode === 'PTTTANKTRUCK';
      });
      const sumPttTank = _.sumBy(filterPttTankForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[4]['M' + item.Month + item.Year] = sumPttTank || 0;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // Sum Demand ลูกค้า M7 Source MT+ BRP ////////////////////////////////////////////////////////////////////////////////////////////////////////
      // =AK124+AK125+AK128+AK129+AK130+AK132+AK134+AK137+AK140+AK142+AK144+AK145+AK152+AK155+AK157+AK160+AK162+AK164+AK166
      const filterMtBrpForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === 'MT' || x.sourceCode === 'BRP';
      });
      const sumMtBrp = _.sumBy(filterMtBrpForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[5]['M' + item.Month + item.Year] = sumMtBrp || 0;
      // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK122+AK123 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const filterX122X123Sum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.deliveryPointCode == 'GSPRYTRUCK' || x.deliveryPointCode == 'PTTEPLKBTruck' || x.deliveryPointCode == 'GSPKHM';
      });
      const sumX122X123 = _.sumBy(filterX122X123Sum, ['M' + item.Month + item.Year]);
      this.dataListSum[6]['M' + item.Month + item.Year] = sumX122X123 || 0;
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =SUM(AK170:AK175) //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const filterX170X175Sum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.deliveryPointCode == 'SPRC';
      });
      const sumX170X175 = _.sumBy(filterX170X175Sum, ['M' + item.Month + item.Year]);
      this.dataListSum[7]['M' + item.Month + item.Year] = sumX170X175 || 0;
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =SUM(AK123:AK148) /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  sum  Demand ลูกค้า M7 ทุก Delivery Point (Product LPG) * เฉพาะ Soruce GSP RY
      const filterX123X148ForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === 'GSPRY' && x.productName === "LPG";
      });
      const sumX123X148 = _.sumBy(filterX123X148ForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[8]['M' + item.Month + item.Year] = sumX123X148 || 0;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =SUM(AK124:AK127,AK152:AK154,AK170,AK174,AK175,AK122,AK123,AK149) /////////////////////////////////////////////////////////////////////////
      //  sum  Demand ลูกค้า  PTT OR เท่านั้น ทุก Source ทุก Delivery point
      const filterPttOrForSum = _.filter(_.cloneDeep(this.dataListDemand), x => {
        return x.customerCode === "PTTOR";
      });
      const sumPttOr = _.sumBy(filterPttOrForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[9]['M' + item.Month + item.Year] = sumPttOr || 0;
      // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK186-AK122-AK123 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // sum  Demand ลูกค้า  PTT OR เท่านั้น ทุก Source ทุก Delivery point ยกเว้น Deliverypoint GSPRY (Truck)
      const filterPttOrWithoutTruckForSum = _.filter(_.cloneDeep(this.dataListDemand), x => {
        return x.customerCode === "PTTOR" && x.deliveryPointCode !== 'GSPRYTRUCK';
      });
      const sumPttOrWithoutTruck = _.sumBy(filterPttOrWithoutTruckForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[10]['M' + item.Month + item.Year] = sumPttOrWithoutTruck || 0;
      // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK128+AK129 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterX128X129ForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === "GSPRY" && x.deliveryPointCode === "MT" && x.customerCode === "SGC/UGP";
      });
      const sumX128X129 = _.sumBy(filterPttOrWithoutTruckForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[11]['M' + item.Month + item.Year] = sumX128X129 || 0;
      // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK134+AK135+AK157+AK158+AK159+AK171+AK136 //////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterPAPForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "PAP";
      });
      const sumPAP = _.sumBy(filterPAPForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[12]['M' + item.Month + item.Year] = sumPAP || 0;
      // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK137+AK138+AK150+AK160+AK161+AK172 ///////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterWPForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "WP"
      });
      const sumWP = _.sumBy(filterWPForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[13]['M' + item.Month + item.Year] = sumWP || 0;
      // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK139+AK173 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterChevronForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "Chevron" || x.customerCode === "Atlas";
      });
      const sumChevron = _.sumBy(filterChevronForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[14]['M' + item.Month + item.Year] = sumChevron || 0;
      // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AM130+AM131+AM155+AM156 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterBCPForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "BCP";
      });
      const sumBCP = _.sumBy(filterBCPForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[15]['M' + item.Month + item.Year] = sumBCP || 0;
      // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AM132+AM133 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterBiggasForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "Biggas";
      });
      const sumBiggas = _.sumBy(filterBiggasForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[15]['M' + item.Month + item.Year] = sumBiggas || 0;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AM142+AM143+AM164+AM165 //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //  ส่วน Sum รายลูกค้า
      const filterAtlasForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.customerCode === "Atlas";
      });
      const sumAtlas = _.sumBy(filterAtlasForSum, ['M' + item.Month + item.Year]);
      this.dataListSum[16]['M' + item.Month + item.Year] = sumAtlas || 0;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // ==SUM(AM111:AM175) ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const sumAll = _.sumBy(this.dataListDemand, ['M' + item.Month + item.Year]);
      this.dataListSum[17]['M' + item.Month + item.Year] = sumAll || 0;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //#endregion

      //#region Check

      // =AK61-AK152-AK153-AK154-AK155-AK156-AK157-AK158-AK160-AK161-AK162-AK163-AK164-AK165-AK166-AK167-AK168 ////////////////////////////////
      let X61 = _.toNumber(this.dataListSupply1[6]['M' + item.Month + item.Year]) || 0;
      const filterCheckGCForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === "GC" && x.customerCode === "PTTOR"
          || x.sourceCode === "GC" && x.customerCode === "BCP"
          || x.sourceCode === "GC" && x.customerCode === "PAP" && x.deliveryPointCode !== "PTTTANKTRUCK"
          || x.sourceCode === "GC" && x.customerCode === "WP"
          || x.sourceCode === "GC" && x.customerCode === "IRPC"
          || x.sourceCode === "GC" && x.customerCode === "Atlas"
          || x.sourceCode === "GC" && x.customerCode === "ESSO"
          || x.sourceCode === "GC" && x.customerCode === "Orchid";
      });

      let calValue = X61;
      if (filterCheckGCForSum) {
        _.each(filterCheckGCForSum, x => {
          calValue = (calValue - _.toNumber(x['M' + item.Month + item.Year])) || 0;
        });
      }

      this.dataListCheck[0]['M' + item.Month + item.Year] = calValue;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK62-AK170-AK172-AK171-AK173 /////////////////////////////////////////////////////////////////////////////////////////////////////
      const filterCheckSPRCForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === "SPRC" && x.deliveryPointCode === "SPRC";
      });

      let calValueSPRC = _.toNumber(X62) || 0;
      if (filterCheckSPRCForSum) {
        _.each(filterCheckSPRCForSum, x => {
          calValueSPRC = (calValueSPRC - _.toNumber(x['M' + item.Month + item.Year])) || 0;
        });
      }

      this.dataListCheck[1]['M' + item.Month + item.Year] = calValueSPRC;
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK63-AK174 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let X63 = _.toNumber(this.dataListSupply1[8]['M' + item.Month + item.Year]) || 0;
      const filterX174ForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === "PTTEP(LKB)" && x.customerCode === "PTTOR" && x.deliveryPointCode === "PTTEPLKBTruck";
      });

      let calValuePTTEP = (_.toNumber(X63) - _.toNumber(filterX174ForSum['M' + item.Month + item.Year])) || 0;
      this.dataListCheck[2]['M' + item.Month + item.Year] = calValuePTTEP;
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // =AK64-AK175 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let X64 = _.toNumber(this.dataListSupply1[9]['M' + item.Month + item.Year]) || 0;
      const filterX175ForSum = _.filter(_.cloneDeep(this.listDemand2), x => {
        return x.sourceCode === "GSPKHM" && x.customerCode === "PTTOR" && x.deliveryPointCode === "GSPKHM";
      });

      let calValueGSPKHM = (_.toNumber(X64) - _.toNumber(filterX175ForSum['M' + item.Month + item.Year])) || 0;
      this.dataListCheck[3]['M' + item.Month + item.Year] = calValueGSPKHM;
      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //#endregion

      // // M.7 : SPRC : PTTOR : SPRC
      // this.dataListDemand[59]['M' + item.Month + item.Year] = this.dataListSupply1[7]['M' + item.Month + item.Year];
      // // M.7 : PTTEP (LKB) : PTTOR : PTTEP/LKB (Truck)
      // this.dataListDemand[63]['M' + item.Month + item.Year] = this.dataListSupply1[8]['M' + item.Month + item.Year];
      // // M.7 : GSP KHM : PTTOR : GSP KHM
      // this.dataListDemand[64]['M' + item.Month + item.Year] = this.dataListSupply1[9]['M' + item.Month + item.Year];

      // // Demand Petro	: GSP RY : Petro : GSP RY
      // this.dataListSum[0]['M' + item.Month + item.Year] = this.dataListSum[1]['M' + item.Month + item.Year]
      //   + this.dataListSum[2]['M' + item.Month + item.Year];
      // // Petro Non M.7 : GSP RY : HMC+PTTAC : GSP RY
      // this.dataListSum[2]['M' + item.Month + item.Year] = this.dataListDemand[8]['M' + item.Month + item.Year]
      //   + this.dataListDemand[9]['M' + item.Month + item.Year];

      // // Sum Demand 11-64
      // for (let index = 11; index <= 53; index++) {
      //   this.dataListSum[3]['M' + item.Month + item.Year] += this.dataListDemand[index]['M' + item.Month + item.Year];
      // }

      // this.dataListSum[4]['M' + item.Month + item.Year] = this.dataListDemand[15]['M' + item.Month + item.Year]
      //   + this.dataListDemand[20]['M' + item.Month + item.Year]
      //   + this.dataListDemand[22]['M' + item.Month + item.Year]
      //   + this.dataListDemand[24]['M' + item.Month + item.Year]
      //   + this.dataListDemand[27]['M' + item.Month + item.Year]
      //   + this.dataListDemand[30]['M' + item.Month + item.Year]
      //   + this.dataListDemand[32]['M' + item.Month + item.Year]
      //   + this.dataListDemand[35]['M' + item.Month + item.Year]
      //   + this.dataListDemand[36]['M' + item.Month + item.Year]
      //   + this.dataListDemand[37]['M' + item.Month + item.Year]
      //   + this.dataListDemand[42]['M' + item.Month + item.Year]
      //   + this.dataListDemand[43]['M' + item.Month + item.Year]
      //   + this.dataListDemand[45]['M' + item.Month + item.Year]
      //   + this.dataListDemand[47]['M' + item.Month + item.Year]
      //   + this.dataListDemand[50]['M' + item.Month + item.Year]
      //   + this.dataListDemand[52]['M' + item.Month + item.Year]
      //   + this.dataListDemand[54]['M' + item.Month + item.Year]
      //   + this.dataListDemand[56]['M' + item.Month + item.Year]
      //   + this.dataListDemand[57]['M' + item.Month + item.Year];

      // this.dataListSum[5]['M' + item.Month + item.Year] = this.dataListDemand[13]['M' + item.Month + item.Year]
      //   + this.dataListDemand[14]['M' + item.Month + item.Year]
      //   + this.dataListDemand[17]['M' + item.Month + item.Year]
      //   + this.dataListDemand[18]['M' + item.Month + item.Year]
      //   + this.dataListDemand[19]['M' + item.Month + item.Year]
      //   + this.dataListDemand[21]['M' + item.Month + item.Year]
      //   + this.dataListDemand[23]['M' + item.Month + item.Year]
      //   + this.dataListDemand[26]['M' + item.Month + item.Year]
      //   + this.dataListDemand[29]['M' + item.Month + item.Year]
      //   + this.dataListDemand[31]['M' + item.Month + item.Year]
      //   + this.dataListDemand[33]['M' + item.Month + item.Year]
      //   + this.dataListDemand[34]['M' + item.Month + item.Year]
      //   + this.dataListDemand[41]['M' + item.Month + item.Year]
      //   + this.dataListDemand[44]['M' + item.Month + item.Year]
      //   + this.dataListDemand[46]['M' + item.Month + item.Year]
      //   + this.dataListDemand[49]['M' + item.Month + item.Year]
      //   + this.dataListDemand[51]['M' + item.Month + item.Year]
      //   + this.dataListDemand[53]['M' + item.Month + item.Year]
      //   + this.dataListDemand[55]['M' + item.Month + item.Year];

      // this.dataListSum[6]['M' + item.Month + item.Year] = this.dataListDemand[11]['M' + item.Month + item.Year]
      //   + this.dataListDemand[12]['M' + item.Month + item.Year];
      // this.dataListSum[7]['M' + item.Month + item.Year] = this.dataListDemand[59]['M' + item.Month + item.Year]
      //   + this.dataListDemand[60]['M' + item.Month + item.Year]
      //   + this.dataListDemand[61]['M' + item.Month + item.Year]
      //   + this.dataListDemand[62]['M' + item.Month + item.Year]
      //   + this.dataListDemand[63]['M' + item.Month + item.Year]
      //   + this.dataListDemand[64]['M' + item.Month + item.Year];

      // for (let index = 12; index <= 37; index++) {
      //   this.dataListSum[8]['M' + item.Month + item.Year] += this.dataListDemand[index]['M' + item.Month + item.Year];
      // }

      // this.dataListSum[9]['M' + item.Month + item.Year] = this.dataListDemand[11]['M' + item.Month + item.Year]
      //   + this.dataListDemand[12]['M' + item.Month + item.Year]
      //   + this.dataListDemand[13]['M' + item.Month + item.Year]
      //   + this.dataListDemand[14]['M' + item.Month + item.Year]
      //   + this.dataListDemand[15]['M' + item.Month + item.Year]
      //   + this.dataListDemand[38]['M' + item.Month + item.Year]
      //   + this.dataListDemand[41]['M' + item.Month + item.Year]
      //   + this.dataListDemand[42]['M' + item.Month + item.Year]
      //   + this.dataListDemand[43]['M' + item.Month + item.Year]
      //   + this.dataListDemand[59]['M' + item.Month + item.Year]
      //   + this.dataListDemand[63]['M' + item.Month + item.Year]
      //   + this.dataListDemand[64]['M' + item.Month + item.Year];

      // this.dataListSum[10]['M' + item.Month + item.Year] = this.dataListSum[9]['M' + item.Month + item.Year]
      //   - this.dataListDemand[11]['M' + item.Month + item.Year]
      //   - this.dataListDemand[12]['M' + item.Month + item.Year];

      // this.dataListSum[11]['M' + item.Month + item.Year] = this.dataListDemand[17]['M' + item.Month + item.Year]
      //   + this.dataListDemand[18]['M' + item.Month + item.Year];

      // this.dataListSum[12]['M' + item.Month + item.Year] = this.dataListDemand[23]['M' + item.Month + item.Year]
      //   + this.dataListDemand[24]['M' + item.Month + item.Year]
      //   + this.dataListDemand[46]['M' + item.Month + item.Year]
      //   + this.dataListDemand[47]['M' + item.Month + item.Year]
      //   + this.dataListDemand[60]['M' + item.Month + item.Year];

      // this.dataListSum[13]['M' + item.Month + item.Year] = this.dataListDemand[26]['M' + item.Month + item.Year]
      //   + this.dataListDemand[27]['M' + item.Month + item.Year]
      //   + this.dataListDemand[39]['M' + item.Month + item.Year]
      //   + this.dataListDemand[49]['M' + item.Month + item.Year]
      //   + this.dataListDemand[50]['M' + item.Month + item.Year]
      //   + this.dataListDemand[61]['M' + item.Month + item.Year];

      // this.dataListSum[14]['M' + item.Month + item.Year] = this.dataListDemand[28]['M' + item.Month + item.Year]
      //   + this.dataListDemand[62]['M' + item.Month + item.Year];

      // this.dataListSum[15]['M' + item.Month + item.Year] = this.dataListDemand[19]['M' + item.Month + item.Year]
      //   + this.dataListDemand[20]['M' + item.Month + item.Year]
      //   + this.dataListDemand[43]['M' + item.Month + item.Year]
      //   + this.dataListDemand[44]['M' + item.Month + item.Year];

      // this.dataListSum[16]['M' + item.Month + item.Year] = this.dataListDemand[21]['M' + item.Month + item.Year]
      //   + this.dataListDemand[22]['M' + item.Month + item.Year];

      // this.dataListSum[17]['M' + item.Month + item.Year] = this.dataListDemand[31]['M' + item.Month + item.Year]
      //   + this.dataListDemand[32]['M' + item.Month + item.Year]
      //   + this.dataListDemand[53]['M' + item.Month + item.Year]
      //   + this.dataListDemand[54]['M' + item.Month + item.Year];


      // for (let index = 0; index <= 64; index++) {
      //   this.dataListSum[18]['M' + item.Month + item.Year] += this.dataListDemand[index]['M' + item.Month + item.Year];
      // }

      // this.dataListCheck[0]['M' + item.Month + item.Year] = this.dataListSupply1[6]['M' + item.Month + item.Year]
      //   - this.dataListDemand[41]['M' + item.Month + item.Year]
      //   - this.dataListDemand[42]['M' + item.Month + item.Year]
      //   - this.dataListDemand[43]['M' + item.Month + item.Year]
      //   - this.dataListDemand[44]['M' + item.Month + item.Year]
      //   - this.dataListDemand[45]['M' + item.Month + item.Year]
      //   - this.dataListDemand[46]['M' + item.Month + item.Year]
      //   - this.dataListDemand[47]['M' + item.Month + item.Year]
      //   - this.dataListDemand[49]['M' + item.Month + item.Year]
      //   - this.dataListDemand[50]['M' + item.Month + item.Year]
      //   - this.dataListDemand[51]['M' + item.Month + item.Year]
      //   - this.dataListDemand[52]['M' + item.Month + item.Year]
      //   - this.dataListDemand[53]['M' + item.Month + item.Year]
      //   - this.dataListDemand[54]['M' + item.Month + item.Year]
      //   - this.dataListDemand[55]['M' + item.Month + item.Year]
      //   - this.dataListDemand[56]['M' + item.Month + item.Year]
      //   - this.dataListDemand[57]['M' + item.Month + item.Year];

      // this.dataListCheck[1]['M' + item.Month + item.Year] = this.dataListSupply1[7]['M' + item.Month + item.Year]
      //   - this.dataListDemand[59]['M' + item.Month + item.Year]
      //   - this.dataListDemand[60]['M' + item.Month + item.Year]
      //   - this.dataListDemand[61]['M' + item.Month + item.Year]
      //   - this.dataListDemand[62]['M' + item.Month + item.Year];

      // this.dataListCheck[2]['M' + item.Month + item.Year] = this.dataListSupply1[8]['M' + item.Month + item.Year]
      //   - this.dataListDemand[63]['M' + item.Month + item.Year];

      // this.dataListCheck[3]['M' + item.Month + item.Year] = this.dataListSupply1[9]['M' + item.Month + item.Year]
      //   - this.dataListDemand[64]['M' + item.Month + item.Year];

    });
  }

  setNewBalanceAndC3ImportAndDemand() {

    this.listNewBalance = _.filter(_.cloneDeep(this.dataMaster.masterContract), { contractTypeName: 'Domestic Contract', customerTypeName: 'M.7' });
    this.listNewBalance = _.orderBy(_.filter(this.listNewBalance, x => {
      return x.productName === 'LPG' || x.productName === 'C3';
    }), ['sourceName', 'demandName', 'deliveryName'], ['asc', 'asc', 'asc']);
    // console.log("listNewBalance >> ", this.listNewBalance);

    this.dataListNewBalance = [];

    if (this.listNewBalance) {
      _.each(_.cloneDeep(this.listNewBalance), (it, index) => {
        let lastString = (it?.sourceName === 'GSP RY' ? ' (หัก import แล้ว)' : '');
        this.dataListNewBalance.push({
          rowOrder: (index + 1),
          source: it?.sourceName,
          demand: it?.demandName,
          deliveryPoint: it?.deliveryName + lastString,
          sourceCode: it?.sourceCode,
          deliveryPointCode: it?.deliveryPointCode,
          customerCode: it?.customerCode,
          customerPlantName: it?.customerPlantName,
          isViewOnly: true,
          headerName: 'dataListNewBalance'
        });
      });

      console.log("dataListNewBalance >> ", this.dataListNewBalance);

    }

    this.listC3Import = _.orderBy(_.filter(_.cloneDeep(this.dataMaster.masterContract), x => {
      return x.productName === 'C3' && _.lowerCase(x.sourceName).includes('import');
    }), ['sourceName', 'demandName', 'deliveryName'], ['asc', 'asc', 'asc']);

    console.log("listC3Import >> ", this.listC3Import);
    this.dataListC3Import = [];

    if (this.listC3Import) {
      _.each(_.cloneDeep(this.listC3Import), (it, index) => {
        this.dataListC3Import.push({
          rowOrder: (index + 1),
          source: it?.sourceName,
          demand: it?.demandName,
          deliveryPoint: it?.deliveryName,
          sourceCode: it?.sourceCode,
          deliveryPointCode: it?.deliveryPointCode,
          customerCode: it?.customerCode,
          customerPlantName: it?.customerPlantName,
          isViewOnly: false,
          headerName: 'dataListC3Import'
        });

        this.dataListC3Import[index] = _.merge(this.dataListC3Import[index], this.revisionMonth);

        if ((this.listC3Import.length - 1) === index) {

          this.dataListC3Import.push({
            rowOrder: (this.listC3Import.length + 1),
            source: 'GSP RY',
            demand: 'SCG (Sum C3)',
            deliveryPoint: 'GSP RY',
            isSum: true,
            isViewOnly: true,
            headerName: 'dataListC3Import'
          });

          this.dataListC3Import.push({
            rowOrder: (this.listC3Import.length + 2),
            source: 'GSP RY',
            demand: 'GC (C3/LPG)',
            deliveryPoint: 'GSP RY',
            isSum: true,
            isViewOnly: true,
            headerName: 'dataListC3Import'
          });

        }

      });

    }

    this.listPetro = _.filter(_.cloneDeep(this.dataMaster.masterContract), x => {
      return x.contractTypeName === 'Petro Contract' && x.productName === 'LPG' || x.productName === 'C3'
    });

    this.listPetroC2Subsititue = _.filter(_.cloneDeep(this.dataMaster.masterContract), x => {
      return x.contractTypeName === 'Petro Contract' && x.productName === 'C2' && x.conditionsOfSaleName === 'Subsititue'
    });

    this.listDomestic = _.filter(_.cloneDeep(this.dataMaster.masterContract), x => {
      return x.contractTypeName === 'Domestic Contract' && x.productName === 'LPG' || x.productName === 'C3'
    });

    console.log("petroList >> ", this.listPetro);
    console.log("petroC2SubsititueList >> ", this.listPetroC2Subsititue);
    console.log("domesticList >> ", this.listDomestic);

    this.listDemand1 = [];
    this.listDemand2 = [];
    this.dataListDemand = [];

    this.listDemand1 = [
      ...this.listPetro,
      ...this.listPetroC2Subsititue
    ];

    this.listDemand1 = _.uniqBy(_.orderBy(this.listDemand1, ['sourceName', 'demandName', 'deliveryName'], ['asc', 'asc', 'asc']), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());

    this.listDemand2 = [
      ...this.listDomestic
    ];

    this.listDemand2 = _.uniqBy(_.orderBy(this.listDemand2, ['sourceName', 'demandName', 'deliveryName'], ['asc', 'asc', 'asc']), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());

    console.log("listDemand1 >> ", this.listDemand1);
    let rowOrder = 0;
    if (this.listDemand1) {
      rowOrder = (this.listDemand1.length + 1);
      _.each(_.cloneDeep(this.listDemand1), (it, index) => {
        this.dataListDemand.push({
          rowOrder: (index + 1),
          customerType: 'Petro',
          source: it?.sourceName,
          demand: it?.demandName,
          deliveryPoint: it?.deliveryName,
          sourceCode: it?.sourceCode,
          deliveryPointCode: it?.deliveryPointCode,
          customerCode: it?.customerCode,
          customerPlantName: it?.customerPlantName,
          isViewOnly: false,
          headerName: 'dataListDemand'
        });

        this.dataListDemand[index] = _.merge(this.dataListDemand[index], this.revisionMonth);

      });
    }

    console.log("listDemand2 >> ", this.listDemand2);
    if (this.listDemand2) {
      _.each(_.cloneDeep(this.listDemand2), (it, index) => {
        this.dataListDemand.push({
          rowOrder: (rowOrder + index),
          customerType: 'Domestic',
          source: it?.sourceName,
          demand: it?.demandName,
          deliveryPoint: it?.deliveryName,
          sourceCode: it?.sourceCode,
          deliveryPointCode: it?.deliveryPointCode,
          customerCode: it?.customerCode,
          customerPlantName: it?.customerPlantName,
          isViewOnly: false,
          headerName: 'dataListDemand'
        });

        this.dataListDemand[((rowOrder - 1) + index)] = _.merge(this.dataListDemand[((rowOrder - 1) + index)], this.revisionMonth);

      });
    }


    console.log("this.dataListC3Import >> ", this.dataListC3Import);
    console.log("this.dataListDemand >> ", this.dataListDemand);

    // this.setCalculateData();
  }

  getDataToLrMonthly() {

    let dataResult: any = {};
    dataResult.balanceC3LpgList = this.dataListBalanceC3LPG;
    dataResult.supplyList = this.dataListSupply1;
    dataResult.demandList = this.dataListDemand;
    dataResult.C3ImportList = this.dataListC3Import;
    dataResult.sumList = this.dataListSum;
    dataResult.listMonth = this.listMonth;

    return dataResult;
  }

  renderDataFromMergeAllo(mergeAlloC3LpgData: any) {

    console.log("mergeAlloC3LpgData >> ", mergeAlloC3LpgData);

    if (mergeAlloC3LpgData['merge_allocation']) {
      const C3LPG = mergeAlloC3LpgData['merge_allocation'];

      _.each(_.cloneDeep(this.listMonth), (it, index) => {

        //#region Balance C3/LPG

        this.dataListBalanceC3LPG[0]['M' + it.Month + it.Year] = C3LPG['C3LPG_Tank_capacity']['volume'][index];
        this.dataListBalanceC3LPG[1]['M' + it.Month + it.Year] = C3LPG['C3LPG_End_Inventory']['volume'][index];
        this.dataListBalanceC3LPG[2]['M' + it.Month + it.Year] = C3LPG['%_C3LPG_Inventory']['volume'][index].replace("%", "").replace("inf ", "");
        // revision
        // this.dataListBalanceC3LPG[3]['M' + it.Month + it.Year] = C3LPG['Import_จ่ายแทน_GSP']['volume'][index];
        let filterRevisionC3LPG3 = this.dataListBalanceC3LPG[3]['listRevisionM' + it.Month + it.Year];
        if (filterRevisionC3LPG3?.length == 0) {
          this.dataListBalanceC3LPG[3]['M' + it.Month + it.Year] = C3LPG['Import_จ่ายแทน_GSP']['volume'][index];
          this.dataListBalanceC3LPG[3]['listRevisionM' + it.Month + it.Year] = [{
            unit: 'KT/Month',
            value: C3LPG['Import_จ่ายแทน_GSP']['volume'][index],
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
          if (filterRevisionC3LPG3?.isManual == false) {
            this.dataListBalanceC3LPG[3]['M' + it.Month + it.Year] = C3LPG['Import_จ่ายแทน_GSP']['volume'][index];
          }
        }

        // this.dataListBalanceC3LPG[4]['M' + it.Month + it.Year] = C3LPG['รอจำหน่าย']['volume'][index];
        let filterRevisionC3LPG4 = this.dataListBalanceC3LPG[4]['listRevisionM' + it.Month + it.Year];
        if (filterRevisionC3LPG4?.length == 0) {
          this.dataListBalanceC3LPG[4]['M' + it.Month + it.Year] = C3LPG['รอจำหน่าย']['volume'][index];
          this.dataListBalanceC3LPG[4]['listRevisionM' + it.Month + it.Year] = [{
            unit: 'KT/Month',
            value: C3LPG['รอจำหน่าย']['volume'][index],
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
          if (filterRevisionC3LPG4?.isManual == false) {
            this.dataListBalanceC3LPG[4]['M' + it.Month + it.Year] = C3LPG['รอจำหน่าย']['volume'][index];
          }
        }

        // this.dataListBalanceC3LPG[5]['M' + it.Month + it.Year] = C3LPG['ดึง_Unknow_untax']['volume'][index];
        let filterRevisionC3LPG5 = this.dataListBalanceC3LPG[4]['listRevisionM' + it.Month + it.Year];
        if (filterRevisionC3LPG5?.length == 0) {
          this.dataListBalanceC3LPG[5]['M' + it.Month + it.Year] = C3LPG['ดึง_Unknow_untax']['volume'][index];
          this.dataListBalanceC3LPG[5]['listRevisionM' + it.Month + it.Year] = [{
            unit: 'KT/Month',
            value: C3LPG['ดึง_Unknow_untax']['volume'][index],
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
          if (filterRevisionC3LPG5?.isManual == false) {
            this.dataListBalanceC3LPG[5]['M' + it.Month + it.Year] = C3LPG['ดึง_Unknow_untax']['volume'][index];
          }
        }

        // revision

        //#endregion

        //#region Balance C3
        this.dataListBalanceC3[0]['M' + it.Month + it.Year] = C3LPG['Balance C3__C3_Tank_capacity']['volume'][index];
        // this.dataListBalanceC3[1]['M' + it.Month + it.Year] = C3LPG['Balance C3__C3_End_Inventory']['volume'][index];
        let filterRevisionC31 = this.dataListBalanceC3[1]['listRevisionM' + it.Month + it.Year];
        if (filterRevisionC31?.length == 0) {
          this.dataListBalanceC3[1]['M' + it.Month + it.Year] = C3LPG['Balance C3__C3_End_Inventory']['volume'][index];
          this.dataListBalanceC3[1]['listRevisionM' + it.Month + it.Year] = [{
            unit: 'KT/Month',
            value: C3LPG['Balance C3__C3_End_Inventory']['volume'][index],
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
          if (filterRevisionC31?.isManual == false) {
            this.dataListBalanceC3[1]['M' + it.Month + it.Year] = C3LPG['Balance C3__C3_End_Inventory']['volume'][index];
          }
        }


        if (C3LPG['Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton']) {
          // this.dataListBalanceC3[2]['M' + it.Month + it.Year] = C3LPG['Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton']['volume'][index];
          let filterRevisionC32 = this.dataListBalanceC3[2]['listRevisionM' + it.Month + it.Year];
          if (filterRevisionC32?.length == 0) {
            this.dataListBalanceC3[2]['M' + it.Month + it.Year] = C3LPG['Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton']['volume'][index];
            this.dataListBalanceC3[2]['listRevisionM' + it.Month + it.Year] = [{
              unit: 'KT/Month',
              value: C3LPG['Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton']['volume'][index],
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
            if (filterRevisionC32?.isManual == false) {
              this.dataListBalanceC3[2]['M' + it.Month + it.Year] = C3LPG['Balance C3__Cross_to_LPG_normal_cross_C3_to_aerosol_1000_Ton']['volume'][index];
            }
          }
        }

        if (C3LPG['Balance C3__%_Inventory_ไม่ต่ำกว่า_50%_ไม่เกิน_85%'])
          this.dataListBalanceC3[3]['M' + it.Month + it.Year] = C3LPG['Balance C3__%_Inventory_ไม่ต่ำกว่า_50%_ไม่เกิน_85%']['volume'][index].replace("%", "").replace("inf ", "");
        //#endregion

        //#region LPG
        this.dataListBalanceLPG[0]['M' + it.Month + it.Year] = C3LPG['Balance LPG__LPG_Tank_capacity']['volume'][index];
        this.dataListBalanceLPG[1]['M' + it.Month + it.Year] = C3LPG['Balance LPG__LPG_End_Inventory']['volume'][index];
        // ***
        this.dataListBalanceLPG[2]['M' + it.Month + it.Year] = C3LPG['Balance LPG__% Inventory_30%พิจารณาดึง_import_แทน_C3_Cross_to_LPG)']['volume'][index].replace("%", "").replace("inf ", "");
        //#endregion

        //#region LPG Petro
        this.dataListBalanceLPGPetro[0]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_Tank_capacity']['volume'][index];
        // this.dataListBalanceLPGPetro[1]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_End_Inventory']['volume'][index];
        let filterRevisionLPGPetro1 = this.dataListBalanceLPGPetro[1]['listRevisionM' + it.Month + it.Year];
        if (filterRevisionLPGPetro1?.length == 0) {
          this.dataListBalanceLPGPetro[1]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_End_Inventory']['volume'][index];
          this.dataListBalanceLPGPetro[1]['listRevisionM' + it.Month + it.Year] = [{
            unit: 'KT/Month',
            value: C3LPG['Balance LPG Petro__LPG_Petro_End_Inventory']['volume'][index],
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
          if (filterRevisionLPGPetro1?.isManual == false) {
            this.dataListBalanceLPGPetro[1]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_End_Inventory']['volume'][index];
          }
        }
        if (C3LPG['Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom']) {
          // this.dataListBalanceLPGPetro[2]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom']['volume'][index];
          let filterRevisionLPGPetro2 = this.dataListBalanceLPGPetro[2]['listRevisionM' + it.Month + it.Year];
          if (filterRevisionLPGPetro2?.length == 0) {
            this.dataListBalanceLPGPetro[2]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom']['volume'][index];
            this.dataListBalanceLPGPetro[2]['listRevisionM' + it.Month + it.Year] = [{
              unit: 'KT/Month',
              value: C3LPG['Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom']['volume'][index],
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
            if (filterRevisionLPGPetro2?.isManual == false) {
              this.dataListBalanceLPGPetro[2]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__LPG_Petro_Cross_to_LPG_Dom']['volume'][index];
            }
          }
        }
        if (C3LPG['Balance LPG Petro__%_LPG_Petro_Inventory_(>30%)'])
          this.dataListBalanceLPGPetro[3]['M' + it.Month + it.Year] = C3LPG['Balance LPG Petro__%_LPG_Petro_Inventory_(>30%)']['volume'][index].replace("%", "").replace("inf ", "");
        //#endregion

        //#region LPG Dom
        this.dataListBalanceLPGDom[0]['M' + it.Month + it.Year] = C3LPG['Balance LPG Dom__LPG_Dom_Tank capacity']['volume'][index];
        this.dataListBalanceLPGDom[1]['M' + it.Month + it.Year] = C3LPG['Balance LPG Dom__LPG_Dom_End Inventory']['volume'][index];
        if (C3LPG['Balance LPG Dom__%_LPG_Dom_Inventory'])
          this.dataListBalanceLPGDom[2]['M' + it.Month + it.Year] = C3LPG['Balance LPG Dom__%_LPG_Dom_Inventory']['volume'][index].replace("%", "").replace("inf ", "");
        //#endregion

        //#region Supply Last
        this.dataListSupply1[0]['M' + it.Month + it.Year] = C3LPG['Supply__C3_GSP RY']['volume'][index];
        this.dataListSupply1[1]['M' + it.Month + it.Year] = C3LPG['Supply__LPG_GSP RY']['volume'][index];
        // this.dataListSupply1[2]['M' + it.Month + it.Year] = C3LPG['Supply__LPG_GSP RY__Petro']['volume'][index];  ***
        // this.dataListSupply1[3]['M' + it.Month + it.Year] = C3LPG['Supply__LPG_GSP RY__Dom']['volume'][index];  ***
        this.dataListSupply1[4]['M' + it.Month + it.Year] = C3LPG['Supply__C3_GSP RY']['volume'][index];
        this.dataListSupply1[5]['M' + it.Month + it.Year] = C3LPG['Supply__IRPC']['volume'][index];
        this.dataListSupply1[6]['M' + it.Month + it.Year] = C3LPG['Supply__GC']['volume'][index];
        this.dataListSupply1[7]['M' + it.Month + it.Year] = C3LPG['Supply__SPRC']['volume'][index];
        this.dataListSupply1[8]['M' + it.Month + it.Year] = C3LPG['Supply__PTTEP/LKB']['volume'][index];
        this.dataListSupply1[9]['M' + it.Month + it.Year] = C3LPG['Supply__GSP_KHM']['volume'][index];
        this.dataListSupply1[10]['M' + it.Month + it.Year] = C3LPG['Supply__Total_Supply']['volume'][index];
        //#endregion

      });

    }

  }
  tabBalanceChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.gridTabBalanceRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }
  tabSupplyChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.gridTabSupplyRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }
  tabDemandChange($event) {
    this.loaderService.show();
    setTimeout(() => {
      this.gridTabDemandRefresh(() => {
        this.loaderService.hide();
      });
    }, 100);
  }
}
