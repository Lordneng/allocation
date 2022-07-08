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

@Component({
  selector: 'app-optimization-data-grid-pantane',
  templateUrl: './optimization-data-grid-pantane.component.html',
  styleUrls: ['./optimization-data-grid-pantane.component.css']
})
export class OptimizationDataGridPantaneComponent implements OnInit {

  dataList: any = [];
  dataListRevision: any = [];
  dataListVersion0: any = [];

  dataListAbility: any = [];
  dataListDemand: any = [];

  dataListBalanceVersion0: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  @Input() numberBoxDigi = 0;
  numberBoxFormat = '#,##0';
  // numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dynamicColumnDemand: any[] = [];
  dynamicColumnAbility0s: any[] = [];
  dynamicColumnAbility1s: any[] = [];
  dynamicColumnStandardRates: any[] = [];
  dynamicColumnAllocates: any[] = [];
  dynamicColumnSCGs: any[] = [];
  dynamicColumnGCs: any[] = [];
  dynamicColumnBalances: any[] = [];

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
  @ViewChild('dataGrid1', { static: false }) dataGrid1: DxDataGridComponent;
  @ViewChild('dataGrid2', { static: false }) dataGrid2: DxDataGridComponent;

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
    private optimizationsService: OptimizationsService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  async onYearChange(year: any, month: any, version: any, maxVersion, isWithOutDemandAI: boolean, listMonth: any, dynamicColumns: any, revisionMonth: any, dataList: any, dataListRevision: any, masterUnit, dynamicColumnDemand: any) {
    // this.loaderService.show();
    this.isFirstLoad = true;
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.isWithOutDemandAI = isWithOutDemandAI;

    // this.revisionMonth = revisionMonth;
    this.dataMaster.masterUnit = masterUnit;
    this.dataList = dataList;
    this.dataListRevision = dataListRevision;
    // this.dataMaster.masterContract = masterContract;
    this.dynamicColumns = dynamicColumns;
    this.dynamicColumnDemand = dynamicColumnDemand;
    this.listMonth = listMonth;

    this.dataListAbility = [];
    this.dataListDemand = [];

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
    // this.dynamicColumnDemand = [];
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
    //   });

    //   // revisionMonth['listRevision' + 'M' + item.Month + item.Year] = [];
    // })

    //ใส่ production และ Unit กรณีไม่มีการบันทึกข้อมู,ใน database
    this.dataListAbility.push({
      rowOrder: 1,
      production: "volume",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListAbility'
    });

    // ----------- dataListDemand ------------- //

    this.dataListDemand.push({
      rowOrder: 1,
      production: "SCG Tier1",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListDemand'
    });

    this.dataListDemand.push({
      rowOrder: 2,
      production: "SCG Tier2",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListDemand'
    });

    this.dataListDemand.push({
      rowOrder: 3,
      production: "SCG Tier3",
      unit: 'KT',
      isViewOnly: true,
      headerName: 'dataListDemand'
    });

    // this.retrieveMasterData().subscribe(res => {
    //   console.log("res Pantane > ", res);
    //   this.dataList = res[0];
    //   this.dataListRevision = res[1];
    //   this.setDataList();
    // });

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


  gridRefresh(calBack?) {
    // console.log("this.isFirstLoad >> ", this.isFirstLoad);
    if (this.isFirstLoad) {
      this.gridState(calBack);
      return;
    }

    if (this.dataGrid1 && this.dataGrid1.instance) {
      this.dataGrid1.instance.refresh();
      this.dataGrid2.instance.refresh();
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
    dataSave.optimizationPantane = [];
    dataSave.optimizationPantaneRevision = [];

    let allDataList = [
      ...this.dataListAbility,
      ...this.dataListDemand,
    ];

    console.log("allDataList >>", allDataList);

    _.each(allDataList, (i) => {
      _.each(this.listMonth, (x) => {

        let _id = uuid();

        dataSave.optimizationPantane.push({
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
        //     dataSave.optimizationNglRevision.push({
        //       optimizationNglId: _id,
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

    _.each(this.dataListAbility, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
        });
      }
    });

    _.each(this.dataListDemand, item => {
      const filterData = _.filter(_.cloneDeep(this.dataList), { productionGroup: item?.headerName, production: item?.production, unit: item?.unit });
      if (filterData) {
        _.each(filterData, i => {
          item['M' + i.monthValue + i.yearValue] = i.value;
          item['RemarkM' + i.monthValue + i.yearValue] = i.remark;
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

}

