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

@Component({
  selector: 'app-optimization-data-grid-lr-monthly',
  templateUrl: './optimization-data-grid-lr-monthly.component.html',
  styleUrls: ['./optimization-data-grid-lr-monthly.component.css']
})
export class OptimizationDataGridLrMonthlyComponent implements OnInit {

  dataList: any = [];
  dataListRevision: any = [];
  dataListVersion0: any = [];

  dataListGSPRY: any = [];
  dataListMTBRP: any = [];
  dataListIMPORTCARCO: any = [];
  dataListCLOSINGSTOCK: any = [];

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
  listC3Import: any = [];

  isFirstLoad: boolean = true;
  @Input() dataInfo: any = {};
  @Input() maxVersion: any = 0;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('targetGroupPopup', { static: true }) validationGroupPopup: DxValidationGroupComponent;
  @ViewChild('dataGrid1', { static: false }) dataGrid1: DxDataGridComponent;
  @ViewChild('dataGrid2', { static: false }) dataGrid2: DxDataGridComponent;
  @ViewChild('dataGrid3', { static: false }) dataGrid3: DxDataGridComponent;
  @ViewChild('dataGrid4', { static: false }) dataGrid4: DxDataGridComponent;
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
    private optimizationsService: OptimizationsService,
    private masterContractService: MasterContractService,) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  async onYearChange(year: any, month: any, version: any, maxVersion, isWithOutDemandAI: boolean, listMonth: any, dynamicColumns: any, revisionMonth: any, dataList: any, dataListRevision: any, masterUnit, masterContract: any) {
    // this.loaderService.show();
    this.isFirstLoad = true;
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.isWithOutDemandAI = isWithOutDemandAI;

    //this.revisionMonth = revisionMonth;
    this.dataMaster.masterUnit = masterUnit;
    this.dataList = dataList;
    this.dataListRevision = dataListRevision;
    this.dataMaster.masterContract = masterContract;
    this.dynamicColumns = dynamicColumns;
    this.listMonth = listMonth;

    this.dataListGSPRY = [];
    this.dataListMTBRP = [];
    this.dataListIMPORTCARCO = [];
    this.dataListCLOSINGSTOCK = [];

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
    // this.dynamicColumns.push(column0);
    // this.dynamicColumns.push(column1);

    // let revisionMonth = {};
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

    //   // revisionMonth['listRevision' + 'M' + item.Month + item.Year] = [];
    // })

    //#region GS PRY

    this.dataListGSPRY.push({
      rowOrder: 1,
      production: "Supply",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 2,
      production: "GSP RY Production",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 3,
      production: "GC Production",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 4,
      production: "Import",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 5,
      production: "Demand",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 6,
      production: "แผนขาย Petro",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 7,
      production: "จ่าย Domestic",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 8,
      production: "- PTT Tank",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 9,
      production: "- MT&BRP (Vary)",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 10,
      production: "- GSP RY",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 11,
      production: "รอขายเพิ่ม",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    this.dataListGSPRY.push({
      rowOrder: 12,
      production: "GSP RY Ending Inventory",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListGSPRY'
    });

    //#endregion

    //#region MT & BRP

    this.dataListMTBRP.push({
      rowOrder: 1,
      production: "Supply",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 2,
      production: "GSP",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 3,
      production: "Import",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 4,
      production: "- GSP ดึงจ่าย import",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 5,
      production: "- Re-Export",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 6,
      production: "Demand",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 7,
      production: "Domestic",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 8,
      production: "Re-Export",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 9,
      production: "- ดึง Import ขาย Re-Export to TBU (Vessel)",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 10,
      production: "- ดึง Import ขาย Re-Export to OR (Truck)",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 11,
      production: "BRP Ending Inventory",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 12,
      production: "MT-Sphere Ending Inventory",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 13,
      production: "MT-C3 Refig Ending Inventory",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 14,
      production: "MT-C4 Refig Ending Inventory",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 15,
      production: "MT-C3 Refig Ending Inventory (LIFE)",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    this.dataListMTBRP.push({
      rowOrder: 16,
      production: "MT-C4 Refig Ending Inventory (LIFE)",
      unit: 'KT',
      isViewOnly: false,
      headerName: 'dataListMTBRP'
    });

    //#endregion

    //#region Import Cargo of PTT

    this.dataListIMPORTCARCO.push({
      rowOrder: 1,
      production: "Import Cargo of PTT",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListIMPORTCARCO'
    });

    this.dataListIMPORTCARCO.push({
      rowOrder: 2,
      production: "Import Cargo to MT Port",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListIMPORTCARCO'
    });

    //#endregion

    this.dataListCLOSINGSTOCK.push({
      rowOrder: 1,
      production: "Closing stock @GSP+MT+BRP (LR) (min กม. 22.03--> 33.21 KT/ internal LR 39.03 --> 50.21 KT)",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListCLOSINGSTOCK'
    });

    this.retrieveMasterData().subscribe(res => {
      console.log("res LR Monthly > ", res);
      // this.dataMaster.masterUnit = res[0];
      this.dataList = res[0];
      // this.dataListRevision = res[2];
      this.dataMaster.masterContract = res[1]

      this.setC3Import();
      this.setDataList();
    });

  }

  retrieveMasterData(): Observable<any> {
    // const masterUnit = this.unitService.getList();
    const optimizationData = this.optimizationsService.getListLrMonthly(this.year, this.month, this.version, this.isWithOutDemandAI);
    // const optimizationRevisionData = this.optimizationsService.getRevisionListLrMonthly(this.year, this.month, this.version, this.isWithOutDemandAI);
    const masterContract = this.masterContractService.getGen(this.year, this.month);
    return forkJoin([optimizationData, masterContract]);
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
    if (e.rowType === "data" && e.columnIndex > 0 && !e.data.isViewOnly) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.columnIndex === 0 && !e.data.isViewOnly) {
      e.cellElement.classList.add('colorEdit');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 1)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  gridRefresh(C3LPG_DATA?: any,calBack?: any) {
    if (C3LPG_DATA) {
      this.setDataFromC3Lpg(C3LPG_DATA);
    }
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoad) {
      this.gridState(calBack);
      return;
    }

    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.dataGrid1.instance.refresh();
      this.dataGrid2.instance.refresh();
      this.dataGrid3.instance.refresh();
      this.dataGrid4.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridState(calBack?) {
    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.isFirstLoad = false;
      this.dataGrid1.instance.state(null);
      this.dataGrid2.instance.state(null);
      this.dataGrid3.instance.state(null);
      this.dataGrid4.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }

  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  itemClick(event: any, month: any, row: any, data: any, item: any, dataField: any, monthEdit?: any, yearEdit?: any) {
    console.log('item >> ', item);
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
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      });


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
    dataSave.optimizationLrMonthly = [];
    dataSave.optimizationLrMonthlyRevision = [];

    let allDataList = [
      ...this.dataListGSPRY,
      ...this.dataListMTBRP,
      ...this.dataListIMPORTCARCO,
      ...this.dataListCLOSINGSTOCK
    ];

    console.log("allDataList >>", allDataList);

    _.each(allDataList, (i) => {
      _.each(this.listMonth, (x) => {

        let _id = uuid();

        dataSave.optimizationLrMonthly.push({
          id: _id,
          productionGroup: i?.headerName,
          production: i?.production || null,
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

        // if (i['listRevisionM' + x.Month + x.Year]?.length) {
        //   _.each(_.cloneDeep(i['listRevisionM' + x.Month + x.Year]), (v) => {
        //     dataSave.optimizationCo2Revision.push({
        //       optimizationCo2Id: _id,
        //       unit: v?.unit,
        //       value: v?.value,
        //       remark: v?.remark,
        //       workDay: v?.workDay,
        //       isManul: (v?.isManul ? v?.isManul : false),
        //       valueManual: v?.valueManual || null,
        //       year: _.toNumber(this.year),
        //       month: _.toNumber(this.month),
        //       version: versionSave,
        //       rowOrder: v?.rowOrder,
        //       activeStatus: 1,
        //       isWithOutDemandAI: isWithOutDemandAI
        //     });
        //   });
        // }

      });
    });

    console.log('dataSave ', dataSave);
    return dataSave;
  }

  setDataList() {

    _.each(this.dataListGSPRY, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
        });
      }
    });

    _.each(this.dataListMTBRP, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
        });
      }
    });

    _.each(this.dataListIMPORTCARCO, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
        });
      }
    });

    _.each(this.dataListCLOSINGSTOCK, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
        });
      }
    });

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

  setC3Import() {

    this.listC3Import = _.orderBy(_.filter(_.cloneDeep(this.dataMaster.masterContract), x => {
      return x.productName === 'C3' && _.lowerCase(x.sourceName).includes('import');
    }), ['sourceName', 'demandName', 'deliveryName'], ['asc', 'asc', 'asc']);

    console.log("listC3Import lr-monthly >> ", this.listC3Import);
    // this.dataListC3Import = [];
    if (this.listC3Import) {
      let rowOrders = 2;
      _.each(_.cloneDeep(this.listC3Import), (it, index) => {
        rowOrders = (index + (rowOrders + 1));
        this.dataListIMPORTCARCO.push({
          rowOrder: (index + (rowOrders + 1)),
          source: it?.sourceName,
          demand: it?.demandName,
          production: it?.demandName,
          unit: it?.unitName,
          deliveryPoint: it?.deliveryName,
          sourceCode: it?.sourceCode,
          deliveryPointCode: it?.deliveryPointCode,
          customerCode: it?.customerCode,
          customerPlantName: it?.customerPlantName,
          isViewOnly: true,
          headerName: 'dataListIMPORTCARCO'
        });

        // this.dataListIMPORTCARCO[index] = _.merge(this.dataListIMPORTCARCO[index], this.revisionMonth);

        // if ((this.listC3Import.length - 1) === index) {
        //   this.dataListIMPORTCARCO.push({
        //     rowOrder: (rowOrders + 1),
        //     production: 'Closing stock @GSP+MT+BRP (LR) (min กม. 22.03--> 33.21 KT/ internal LR 39.03 --> 50.21 KT)',
        //     unit: 'KT',
        //     isViewOnly: true,
        //     headerName: 'dataListIMPORTCARCO'
        //   });
        // }
      });
    }
  }

  setDataFromC3Lpg(C3LPG_DATA: any) {

    // console.log("C3LPG_DATA >> ", C3LPG_DATA);
    // console.log("dataListIMPORTCARCO >> ", this.dataListIMPORTCARCO);
    _.each(C3LPG_DATA.listMonth, (item) => {

      //#region GSP RY

      this.dataListGSPRY[1]['M' + item.Month + item.Year] = C3LPG_DATA.supplyList[4]['M' + item.Month + item.Year] || 0;
      this.dataListGSPRY[2]['M' + item.Month + item.Year] = C3LPG_DATA.supplyList[6]['M' + item.Month + item.Year] || 0;
      this.dataListGSPRY[3]['M' + item.Month + item.Year] = C3LPG_DATA.balanceC3LpgList[3]['M' + item.Month + item.Year] || 0;

      this.dataListGSPRY[0]['M' + item.Month + item.Year] = (this.dataListGSPRY[1]['M' + item.Month + item.Year] + this.dataListGSPRY[2]['M' + item.Month + item.Year] + this.dataListGSPRY[3]['M' + item.Month + item.Year]);

      this.dataListGSPRY[5]['M' + item.Month + item.Year] = C3LPG_DATA.sumList[0]['M' + item.Month + item.Year] || 0;
      this.dataListGSPRY[7]['M' + item.Month + item.Year] = C3LPG_DATA.sumList[4]['M' + item.Month + item.Year] || 0; //- PTT Tank
      this.dataListGSPRY[8]['M' + item.Month + item.Year] = C3LPG_DATA.sumList[5]['M' + item.Month + item.Year] || 0; //- MT&BRP (Vary)
      this.dataListGSPRY[9]['M' + item.Month + item.Year] = C3LPG_DATA.sumList[6]['M' + item.Month + item.Year] || 0; //- GSP RY

      this.dataListGSPRY[6]['M' + item.Month + item.Year] = (this.dataListGSPRY[7]['M' + item.Month + item.Year] + this.dataListGSPRY[8]['M' + item.Month + item.Year] + this.dataListGSPRY[9]['M' + item.Month + item.Year]);

      this.dataListGSPRY[10]['M' + item.Month + item.Year] = C3LPG_DATA.balanceC3LpgList[4]['M' + item.Month + item.Year] || 0;
      this.dataListGSPRY[11]['M' + item.Month + item.Year] = item?.totalDay;

      //#endregion

      //#region MT&BRP

      this.dataListMTBRP[1]['M' + item.Month + item.Year] = this.dataListGSPRY[8]['M' + item.Month + item.Year] || 0;
      this.dataListMTBRP[3]['M' + item.Month + item.Year] = this.dataListGSPRY[3]['M' + item.Month + item.Year] || 0; // X19

      this.dataListMTBRP[6]['M' + item.Month + item.Year] = this.dataListGSPRY[8]['M' + item.Month + item.Year] || 0;
      this.dataListMTBRP[7]['M' + item.Month + item.Year] = (this.dataListMTBRP[8]['M' + item.Month + item.Year] + this.dataListMTBRP[9]['M' + item.Month + item.Year]) || 0;

      this.dataListMTBRP[4]['M' + item.Month + item.Year] = (this.dataListMTBRP[8]['M' + item.Month + item.Year] + this.dataListMTBRP[9]['M' + item.Month + item.Year]) || 0;
      this.dataListMTBRP[2]['M' + item.Month + item.Year] = (this.dataListMTBRP[3]['M' + item.Month + item.Year] + this.dataListMTBRP[4]['M' + item.Month + item.Year]) || 0;

      this.dataListMTBRP[0]['M' + item.Month + item.Year] = (this.dataListMTBRP[1]['M' + item.Month + item.Year] + this.dataListMTBRP[2]['M' + item.Month + item.Year]) || 0;

      this.dataListMTBRP[5]['M' + item.Month + item.Year] = (this.dataListMTBRP[6]['M' + item.Month + item.Year] + this.dataListMTBRP[7]['M' + item.Month + item.Year]) || 0;

      //#endregion
    });

    //#region Import Cargo of PTT

    _.each(this.dataListIMPORTCARCO, x => {
      if (x?.customerCode) {
        const findDataImport = _.find(_.cloneDeep(C3LPG_DATA?.C3ImportList), { customerCode: x?.customerCode, deliveryPointCode: x?.deliveryPointCode, sourceCode: x?.sourceCode });
        if (findDataImport) {
          _.each(C3LPG_DATA.listMonth, (item) => {
            x['M' + item.Month + item.Year] = _.toNumber(findDataImport['M' + item.Month + item.Year]) || 0;
            this.dataListIMPORTCARCO[1]['M' + item.Month + item.Year] = (_.toNumber(this.dataListIMPORTCARCO[0]['M' + item.Month + item.Year]) - _.toNumber(x['M' + item.Month + item.Year]));
          });
        }
      }
    });

    //#endregion
    _.each(C3LPG_DATA.listMonth, (item) => {
      this.dataListCLOSINGSTOCK[0]['M' + item.Month + item.Year] = this.dataListMTBRP[10]['M' + item.Month + item.Year]
        + this.dataListMTBRP[11]['M' + item.Month + item.Year]
        + this.dataListMTBRP[12]['M' + item.Month + item.Year]
        + this.dataListMTBRP[13]['M' + item.Month + item.Year]
        + this.dataListMTBRP[14]['M' + item.Month + item.Year]
        + this.dataListMTBRP[15]['M' + item.Month + item.Year];
    });

  }

}
