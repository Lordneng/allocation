import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';
import data from 'src/app/constants/menu';

@Component({
  selector: 'app-ability-plan-rayong-data-grid',
  templateUrl: './ability-plan-rayong-data-grid.component.html',
  styleUrls: ['./ability-plan-rayong-data-grid.component.css'],
})
export class AbilityPlanRayongDataGridComponent implements OnInit {
  dataList: any = [];
  dataListOld: any = [];
  listMonth = [];
  calculateSetting: any = [
    {
      name: '/month.',
      cal: false,
    },
    {
      name: '/hr.',
      cal: true,
    },
  ];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  productData = [
    {
      id: 0,
      product: 'Ethane',
      productCode: 'C2',
      rowOrder: 0,
      detail: [
        { code: 'gsP1', caption: 'GSP1', rowOrder: 0 },
        { code: 'gsP2', caption: 'GSP2', rowOrder: 1 },
        { code: 'gsP3', caption: 'GSP3', rowOrder: 2 },
        { code: 'esp', caption: 'ESP', rowOrder: 3 },
        { code: 'gsP5', caption: 'GSP5', rowOrder: 4 },
        { code: 'gsP6', caption: 'GSP6', rowOrder: 5 },
        { code: 'total', caption: 'Total', rowOrder: 6 },
      ],
    },
    {
      id: 1,
      product: 'C3/LPG',
      productCode: 'C3',
      rowOrder: 1,
      detail: [
        { code: 'gsP1', caption: 'GSP1', rowOrder: 0 },
        { code: 'gsP2', caption: 'GSP2', rowOrder: 1 },
        { code: 'gsP3', caption: 'GSP3', rowOrder: 2 },
        { code: 'gsP5', caption: 'GSP5', rowOrder: 3 },
        { code: 'gsP6', caption: 'GSP6', rowOrder: 4 },
        { code: 'total', caption: 'Total', rowOrder: 5 },
      ],
    },
    {
      id: 2,
      product: 'NGL',
      productCode: 'NGL',
      rowOrder: 2,
      detail: [
        { code: 'gsP1', caption: 'GSP1', rowOrder: 0 },
        { code: 'gsP2', caption: 'GSP2', rowOrder: 1 },
        { code: 'gsP3', caption: 'GSP3', rowOrder: 2 },
        { code: 'gsP5', caption: 'GSP5', rowOrder: 3 },
        { code: 'gsP6', caption: 'GSP6', rowOrder: 4 },
        { code: 'stab', caption: 'Stab', rowOrder: 5 },
        { code: 'total', caption: 'Total', rowOrder: 6 },
      ],
    },
    {
      id: 3,
      product: 'C3',
      productCode: 'C3',
      rowOrder: 3,
      detail: [
        { code: 'gsP1', caption: 'GSP1', rowOrder: 0 },
        { code: 'gsP2', caption: 'GSP2', rowOrder: 1 },
        { code: 'gsP3', caption: 'GSP3', rowOrder: 2 },
        { code: 'gsP5', caption: 'GSP5', rowOrder: 3 },
        { code: 'gsP6', caption: 'GSP6', rowOrder: 4 },
        { code: 'total', caption: 'Total', rowOrder: 5 },
      ],
    },
    {
      id: 4,
      product: 'LPG',
      productCode: 'LPG',
      rowOrder: 4,
      detail: [
        { code: 'gsP1', caption: 'GSP1', rowOrder: 0 },
        { code: 'gsP2', caption: 'GSP2', rowOrder: 1 },
        { code: 'gsP3', caption: 'GSP3', rowOrder: 2 },
        { code: 'gsP5', caption: 'GSP5', rowOrder: 3 },
        { code: 'gsP6', caption: 'GSP6', rowOrder: 4 },
        { code: 'total', caption: 'Total', rowOrder: 5 },
      ],
    },
    {
      id: 5,
      product: 'C2',
      productCode: 'C2',
      rowOrder: 5,
      detail: [
        { code: 'lowcO2', caption: 'Low CO2', rowOrder: 7 },
        { code: 'highcO2', caption: 'High CO2', rowOrder: 8 },
        // { code: 'total', caption: 'Total', rowOrder: 2 },
      ],
    },
    {
      id: 6,
      product: 'GC',
      productCode: 'C2',
      rowOrder: 6,
      detail: [
        { code: 'lowcO2', caption: 'Low CO2', rowOrder: 0 },
        { code: 'highcO2', caption: 'High CO2', rowOrder: 1 },
        { code: 'total', caption: 'Total', rowOrder: 2 },
      ],
    },
  ];

