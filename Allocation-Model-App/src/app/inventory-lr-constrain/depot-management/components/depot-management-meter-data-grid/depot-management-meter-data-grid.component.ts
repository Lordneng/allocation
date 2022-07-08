import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { DepotManagementMeterService } from 'src/app/service/depot-management.service';
import { MasterUnitService } from 'src/app/service/master-unit.service';
import { MasterDepotService } from 'src/app/service/master-depot.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-depot-management-meter-data-grid',
  templateUrl: './depot-management-meter-data-grid.component.html',
  styleUrls: ['./depot-management-meter-data-grid.component.css'],
})
export class DepotManagementMeterDataGridComponent implements OnInit {
  dataList: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };

  @Input() get DataInfo() {
    return this.dataInfo;
  }
  set DataInfo(val) {
    this.dataInfo = val;
  }
  listMonth: any = [];
  listMonthColumn: any = [];
  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;

  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;
  dynamicColumns: any[] = [];
  dynamicColumnsVisible: any[] = [];
  dynamicColumnsSelected: any[] = [];

  settingData: any = [
    {
      name: 'per hour',
      cal: false,
    },
    {
      name: 'per month',
      cal: true,
    },
  ];

  calculateSetting: any = [
    {
      name: 'KT/Day.',
      cal: 'day'
    },
    {
      name: 'KT/Month.',
      cal: 'month'
    }
  ];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  cellUnitTemplate = 'cellUnitTemplate';
  depotCellTemplate = 'depotCellTemplate';
  year: any = 2021;
  popupHeight: number = 550;
  maxLength: any = 31;
  popupVisible = false;
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  isHistory = false;
  accessMenu: any;

  @Input() maxVersion: any = 0;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dataGridMeterList', { static: false }) dataGridMeterList: DxDataGridComponent;
  // formula = '{0} * 24 * {1} / 1000';
  formula = '{0} * {1}';

  @Output() onSetDataInfo = new EventEmitter();
  constructor(
    private depotManagementMeterService: DepotManagementMeterService,
    private masterUnitService: MasterUnitService,
    private masterDepotService: MasterDepotService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.year = moment().format('yyyy');
    this.month = moment().format('MM');
  }

  ngOnInit(): void {
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

  onYearChange(year: any, month: any, version: any, maxVersion: any, isHistory: any) {
    // this.loaderService.show();
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;
    this.listMonth = [];
    this.listMonthColumn = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName), visible: true }

      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }
    this.dynamicColumns = [];
    // this.dynamicColumns.push({
    //   dataField: 'rowOrder',
    //   code: 'rowOrder',
    //   caption: '#',
    //   width: 25,
    //   alignment: 'center',
    //   fixed: true,
    //   fixedPosition: 'left'
    // })
    this.dynamicColumns.push({
      // {
      dataField: 'depot',
      code: 'depot',
      caption: 'Depot',
      fixed: true,
      fixedPosition: 'left',
      cellTemplate: this.depotCellTemplate
    }, {
      dataField: 'unit',
      code: 'unit',
      caption: 'Unit',
      visible: true,
      fixed: true,
      fixedPosition: 'left',
      cellTemplate: this.cellUnitTemplate
    }
    );
    let columnMonthIndex = 0;
    _.each(this.listMonth, (item, index) => {

      let dataColumnMonthMin: any = {}
      dataColumnMonthMin.index = columnMonthIndex;
      dataColumnMonthMin.year = item.Year;
      dataColumnMonthMin.month = item.Month;
      dataColumnMonthMin.field = 'minM' + item.Month + item.Year;

      this.listMonthColumn.push(dataColumnMonthMin);

      columnMonthIndex++;
      let dataColumnMonthMax: any = {}
      dataColumnMonthMax.index = columnMonthIndex;
      dataColumnMonthMax.year = item.Year;
      dataColumnMonthMax.month = item.Month;
      dataColumnMonthMax.field = 'maxM' + item.Month + item.Year;

      this.listMonthColumn.push(dataColumnMonthMax);
      columnMonthIndex++;

      this.dynamicColumns.push({
        caption: item.MonthName,
        visible: item.visible,
        dataField: 'M' + item.Month + item.Year,
        columns: [
          {
            // {
            dataField: 'displayMinM' + item.Month + item.Year,
            code: dataColumnMonthMin.index,
            name: 'formulaMinM' + item.Month + item.Year,
            caption: 'Min',
            dataType: 'number',
            width: 80,
            cellTemplate: this.cellTemplate,
          },
          {
            // {
            dataField: 'displayMaxM' + item.Month + item.Year,
            code: dataColumnMonthMax.index,
            name: 'formulaMaxM' + item.Month + item.Year,
            caption: 'Max',
            dataType: 'number',
            width: 80,
            cellTemplate: this.cellTemplate,
          },
        ],
      });
    });

    console.log(this.listMonthColumn);
    this.retrieveMasterData().subscribe((res) => {
      this.masterData.DepotManagementKt = res[0];
      this.masterData.DepotManagementKtForm = res[1];
      this.masterData.masterDepots = res[2];
      this.masterData.masterUnit = res[3];
      this.retrieveData();
    });
    //this.isHistory

    // if (true) {//ดึงจาก History อย่างเดวก่อน
    //   this.retrieveMasterDataHistory().subscribe((res) => {
    //     this.masterData.DepotManagementKt = res[0];
    //     this.masterData.DepotManagementKtForm = res[1];
    //     this.masterData.masterDepots = res[2];
    //     this.masterData.masterUnit = res[3];
    //     this.retrieveData();
    //   });
    // } else {
    //   this.retrieveMasterData().subscribe((res) => {
    //     this.masterData.DepotManagementKt = res[0];
    //     this.masterData.DepotManagementKtForm = res[1];
    //     this.masterData.masterDepots = res[2];
    //     this.masterData.masterUnit = res[3];
    //     this.retrieveData();
    //   });
    // }
  }

  retrieveMasterData(): Observable<any> {
    const DepotManagementKt = this.depotManagementMeterService.getList(this.year, this.month);
    const DepotManagementKtForm = this.depotManagementMeterService.getForm(this.year, this.month, this.version);
    const masterDepots = this.masterDepotService.getActiveList();
    const masterUnit = this.masterUnitService.getList();
    return forkJoin([DepotManagementKt, DepotManagementKtForm, masterDepots, masterUnit]);
  }

  retrieveMasterDataHistory(): Observable<any> {
    const DepotManagementKt = this.depotManagementMeterService.getListHistory(this.year, this.month, this.version);
    const DepotManagementKtForm = this.depotManagementMeterService.getFormHistory(this.year, this.month, this.version);
    const masterDepots = this.masterDepotService.getActiveList();
    const masterUnit = this.masterUnitService.getList();
    return forkJoin([DepotManagementKt, DepotManagementKtForm, masterDepots, masterUnit]);
  }

  retrieveData() {
    let datas: any = [];
    // if (this.masterData.DepotManagementKtForm) {
    //   this.dataList = _.cloneDeep(this.masterData.DepotManagementKtForm);
    //   _.each(this.dataList, (item) => {
    //     const data = _.filter(this.masterData.DepotManagementKt, (itemData) => {
    //       return (
    //         itemData.product === item.product &&
    //         itemData.unit === item.unit &&
    //         itemData.source === item.source &&
    //         itemData.demand === item.demand
    //       );
    //     });

    //     _.each(this.listMonth, (itemMonth) => {
    //       const dataFormBase = _.find(data, (itemBase) => {
    //         return (
    //           itemBase.month === itemMonth.month &&
    //           itemBase.year === itemMonth.year
    //         );
    //       });
    //       item['isCalculateM' + itemMonth.month] = dataFormBase
    //         ? dataFormBase.isCalculate
    //         : item.isCalculate;
    //       item['minM' + itemMonth.month] = dataFormBase
    //         ? dataFormBase.min
    //         : item.min;
    //       item['maxM' + itemMonth.month] = dataFormBase
    //         ? dataFormBase.max
    //         : item.max;
    //     });

    //     this.calData();
    //   });
    // }

    _.each(this.masterData.masterDepots, (item, index) => {

      let depotItem: any = {};
      depotItem.id = index;
      depotItem.depotId = item.id
      depotItem.depot = item.name;
      depotItem.unit = 'KT/Month'
      depotItem.rowOrder = item.rowOrder;
      depotItem.modelId = item.modelId;
      depotItem.product = item.product;
      let data = _.filter(this.masterData.DepotManagementKt, (itemDepot) => {
        return itemDepot.depotId === item.id;
      });

      let dataForm = _.find(this.masterData.DepotManagementKt, (itemDepot) => {
        return itemDepot.depot === item.name;
      });

      depotItem.isCalculate = dataForm && dataForm.unitCode === 'Depot-Month' ?
        'month' : dataForm && dataForm.unitCode === 'Depot-Day' ? 'day' : 'day';
      depotItem.minM = dataForm ? dataForm.min : 0;
      depotItem.maxM = dataForm ? dataForm.max : 0;
      depotItem.dayMonthM = dataForm ? dataForm.dayValue : 0;
      depotItem.isAll = dataForm ? dataForm.isAll : true;

      _.each(this.listMonth, (itemMonth) => {

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
        })
        const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');

        if (dataFormBase) {
          depotItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = dataFormBase.unitCode === 'Depot-Day' ?
            'day' : dataFormBase.unitCode === 'Depot-Month' ? 'month' : 'month';
          depotItem['displayMinM' + itemMonth.Month + itemMonth.Year] = dataFormBase.min;
          depotItem['minM' + itemMonth.Month + itemMonth.Year] = dataFormBase.min;
          depotItem['displayMaxM' + itemMonth.Month + itemMonth.Year] = dataFormBase.max;
          depotItem['maxM' + itemMonth.Month + itemMonth.Year] = dataFormBase.max;
          depotItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = dataFormBase.dayValue;
          depotItem['RemarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
        } else {
          //his.dataDayMonth['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
          depotItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = 'month';
          depotItem['displayMinM' + itemMonth.Month + itemMonth.Year] = 0;
          depotItem['minM' + itemMonth.Month + itemMonth.Year] = 0;
          depotItem['displayMaxM' + itemMonth.Month + itemMonth.Year] = 0;
          depotItem['maxM' + itemMonth.Month + itemMonth.Year] = 0;
          depotItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
          depotItem['RemarkM' + itemMonth.Month + itemMonth.Year] = null;
        }
      });

      datas.push(depotItem);

    });

    this.dataList.data = datas;
    this.calData();
    console.log(this.dataList.data)
    this.loaderService.hide();
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log('chk1', event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        data[row + index]['M' + (month + index3)] = _.trim(i3).replace(',', '');
      });
    });

    return false;
  }

  calData() {
    _.each(this.dataList.data, (item, indexs) => {
      item.id = indexs;
      _.each(this.listMonth, (itemMonth) => {
        if (item['isCalculateM' + itemMonth.Month + itemMonth.Year] === 'day') {
          let formulaMin = _.replace(
            this.formula,
            '{0}',
            item['minM' + itemMonth.Month + itemMonth.Year] ? item['minM' + itemMonth.Month + itemMonth.Year] : 0
          );
          formulaMin = _.replace(formulaMin, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year]);
          let formulaMax = _.replace(
            this.formula,
            '{0}',
            item['maxM' + itemMonth.Month + itemMonth.Year] ? item['maxM' + itemMonth.Month + itemMonth.Year] : 0
          );
          formulaMax = _.replace(formulaMax, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year]);
          item['displayMinM' + itemMonth.Month + itemMonth.Year] = eval(formulaMin);
          item['formulaMinM' + itemMonth.Month + itemMonth.Year] = formulaMin;
          item['displayMaxM' + itemMonth.Month + itemMonth.Year] = eval(formulaMax);
          item['formulaMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax;
        } else {
          item['isCalculateM' + itemMonth.Month + itemMonth.Year] = 'month';
          item['displayMinM' + itemMonth.Month + itemMonth.Year] = item['minM' + itemMonth.Month + itemMonth.Year];
          item['displayMaxM' + itemMonth.Month + itemMonth.Year] = item['maxM' + itemMonth.Month + itemMonth.Year];
        }
      });
    });
  }

  stateGrid() {
    if (this.dataGridMeterList && this.dataGridMeterList.instance) {
      setTimeout(() => {
        this.dataGridMeterList.instance.state(null);
      }, 200);
    }
  }

  getDataSave() {
    let dataSave: any = {};
    let datalist = [];
    let dataForm = [];
    console.log(this.dataList.data)
    _.each(this.dataList.data, (itemList) => {

      let data: any = {};
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder'])
      data.version = this.version;
      data.depot = itemList['depot'];
      data.depotId = itemList['depotId']
      data.modelId = itemList.modelId;
      data.product = itemList.product;
      let form: any = {}
      form.year = data.year;
      form.month = data.month;
      form.rowOrder = data.rowOrder;
      form.min = itemList['minM'];
      form.max = itemList['maxM'];
      form.depot = itemList['depot'];
      form.depotId = itemList['depotId']
      form.version = data.version
      form.isAll = itemList['isAll'];
      form.modelId = itemList.modelId;
      form.product = itemList.product;

      let unit: any = {};

      if (itemList['isCalculate'] === 'month') {
        unit = _.find(this.masterData.masterUnit, (data) => {
          return data.code === 'Depot-Month';
        });
      } else {
        unit = _.find(this.masterData.masterUnit, (data) => {
          return data.code === 'Depot-Day';
        });
      }

      form.unitId = unit.id;
      form.unitCode = unit.code;

      dataForm.push(form);

      _.each(this.listMonth, (itemMonth) => {
        let unitDepot: any = {};

        if (itemList['isCalculateM' + itemMonth.Month + itemMonth.Year] === 'month') {
          unitDepot = _.find(this.masterData.masterUnit, (data) => {
            return data.code === 'Depot-Month';
          });
        } else {
          unitDepot = _.find(this.masterData.masterUnit, (data) => {
            return data.code === 'Depot-Day';
          });
        }

        let depotData: any = {}
        depotData.depot = data.depot;
        depotData.depotId = data.depotId;
        depotData.unitId = unitDepot.id;
        depotData.unitCode = unitDepot.code;
        depotData.year = data.year;
        depotData.month = data.month;
        depotData.rowOrder = data.rowOrder
        depotData.version = data.version;
        depotData.monthValue = itemMonth.Month;
        depotData.yearValue = itemMonth.Year;
        depotData.modelId = data.modelId;
        depotData.product = data.product;
        depotData.min = itemList["minM" + itemMonth.Month + itemMonth.Year];
        depotData.max = itemList["maxM" + itemMonth.Month + itemMonth.Year];
        depotData.dayValue = itemList["dayMonthM" + itemMonth.Month + itemMonth.Year];
        depotData.remark = itemList["RemarkM" + itemMonth.Month + itemMonth.Year];
        datalist.push(depotData);
      })

    })

    dataSave.dataList = datalist;
    dataSave.dataForm = dataForm;
    return dataSave;
  }

  getDataMaxVersion(item: any, itemTemp: any) {
    return item.dataListMaxVersion[itemTemp.rowIndex][
      itemTemp.column.dataField
    ];
  }

  onAppltAll(data) {
    console.log('datalist', this.dataList);
    _.each(this.listMonth, (itemMonth) => {
      data['isCalculateM' + itemMonth.Month + itemMonth.Year] = data.isCalculate;
      data['isEditdisplayMinM' + itemMonth.Month + itemMonth.Year] = true;
      data['isEditdisplayMaxM' + itemMonth.Month + itemMonth.Year] = true;
      data['minM' + itemMonth.Month + itemMonth.Year] = data.minM;
      data['maxM' + itemMonth.Month + itemMonth.Year] = data.maxM;
    });
  }

  setData(data: any) {
    console.log('data', data);
    // this.dataList = [{ "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE1", "Delivery point": "GSP RY", "min": "0", "max": "50" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE2", "Delivery point": "GSP RY", "min": "", "max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (Vol >274T/Hr)", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (SPOT) GSP5", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (Hybrid) supplement C2", "Delivery point": "GSP RY", "Min": "", "Max": "" }, {
    //   "product": "C2", "unit": "KT", "source": "GSP RY"
    //   , "demand": "C2 - SCG", "Delivery point": "GSP RY", "min": "", "max": "16.2", "isCalculate": true
    // }];
    this.dataList = data;
    _.each(this.dataList, (item, indexs) => {
      item.id = indexs;
      item.isApplyAll = false;
      _.each(this.listMonth, (itemMonth) => {
        item['minM' + itemMonth.month] = item.min;
        item['maxM' + itemMonth.month] = item.max;
        if (item.isCalculate) {
          const date = moment(itemMonth.year + '-' + itemMonth.month + '-01');
          item['isCalculateM' + itemMonth.month] = item.isCalculate;
          let formulaMin = _.replace(
            this.formula,
            '{0}',
            item['minM' + itemMonth.month] ? item['minM' + itemMonth.month] : 0
          );
          formulaMin = _.replace(formulaMin, '{1}', date.daysInMonth());
          let formulaMax = _.replace(
            this.formula,
            '{0}',
            item['maxM' + itemMonth.month] ? item['maxM' + itemMonth.month] : 0
          );
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth());
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth());
          item['minDisplayM' + itemMonth.month] = eval(formulaMin);
          item['formulaMinM' + itemMonth.month] = formulaMin;
          item['maxDisplayM' + itemMonth.month] = eval(formulaMax);
          item['formulaMaxM' + itemMonth.month] = formulaMax;
        } else {
          item.isCalculate = false;
          item['isCalculateM' + itemMonth.month] = item.isCalculate;
          item['minDisplayM' + itemMonth.month] = item.min;
          item['maxDisplayM' + itemMonth.month] = item.max;
        }
      });
    });

    this.stateGrid();
    this.loaderService.hide();
  }

  gridRefresh() {
    setTimeout(() => {
      if (this.dataGridMeterList && this.dataGridMeterList.instance) {
        this.dataGridMeterList.instance.state(null);
      }
    }, 100);
  }

  // onVisibleValueChange(event, item) {
  //   console.log('', 1)
  //   if (event.previousValue === true || event.previousValue === false) {
  //     if (this.dataGridMeterList && this.dataGridMeterList.instance) {
  //       this.dataGridMeterList.instance.columnOption(item.dataField, 'visible', event.value);
  //     }
  //   }
  // }

  onVisibleValueChange(event) {
    console.log('event', event);
    if (event.value && event.value.length > 0) {
      if (this.dataGridMeterList && this.dataGridMeterList.instance) {
        _.each(this.listMonth, (item) => {
          this.dataGridMeterList.instance.columnOption(
            'M' + item.month,
            'visible',
            false
          );
        });
        _.each(event.value, (item) => {
          this.dataGridMeterList.instance.columnOption(item, 'visible', true);
        });
      }
    } else if (event.value && event.value.length === 0) {
      if (this.dataGridMeterList && this.dataGridMeterList.instance) {
        _.each(this.listMonth, (item) => {
          this.dataGridMeterList.instance.columnOption(
            'M' + item.month,
            'visible',
            true
          );
        });
      }
    }
  }

  onCellPrepared(e) {
    if (e.rowType === "data") {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 2)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }

    if (e.rowType === "data" && e.data && e.data["isEdit" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorEdit');
    }
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  onSubmit() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        // this.dataList.data[this.rowEdit] = this.dataInfo;
        if (this.dataInfoEditColumn.isFrom && this.dataInfo.isAll) {
          this.onAppltAll(this.dataList.data[this.rowEdit])
        }

        if (this.dataInfoOld['minM'] !== this.dataInfo['minM']) {
          this.dataList.data[this.rowEdit]['isEditdisplayMinM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['maxM'] !== this.dataInfo['maxM']) {
          this.dataList.data[this.rowEdit]['isEditdisplayMaxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['isCalculate'] !== this.dataInfo['isCalculate']) {
          this.dataList.data[this.rowEdit]['isEditdisplayMinM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
          this.dataList.data[this.rowEdit]['isEditdisplayMaxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['minM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['minM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditdisplayMinM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['maxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['maxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditdisplayMaxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['isCalculateM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['isCalculateM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditdisplayMinM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
          this.dataList.data[this.rowEdit]['isEditdisplayMaxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataInfoOld['dayMonthM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['dayMonthM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditdisplayMinM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
          this.dataList.data[this.rowEdit]['isEditdisplayMaxM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }


        this.calData();
        console.log(this.dataList.data)
        this.popupVisible = false;

        if (this.dataGridMeterList && this.dataGridMeterList.instance) {
          this.dataGridMeterList.instance.refresh()
        }
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  onCancel() {
    // this.dataList.data[this.rowEdit] = _.clone(this.dataInfoOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }

  itemClick($event, data: any, row: any, columnIndex: any, field: any, isFrom: boolean, item: any) {
    console.log('itemClick -> data', data)
    console.log('row', row)
    console.log('columnIndex', columnIndex)
    const title = 'Setting Depot Constrain';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.isFrom = isFrom;
    this.dataInfoEditColumn.field = field;

    if ($event.itemData.text === 'Edit') {
      if (isFrom) {
        this.dataInfoEditColumn.title = `${title} : All`;
        this.popupHeight = 400;
        this.dataInfoEditColumn.type = 'all'
      } else {
        this.popupHeight = 550;
        month = this.listMonthColumn[columnIndex].month;
        year = this.listMonthColumn[columnIndex].year;
        this.dataInfoEditColumn.title = `${title} : ${month}/${year}`;
        this.maxLength = moment(year + '-' + month + '-01').daysInMonth();
        this.dataInfoEditColumn.month = month;
        this.dataInfoEditColumn.year = year;

        if (field.includes('Max')) {
          this.dataInfoEditColumn.type = 'max';
        } else {
          this.dataInfoEditColumn.type = 'min';
        }
      }

      setTimeout(() => {
        this.dataInfo = data;
        this.popupVisible = true;
      }, 50);

    } else if ($event.itemData.text === 'Paste') {

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

      navigator.clipboard.readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningIndex = columnIndex;
            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                if (runningIndex <= 23) {
                  console.log('row', row)
                  console.log('runningIndex', runningIndex)
                  let field = this.listMonthColumn[runningIndex].field;
                  this.dataList.data[row + index][field] = dataText;
                  this.dataList.data[row + index]['isPasteM' + runningIndex] = true;
                  runningIndex++;
                  this.calData();
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
          });
        })
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });

      this.dataInfo = data;
      // this.dataList.data[this.rowEdit] = this.dataInfo;
    }
  }

  onEditModal() {
    this.popupVisible = false;
  }

  valMonthValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  valMinValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  valMaxValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  isCalculateValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }
}