  masterData: any = {};
  listData: any = [];
  dataDayMonth: any = [];
  cellTemplate = 'cellTemplate';
  headerCellTemplate = 'headerCellTemplate';
  year: any = moment().year();
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  formula = '{0} * 24 * {1} / 1000';
  version: any = 1;
  tmpMonth: any = {};
  isHistory = false;

  @Input() maxVersion: any = 0;
  @ViewChild('dataGridList', { static: false })
  dataGridList: DxDataGridComponent;

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = '';
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  dataInfo: any = {};
  refineryCellTemplate = 'refineryCellTemplate';
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  validateResult: any = { isValid: true };
  accessMenu: any;

  constructor(
    private abilityPlanRayong: AbilityPlanRayongService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService
  ) {

    this.loaderService.show();
  }

  ngOnInit(): void {
    if (this.dataGridList && this.dataGridList.instance) {
      setTimeout(() => {
        this.dataGridList.instance.clearSorting();
      }, 200);
    }

    this.accessMenuList();
  }

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      if (res && res.currentMenu) {
        // console.log("res >>>>>>> ", res['currentMenu']);
        console.log("actionMenu > ", res.currentMenu?.actionMenu);
        this.accessMenu = res.currentMenu.actionMenu;
      }
    });
  }

  async onYearChange(
    dynamicColumns: any,
    listMonth: any,
    masterData: any,
    year: any,
    month: any,
    version: any,
    maxVersion: any,
    isHistory: any,
    isImport: any
  ) {
    // this.loaderService.show();
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;

    this.listMonth = [];
    this.dynamicColumns = [];

    this.listMonth = listMonth;
    this.dynamicColumns = dynamicColumns;
    this.masterData = masterData;

    this.retrieveData();

    // let dateStart = moment(this.year + '-' + month + '-01');
    // let monthStart = dateStart.month();
    // let yearStart = dateStart.year();

    // for (let index = 1; index <= 13; index++) {
    //   this.listMonth.push({
    //     Year: yearStart,
    //     Month: monthStart + 1,
    //     MonthName: dateStart.format(this.formatMonthName),
    //   });
    //   dateStart = dateStart.add(1, 'M');
    //   monthStart = dateStart.month();
    //   yearStart = dateStart.year();
    // }

    // console.log('listMonth', this.listMonth);

    // this.dynamicColumns = [];
    // this.dynamicColumns.push({
    //   dataField: 'product',
    //   code: 'product',
    //   caption: 'Product',
    //   groupIndex: 0,
    //   fixed: true,
    //   // width: 180,
    //   fixedPosition: 'left',
    //   allowSorting: false,
    //   cellTemplate: this.refineryCellTemplate,
    // });

    // this.dynamicColumns.push({
    //   dataField: 'productionPlant',
    //   code: 'productionPlant',
    //   caption: 'Production Plant',
    //   // groupIndex: 0,
    //   fixed: true,
    //   // width: 180,
    //   allowSorting: false,
    //   fixedPosition: 'left',
    // });

    // _.each(this.listMonth, (item, index) => {
    //   this.dynamicColumns.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     name: 'formulaM' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     dataType: 'number',
    //     allowSorting: false,
    //     cellTemplate: this.cellTemplate,
    //   });
    // });

    // total
    // this.dynamicColumns.push({
    //   dataField: 'productionPlant',
    //   name: 'productionPlant',
    //   code: 'productionPlant',
    //   caption: 'Total',
    //   dataType: 'number',
    //   // cellTemplate: this.cellTemplate,
    // });

    // _.each(this.listMonth, (item, index) => {
    //   this.dynamicColumns.push({
    //     dataField: 'M' + item.Month + item.Year,
    //     code: index,
    //     caption: item.MonthName,
    //     name: 'formulaM' + item.Month + item.Year,
    //     dataType: 'number',
    //     visible: item.visible,
    //     cellTemplate: this.cellTemplate,
    //     headerCellTemplate: this.headerCellTemplate,
    //     columns: [
    //       {
    //         // {
    //         dataField: 'isCalculateM' + item.Month + item.Year,
    //         code: 'isCalculateM' + item.Month + item.Year,
    //         //isColumn
    //         caption: 'คำนวน',
    //         visible: false,
    //         editTemplateName: 'cellCalEditTemplate',
    //         dataType: 'boolean',
    //         width: 160,
    //       },
    //       {
    //         // {
    //         dataField: 'valMonthM' + item.Month + item.Year,
    //         code: 'valMonthM' + item.Month + item.Year,
    //         name: 'formulaValMonthM' + item.Month + item.Year,
    //         valueName: 'valMonthM' + item.Month + item.Year,
    //         caption: 'ข้อมูล',
    //         visible: false,
    //         dataType: 'number',
    //         width: 80,
    //         editTemplateName: 'cellEditTemplate',
    //         cellTemplate: this.cellTemplate,
    //       },
    //       // , {
    //       //   dataField: 'dayMonthM' + item.Month + item.Year,
    //       //   code: 'dayMonthM' + item.Month + item.Year,
    //       //   name: 'formulaDayMonthM' + item.Month + item.Year,
    //       //   valueName: 'dayMonthM' + item.Month + item.Year,
    //       //   caption: 'วัน',
    //       //   visible: false,
    //       //   dataType: 'number',
    //       //   width: 80,
    //       //   editTemplateName: 'cellEditTemplate',
    //       //   cellTemplate: this.cellTemplate
    //       // }
    //     ],
    //   });
    //   const date = moment(item.Year + '-' + item.Month + '-01');
    //   this.dataDayMonth['dayMonthM' + item.Month + item.Year] =
    //     date.daysInMonth();
    // });

    // this.retrieveMasterData().subscribe((res) => {
    //   this.masterData.abilityPlanRayong = res[0];
    //   // this.masterData.abilityPlanRayongForm = res[1];
    //   this.retrieveData();
    // });

  }

  // retrieveMasterData(): Observable<any> {
  //   const abilityPlanRayong = this.abilityPlanRayong.getList(
  //     this.year,
  //     this.month,
  //     this.version
  //   );

  //   return forkJoin([abilityPlanRayong]);
  // }

  retrieveData(isRetrospective: any = true) {

    // let datas: any = [];

    // if (
    //   this.masterData.abilityPlanRayong &&
    //   this.masterData.abilityPlanRayong.length === 0 &&
    //   isRetrospective === true
    // ) {
    //   this.month = this.month - 1;
    //   //this.version = 0;
    //   this.retrieveMasterData().subscribe((res) => {
    //     this.masterData.abilityPlanRayong = res[0];
    //     this.masterData.abilityPlanRayongForm = res[1];
    //     this.month = this.month + 1;
    //     this.retrieveData(false);
    //   });
    // }

    // _.each(this.productData, (item) => {
    //   let productItem : any = {};
    //   productItem.id = item.id;
    //   productItem.product = item.product;
    //   productItem.rowOrder = item.rowOrder;

    //   let data = _.filter(this.masterData.abilityPlanRayong, (itemProduct) => {
    //     return itemProduct.product === item.product;
    //   });

    //   let dataForm = _.find(this.masterData.abilityPlanRayongForm, (itemProduct) => {
    //     return itemProduct.product === item.product;
    //   });

    //   productItem.isCalculate = dataForm ? dataForm.isCalculate : false ;
    //   productItem.valMonthM = dataForm ? dataForm.value : 0 ;
    //   productItem.dayMonthM = dataForm ? dataForm.dayValue : 0 ;

    //   _.each(this.listMonth, (itemMonth) => {

    //     const dataFormBase = _.find(data, (itemBase) => {
    //       return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
    //     })

    //     const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');
    //     this.dataDayMonth['dayMonthM' +  itemMonth.Month + itemMonth.Year] = date.daysInMonth();
    //     productItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = dataFormBase ? dataFormBase.isCalculate : false ;
    //     productItem['M' +  itemMonth.Month + itemMonth.Year] = dataFormBase ? dataFormBase.value : 0;
    //     productItem['valMonthM' +  itemMonth.Month + itemMonth.Year] = dataFormBase ? dataFormBase.value : 0;
    //     productItem['dayMonthM' +  itemMonth.Month + itemMonth.Year] = dataFormBase ? dataFormBase.dayValue : date.daysInMonth();
    //   });

    //     datas.push(productItem);
    // });

    // this.dataList.data = datas;

    if (this.dataList.data && this.dataList.data.length <= 0) {
      _.each(this.productData, (itemProduct) => {
        let dataProduct: any = {};
        dataProduct.id = itemProduct.id;
        dataProduct.product = itemProduct.product;
        dataProduct.rowOrder = itemProduct.rowOrder;
        dataProduct.productCode = itemProduct.productCode;
        _.each(this.listMonth, (itemMonth) => {
          const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');
          dataProduct['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
          dataProduct['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
        });
      });
    }

    this.calData();
    // console.log(this.dataList);
    // this.loaderService.hide();
  }

  onPaste(event: any, columnIndex: any, row: any, data: any) {
    console.log(event);
    console.log('onPaste', data);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        if (index3 <= 12) {
          let month = this.listMonth[index3].Month;
          let year = this.listMonth[index3].Year;
          data[row + index]['valMonthM' + month + year] = _.trim(i3).replace(
            ',',
            ''
          );
        }
      });
    });

    return false;
  }

  calData() {
    _.each(this.dataList.data, (item, indexs) => {
      _.each(this.listMonth, (itemMonth) => {
        const date = moment(itemMonth.year + '-' + itemMonth.month + '-01');
        if (item['isCalculateM' + itemMonth.Month + itemMonth.Year] === true) {
          let formulaValMonth = _.replace(
            this.formula,
            '{0}',
            item['valMonthM' + itemMonth.Month + itemMonth.Year]
              ? item['valMonthM' + itemMonth.Month + itemMonth.Year]
              : 0
          );
          formulaValMonth = _.replace(
            formulaValMonth,
            '{1}',
            item['dayMonthM' + itemMonth.Month + itemMonth.Year]
              ? item['dayMonthM' + itemMonth.Month + itemMonth.Year]
              : date.daysInMonth()
          );
          item['M' + itemMonth.Month + itemMonth.Year] = eval(formulaValMonth);
          item['dayMonthM' + itemMonth.Month + itemMonth.Year] =
            item['dayMonthM' + itemMonth.Month + itemMonth.Year];
          item['formulaM' + itemMonth.Month + itemMonth.Year] = formulaValMonth;
        } else {
          item['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
          item['dayMonthM' + itemMonth.Month + itemMonth.Year] =
            item['dayMonthM' + itemMonth.Month + itemMonth.Year] ??
            date.daysInMonth();
          item['M' + itemMonth.Month + itemMonth.Year] = item[
            'valMonthM' + itemMonth.Month + itemMonth.Year
          ]
            ? item['valMonthM' + itemMonth.Month + itemMonth.Year]
            : item['M' + itemMonth.Month + itemMonth.Year]
              ? item['M' + itemMonth.Month + itemMonth.Year]
              : 0;
        }
      });
    });
  }

  onEditData($event) {

    this.loaderService.show();
    _.remove(this.dynamicColumns, (item) => {
      return item.code === 'colForm';
    });

    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      this.dynamicColumns.push({
        caption: 'Form Excel',
        code: 'colForm',
        fixed: true,
        fixedPosition: 'left',
        columns: [
          {
            // {
            dataField: 'isCalculate',
            code: 'isCalculate',
            caption: 'คำนวน',
            dataType: 'boolean',
            cellTemplate: 'cellCalEditTemplate',
            width: 160,
          },
          {
            // {
            dataField: 'valMonthM',
            code: 'valMonthM',
            caption: 'ข้อมูล',
            valueName: 'valMonthM',
            dataType: 'number',
            width: 80,
            cellTemplate: 'cellEditTemplate',
          },
          // , {
          //   dataField: 'dayMonthM',
          //   code: 'dayMonthM',
          //   caption: 'วัน',
          //   valueName: 'dayMonthM',
          //   dataType: 'number',
          //   width: 80,
          //   cellTemplate: 'cellEditTemplate'
          // }
          {
            // {
            dataField: 'isAppltAll',
            code: 'isAppltAll',
            caption: 'Apply All',
            cellTemplate: 'cellAppltAllTemplate',
          },
        ],
      });
      _.each(this.dynamicColumns, (item) => {
        if (item.columns) {
          _.each(item.columns, (itemColumns) => {
            if (itemColumns.editTemplateName) {
              itemColumns.cellTemplate = itemColumns.editTemplateName;
            }
            itemColumns.visible = true;
          });
        }
        if (item.editTemplateName) {
          item.cellTemplate = item.editTemplateName;
        }
        if (item.editTemplateName === 'cellCalEditTemplate') {
          item.visible = true;
        }
        if (item.headerCellTemplate === 'headerCellTemplate') {
          item.visible = true;
        }
      });
    } else {
      this.numberBoxReadOnly = true;
      this.calData();
      _.each(this.dynamicColumns, (item) => {
        if (item.columns) {
          _.each(item.columns, (itemColumns) => {
            if (itemColumns.dataType === 'number') {
              itemColumns.cellTemplate = this.cellTemplate;
            } else {
              itemColumns.cellTemplate = undefined;
            }
            itemColumns.visible = false;
          });
        }
        if (item.editTemplateName) {
          if (item.dataType === 'number') {
            item.cellTemplate = this.cellTemplate;
          } else {
            item.cellTemplate = undefined;
          }
          item.visible = false;
        }
      });
    }

    this.loaderService.hide();
  }

  getDataSave(isSaveAss?: boolean) {

    let dataSave: any = {};
    let datalist = [];
    let dataForm = [];

    _.each(this.dataList.data, (itemList) => {

      let data: any = {};
      data.product = itemList['product'];
      data.productCode = itemList['productCode'];
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder']);
      data.version = this.version;

      dataForm.push({
        product: data.product,
        productCode: data.productCode,
        year: data.year,
        month: data.month,
        rowOrder: data.rowOrder,
        isCalculate: itemList['isCalculate'],
        value: itemList['valMonthM'],
        version: data.version,
      });

      _.each(this.listMonth, (itemMonth) => {
        let productData: any = {};
        productData.product = itemList['product'];
        productData.productionPlant = itemList['productionPlant'];
        productData.year = data.year;
        productData.month = _.toNumber(data.month);
        productData.rowOrder = data.rowOrder;
        productData.version = (isSaveAss ? (data.version + 1) : data.version);
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.value = itemList['M' + itemMonth.Month + itemMonth.Year];
        productData.dayValue = itemList['dayMonthM' + itemMonth.Month + itemMonth.Year];
        productData.isCalculate = (itemList['isCalculateM' + itemMonth.Month + itemMonth.Year]);
        datalist.push(productData);
      });
    });

    dataSave.dataList = datalist;
    dataSave.dataForm = dataForm;
    return dataSave;

  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.data[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  getDataVersion0(item: any, itemTemp: any) {
    return item.dataVersion0[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  setData(data: any, isImport: boolean) {
    // console.log('setData ', data);
    // console.log('AbilityRayong ', this.masterData.abilityPlanRayong);

    let dataList = _.cloneDeep(data);
    let dataListBase = this.masterData.abilityPlanRayong;

    if (!dataListBase?.length) {
      setTimeout(() => {
        this.loaderService.hide();
      }, 500);
    }

    _.each(dataList, (itemList, index) => {
      _.each(dataListBase, (itemBase, idx) => {
        if (itemList.product == itemBase.product && itemList.productionPlant == itemBase.productionPlant
        ) {
          // if (dataList[index]['ABL_M' + itemBase.monthValue + itemBase.yearValue] == undefined) {
          if (!isImport) {
            dataList[index]['M' + itemBase.monthValue + itemBase.yearValue] = itemBase.value;
          } else {
            dataList[index]['isPasteM' + itemBase.monthValue + itemBase.yearValue] = true;

          }
          // }
        }

        if (idx === (dataListBase.length - 1)) {
          setTimeout(() => {
            this.loaderService.hide();
          }, 500);
        }
      });
    });

    //let dataList = _.cloneDeep(this.dataList.data);
    // _.each(dataList, (itemList) => {

    //   const itemEthaneExcel = _.find(data.ability, (itx) => {
    //     return itx.product === 'TOTAL (Ethane)'
    //   })

    //   const itemPropaneExcel = _.find(data.ability, (itx) => {
    //     return itx.product === 'TOTAL(Propane&Butane&LPG)'
    //   })

    //   const itemNglExcel = _.find(data.ability, (itx) => {
    //     return itx.product === 'TOTAL (NGL)'
    //   })

    //   _.each(this.listMonth, (itemMonth, index) => {
    //     let monthIndex = index + 1;
    //     if (itemList['product'] == 'Ethane (KTON)' && itemEthaneExcel) {
    //       itemList['M' + itemMonth.Month + itemMonth.Year] = itemEthaneExcel['m'+monthIndex];
    //       itemList['valMonthM' + itemMonth.Month + itemMonth.Year] = itemEthaneExcel['m'+monthIndex];

    //     }
    //     else if (itemList['product'] == 'Propane, Butane & LPG(KTON)' && itemPropaneExcel) {
    //       itemList['M' + itemMonth.Month + itemMonth.Year] = itemPropaneExcel['m'+monthIndex];
    //       itemList['valMonthM' + itemMonth.Month + itemMonth.Year] = itemPropaneExcel['m'+monthIndex];

    //     }
    //     else if (itemList['product'] == 'NGL(KM3)' && itemNglExcel) {
    //       itemList['M' + itemMonth.Month + itemMonth.Year] = itemNglExcel['m'+monthIndex];
    //       itemList['valMonthM' + itemMonth.Month + itemMonth.Year] = itemNglExcel['m'+monthIndex];

    //     }
    //   });
    // });

    // console.log('setData => ', dataList);
    this.dataList.data = _.orderBy(_.cloneDeep(dataList), ['product'], ['asc']);
    this.gridRefresh();
    // this.loaderService.hide();
  }

  sumOfNewData(data: any) {
    // const dateNow = new Date(data.monthNow[0].createDate);
    // this.onYearChange(
    //   dateNow.getFullYear(),
    //   dateNow.getMonth(),
    //   this.version,
    //   0,
    //   0
    // );

    let dataList = [];

    _.each(this.productData, (item) => {
      //console.log('filterProduct => ' + item.product, filterProductP1);

      _.each(item.detail, (detail, index) => {
        //console.log('sum => ' + detail.caption, this.sumOject(detail.code, filterProductP1));

        let listAllSum: any = {};
        listAllSum.id = Math.random;
        listAllSum.product = item.product == 'Ethane' ? 'C2' : item.product;
        listAllSum.unit = detail.caption;
        listAllSum.rowOrder = detail.rowOrder;
        listAllSum.pdrowOrder = item.rowOrder;

        let itemMonth = {};

        // for (let i = 0; i < 12; i++) {
        //   itemMonth['M' + dateNow.getMonth() + dateNow.getFullYear] =
        //     this.sumOject(detail.code, this.getDataP(index + 1, data, item));
        // }

        _.each(this.listMonth, (itMonth, index) => {
          itemMonth['M' + itMonth.Month + itMonth.Year] = this.sumOject(
            detail.code,
            this.getDataP(index + 1, data, item)
          );
        });

        listAllSum = _.merge(listAllSum, itemMonth);

        dataList.push(listAllSum);
      });
    });

    // console.log('datalist --> ', dataList);
    return _.orderBy(dataList, ['rowOrder'], ['asc']);
  }

  getDataP(value, data, item) {
    switch (value) {
      case 1: {
        let filterProductP1 = _.filter(_.cloneDeep(data.p1), {
          product: item.product,
        });

        return filterProductP1;
      }
      case 2: {
        let filterProductP2 = _.filter(_.cloneDeep(data.p2), {
          product: item.product,
        });

        return filterProductP2;
      }
      case 3: {
        let filterProductP3 = _.filter(_.cloneDeep(data.p3), {
          product: item.product,
        });

        return filterProductP3;
      }
      case 4: {
        let filterProductP4 = _.filter(_.cloneDeep(data.p4), {
          product: item.product,
        });

        return filterProductP4;
      }
      case 5: {
        let filterProductP5 = _.filter(_.cloneDeep(data.p5), {
          product: item.product,
        });

        return filterProductP5;
      }
      case 6: {
        let filterProductP6 = _.filter(_.cloneDeep(data.p6), {
          product: item.product,
        });

        return filterProductP6;
      }
      case 7: {
        let filterProductP7 = _.filter(_.cloneDeep(data.p7), {
          product: item.product,
        });

        return filterProductP7;
      }
      case 8: {
        let filterProductP8 = _.filter(_.cloneDeep(data.p8), {
          product: item.product,
        });

        return filterProductP8;
      }
      case 9: {
        let filterProductP9 = _.filter(_.cloneDeep(data.p9), {
          product: item.product,
        });

        return filterProductP9;
      }
      case 10: {
        let filterProductP10 = _.filter(_.cloneDeep(data.p10), {
          product: item.product,
        });

        return filterProductP10;
      }
      case 11: {
        let filterProductP11 = _.filter(_.cloneDeep(data.p11), {
          product: item.product,
        });

        return filterProductP11;
      }
      case 12: {
        let filterProductP12 = _.filter(_.cloneDeep(data.p12), {
          product: item.product,
        });

        return filterProductP12;
      }
    }
  }

  sumOject(objKey, obj) {
    var sum = 0;
    for (var el in obj) {
      for (var key in obj[el]) {
        if (key == objKey) {
          sum += parseFloat(obj[el][key]);
        }
      }
    }
    return sum;
  }

  onAppltAll(event, data) {
    _.each(this.listMonth, (item) => {
      const date = moment(item.year + '-' + item.month + '-01');
      data['isCalculateM' + item.Month + item.Year] = data.isCalculate;
      data['valMonthM' + item.Month + item.Year] = data.valMonthM;
      data['M' + item.Month + item.Year] = data.valMonthM;
    });
  }

  onValueChanged(e, column: any) {
    this.dataDayMonth['dayMonthM' + column] = e.value;

    _.each(this.dataList.data, (item) => {
      item['dayMonth' + column] = e.value;
    });
  }

  itemClick(
    $event,
    data: any,
    row: any,
    columnIndex: any,
    field: any,
    isFrom: boolean
  ) {
    console.log('itemClick -> data', data);
    console.log("row :: ", row);
    const title = 'Ability Plan (Rayong)';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.isFrom = isFrom;
    this.dataInfoEditColumn.field = field;
    this.dataInfoEditColumn.product = data.product;

    if ($event.itemData.text === 'Edit') {
      this.dataInfo = data;
      if (isFrom) {
        this.dataInfoEditColumn.title = `${title} : All`;
      } else {
        month = this.listMonth[columnIndex].Month;
        year = this.listMonth[columnIndex].Year;
        this.dataInfoEditColumn.title = `${title} : ${data.product},${data.productionPlant} ${month}/${year}`;
      }
      this.popupVisible = true;
    } else if ($event.itemData.text === 'Paste') {
      // console.log("$event :: ", $event);

      if (this.accessMenu !== 1) {
        Swal.fire({
          title: 'Access Denied',
          text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
        });

        return false;
      }

      navigator.clipboard
        .readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningIndex = columnIndex;
            let iMinus = 1;

            switch (data.product) {
              case 'C3':
                iMinus = 2
                break;
              case 'C3/LPG':
                iMinus = 3
                break;
              case 'LPG':
                iMinus = 4
                break;
              case 'NGL':
                iMinus = 5
                break;
            }

            // console.log("runningIndex  >> ", runningIndex);
            // console.log("index >> ", index);
            // console.log("this.dataList :: ", this.dataList.data);
            // console.log("this.dataList.data[row + index - 1] >> ", this.dataList.data[row + index - iMinus]);
            // console.log("row + index - iMinus >> ", row + index - iMinus);

            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                if (runningIndex <= 12) {
                  if (this.dataList.data[row + index - iMinus]['productionPlant'] != 'Total') {
                    let month = this.listMonth[runningIndex].Month;
                    let year = this.listMonth[runningIndex].Year;
                    this.dataList.data[row + index - iMinus]['valMonthM' + month + year] = dataText;
                    this.dataList.data[row + index - iMinus]['M' + month + year] = dataText;
                    this.dataList.data[row + index - iMinus]['isPasteM' + month + year] = true;
                    runningIndex++;
                    this.calData;
                    this.gridRefresh();
                  }
                  else {
                    return false;
                  }
                }
              } else {
                Swal.fire({
                  title: 'ไม่สารถนำข้อมูลมาแสดงเพิ่ม',
                  text: 'เนื่องจากข้อมูลที่ Copy มาไม่เป็นตัวเลข',
                  icon: 'error',
                  showConfirmButton: true,
                  confirmButtonText: 'ปิด'
                })
                return false;
              }

            });


            if (index == (pastedText.split('\r\n').length - 1)) {
              setTimeout(() => {
                this.calTotalAfterPasteData();
                this.gridRefresh();
              }, 100);
            }

          });
        })
        .catch((err) => {
          // alert("Please allow clipboard access permission");
        });

      //this.dataInfo = data;
      //this.dataList.data[this.rowEdit] = this.dataInfo;
    }
  }

  calTotalAfterPasteData() {
    const filterProduct = _.filter(_.cloneDeep(this.dataList.data), (x) => {
      return x.product == this.dataInfoEditColumn.product && x.productionPlant != 'Total' && x.productionPlant != 'Low CO2' && x.productionPlant != 'High CO2'
        && x.productionPlant != 'LPG-Petro' && x.productionPlant != 'LPG-Domestic'
    });
    // console.log("filterProduct >> ", filterProduct);
    // console.log("this.dataInfoEditColumn.field >> ", this.dataInfoEditColumn.field);
    // console.log("this.listMonth >> ", this.listMonth);
    if (filterProduct.length) {
      _.each(this.listMonth, (x) => {
        let output = _.sumBy(filterProduct, 'M' + x['Month'] + x['Year']);
        const findTotal = _.find(this.dataList.data, { product: this.dataInfoEditColumn.product, productionPlant: 'Total' });
        findTotal['M' + x['Month'] + x['Year']] = output;
      })
    }
  }

  calAfterEditPopupValue() {
    // console.log("this.dataInfoEditColumn :: ", this.dataInfoEditColumn);
    const filterProduct = _.filter(_.cloneDeep(this.dataList.data), (x) => {
      return x.product == this.dataInfoEditColumn.product && x.productionPlant != 'Total' && x.productionPlant != 'Low CO2' && x.productionPlant != 'High CO2'
        && x.productionPlant != 'LPG-Petro' && x.productionPlant != 'LPG-Domestic'
    });

    if (filterProduct.length) {
      // console.log("filterProduct ::: ", filterProduct);
      let output = _.sumBy(filterProduct, this.dataInfoEditColumn.field);
      // console.log("output ::: ", output);
      const findTotal = _.find(this.dataList.data, { product: this.dataInfoEditColumn.product, productionPlant: 'Total' });
      findTotal[this.dataInfoEditColumn.field] = output;
    }
  }

  popupSaveClick = () => {
    // console.log("dataList.data :: ", this.dataList.data);
    this.calAfterEditPopupValue();
    // console.log("dataInfo :: ", this.dataInfo);
    // console.log("dataInfoEditColumn :: ", this.dataInfoEditColumn);
    // console.log("dataInfoOld :: ", this.dataInfoOld);
    // console.log("hello >> ", this.dataInfoOld[this.dataInfoEditColumn['field']]);

    if (this.dataInfo[this.dataInfoEditColumn['field']] !== this.dataInfoOld[this.dataInfoEditColumn['field']]) {
      this.dataInfo['isPaste' + this.dataInfoEditColumn['field']] = true;
      this.gridRefresh();
    }

    this.popupVisible = false;
  };

  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  };

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.data.productionPlant !== 'Total' && e.data.product !== 'C2') {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }

    if (
      e.rowType === 'data' &&
      e.data &&
      e.data["isPaste" + e.column.dataField] === true
    ) {
      e.cellElement.classList.add('backgroundColorPaste');
    }

    // if (e.rowType === 'data' && e.data) {
    //   _.each(this.listMonth, it => {
    //     // && e.data.product == 'C3/LPG' && e.data.productionPlant == 'GSP2'
    //     if (e.data['ABL_M' + it.Month + it.Year] != undefined) {
    //       let dataCal = e.data['M' + it.Month + it.Year];
    //       let dataAbilityImport = e.data['ABL_M' + it.Month + it.Year];
    //       if (dataCal != dataAbilityImport && e.columnIndex > 1) {
    //         // console.log("dataCal :: ",dataCal);
    //         // console.log("dataAbilityImport :: ",dataAbilityImport);
    //         e.cellElement.classList.add('backgroundColorPaste');
    //       }
    //       else {
    //         e.cellElement.classList.remove('backgroundColorPaste');
    //       }
    //     }
    //   });
    // }
  }

  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data.productionPlant == 'Total') {
      e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#ECEFF1';
    }
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  gridRefresh() {
    if (this.dataGridList && this.dataGridList.instance) {
      setTimeout(() => {
        this.dataGridList.instance.refresh();
      }, 200);
    }
  }
}
