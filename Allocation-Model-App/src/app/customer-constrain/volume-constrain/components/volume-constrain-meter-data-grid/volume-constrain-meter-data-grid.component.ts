import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { VolumeConstrainMeterService } from 'src/app/service/volume-constrain-meter.service';

@Component({
  selector: 'app-volume-constrain-meter-data-grid',
  templateUrl: './volume-constrain-meter-data-grid.component.html',
  styleUrls: ['./volume-constrain-meter-data-grid.component.css']
})
export class VolumeConstrainMeterDataGridComponent implements OnInit {

  dataList: any = [];
  dataInfo: any = {};
  @Input() get DataInfo() {
    return this.dataInfo;
  }
  set DataInfo(val) {
    this.dataInfo = val;
  }
  listMonth: any = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  numberBoxDigi = 0;

  dynamicColumns: any[] = [];

  dynamicColumnsVisible: any[] = [];
  dynamicColumnsSelected: any[] = [];

  settingData: any = [{
    name: 'month.',
    cal: false
  },
  {
    name: 'hr.',
    cal: true
  }
  ];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = 2021;
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  isHistory = false;
  @Input() maxVersion: any = 0;
  @ViewChild('dataGridMeterList', { static: false }) dataGridMeterList: DxDataGridComponent;
  formula = '{0} * 24 * {1} / 1000';

  @Output() onSetDataInfo = new EventEmitter();
  constructor(
    private volumeConstrainMeterService: VolumeConstrainMeterService,
    private loaderService: NgxSpinnerService) {

  }
  // ngOnChanges(changes: SimpleChanges) {
  //   const currentItem: SimpleChange = changes.year;
  //   if (currentItem && (!currentItem.firstChange || (currentItem.firstChange && currentItem.currentValue)) && currentItem.currentValue !== currentItem.previousValue) {
  //     this.onYearChange();
  //     this.retrieveMasterData().subscribe(res => {
  //       this.masterData.masterCosts = res[0];
  //       this.masterData.masterProducts = res[1];
  //       this.masterData.costs = res[2];
  //       this.retrieveData();
  //     });
  //   }

  // }
  ngOnInit(): void {
    // this.onYearChange()

    // this.retrieveMasterData().subscribe(res => {
    //   this.masterData.masterCosts = res[0];
    //   this.masterData.masterProducts = res[1];
    //   this.retrieveData();
    // });

    this.onYearChange(this.year, this.month, this.version, this.maxVersion, false);

  }
  setView() {
    if (!this.numberBoxReadOnly) {
      this.onEditData(null);
    }

  }
  onYearChange(year: any, month: any, version: any, maxVersion: any, isHistory: any) {
    // this.loaderService.show();
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index < 13; index++) {
      const data: any = { year: yearStart, month: monthStart, MonthName: dateStart.format(this.formatMonthName), visible: true };
      if (index > 4) {
        data.visible = false;
      }
      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }
    this.dynamicColumns = [];
    this.dynamicColumnsVisible = [];
    this.dynamicColumnsSelected = [];
    // this.dynamicColumns.push({
    //   dataField: 'rowOrder',
    //   code: 'rowOrder',
    //   caption: '#',
    //   width: 25,
    //   alignment: 'center',
    //   fixed: true,
    //   fixedPosition: 'left'
    // })
    this.dynamicColumns.push({  // {
      dataField: 'product',
      code: 'product',
      caption: 'Product',
      groupIndex: 0,
      //width: 180,
      visible: true,
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'unit',
      code: 'unit',
      caption: 'unit',
      visible: true,
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'source',
      code: 'source',
      caption: 'source',
      // width: 80,
      visible: true,
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'demand',
      code: 'demand',
      // width: 150,
      caption: 'demand',
      fixed: true,
      fixedPosition: 'left'
    })

    _.each(this.listMonth, (item) => {
      this.dynamicColumnsVisible.push({ dataField: 'M' + item.month, caption: item.MonthName, });
      if (item.visible === true) {
        this.dynamicColumnsSelected.push('M' + item.month);
      }
      this.dynamicColumns.push({
        caption: item.MonthName,
        visible: item.visible,
        dataField: 'M' + item.month,
        columns: [
          {  // {
            dataField: 'isCalculateM' + item.month,
            code: 'isCalculateM' + item.month,
            //isColumn
            caption: 'คำนวน',
            visible: false,
            editTemplateName: 'cellCalEditTemplate',
            dataType: 'boolean',
            width: 160,
          },
          {  // {
            dataField: 'minDisplayM' + item.month,
            code: 'minDisplayM' + item.month,
            name: 'formulaMinM' + item.month,
            valueName: 'minM' + item.month,
            caption: 'Min',
            dataType: 'number',
            width: 80,
            editTemplateName: 'cellEditTemplate',
            cellTemplate: this.cellTemplate
          }, {  // {
            dataField: 'maxDisplayM' + item.month,
            code: 'maxDisplayM' + item.month,
            name: 'formulaMaxM' + item.month,
            valueName: 'maxM' + item.month,
            caption: 'Max',
            dataType: 'number',
            width: 80,
            editTemplateName: 'cellEditTemplate',
            cellTemplate: this.cellTemplate
          }]
      });

    });
    if (this.isHistory) {
      this.retrieveMasterDataHistory().subscribe(res => {
        this.masterData.volumeConstrainKt = res[0];
        this.masterData.volumeConstrainKtForm = res[1];
        this.retrieveData();
      });
    } else {
      this.retrieveMasterData().subscribe(res => {
        this.masterData.volumeConstrainKt = res[0];

        if (this.masterData.volumeConstrainKt && this.masterData.volumeConstrainKt.length > 0) {
          this.onSetDataInfo.emit(this.masterData.volumeConstrainKt[0]);
        }

        this.masterData.volumeConstrainKtForm = res[1];
        this.retrieveData();
      });
    }

  }
  retrieveMasterData(): Observable<any> {

    const volumeConstrainKt = this.volumeConstrainMeterService.getList(this.year, this.month);
    const volumeConstrainKtForm = this.volumeConstrainMeterService.getForm(this.year);
    return forkJoin([volumeConstrainKt, volumeConstrainKtForm]);
  }
  retrieveMasterDataHistory(): Observable<any> {

    const volumeConstrainKt = this.volumeConstrainMeterService.getListHistory(this.version);
    const volumeConstrainKtForm = this.volumeConstrainMeterService.getFormHistory(this.version);
    return forkJoin([volumeConstrainKt, volumeConstrainKtForm]);
  }
  retrieveData() {
    if (this.masterData.volumeConstrainKtForm) {
      this.dataList = _.cloneDeep(this.masterData.volumeConstrainKtForm)
      _.each(this.dataList, (item) => {
        const data = _.filter(this.masterData.volumeConstrainKt, (itemData) => {
          return itemData.product === item.product && itemData.unit === item.unit
            && itemData.source === item.source
            && itemData.demand === item.demand
        })

        _.each(this.listMonth, (itemMonth) => {
          const dataFormBase = _.find(data, (itemBase) => {
            return itemBase.month === itemMonth.month && itemBase.year === itemMonth.year
          })
          item['isCalculateM' + itemMonth.month] = dataFormBase ? dataFormBase.isCalculate : item.isCalculate
          item['minM' + itemMonth.month] = dataFormBase ? dataFormBase.min : item.min
          item['maxM' + itemMonth.month] = dataFormBase ? dataFormBase.max : item.max
        })

        this.calData();
      })
    }
    this.loaderService.hide();
  }
  onPaste(event: any, month: any, row: any, data: any) {
    console.log("chk1", event);
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
  onEditData($event) {
    _.remove(this.dynamicColumns, (item) => {
      return item.code === 'colForm'
    })

    console.log("chk2", $event);
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      this.dynamicColumns.push({
        caption: 'Form Excel',
        code: 'colForm',
        fixed: true,
        fixedPosition: 'left',
        columns: [
          {  // {
            dataField: 'isCalculate',
            code: 'isCalculate',
            caption: 'คำนวน',
            dataType: 'boolean',
            cellTemplate: 'cellCalEditTemplate',
            width: 160,
          },
          {  // {
            dataField: 'min',
            code: 'min',
            caption: 'Min',
            valueName: 'min',
            dataType: 'number',
            width: 80,
            cellTemplate: 'cellEditTemplate'
          }, {  // {
            dataField: 'max',
            code: 'max',
            caption: 'Max',
            valueName: 'max',
            dataType: 'number',
            width: 80,
            cellTemplate: 'cellEditTemplate'
          }, {  // {
            dataField: 'isAppltAll',
            code: 'isAppltAll',
            caption: 'Apply All',
            cellTemplate: 'cellAppltAllTemplate'
          }
        ]
      });
      _.each(this.dynamicColumns, (item) => {
        if (item.columns) {
          _.each(item.columns, (itemColumns) => {
            if (itemColumns.editTemplateName) {
              itemColumns.cellTemplate = itemColumns.editTemplateName
            }
            if (itemColumns.editTemplateName === 'cellCalEditTemplate') {
              itemColumns.visible = true;
            }
          })
        }
        if (item.editTemplateName) {
          item.cellTemplate = item.editTemplateName
        }
        if (item.editTemplateName === 'cellCalEditTemplate') {
          item.visible = true;
        }
      })
    } else {
      this.numberBoxReadOnly = true;
      console.log('444', this.numberBoxReadOnly);
      this.calData();
      _.each(this.dynamicColumns, (item) => {
        if (item.columns) {
          _.each(item.columns, (itemColumns) => {
            if (itemColumns.dataType === 'number') {
              itemColumns.cellTemplate = this.cellTemplate
            } else {
              itemColumns.cellTemplate = undefined
            }
            if (itemColumns.editTemplateName === 'cellCalEditTemplate') {
              itemColumns.visible = false;
            }
          })
        }
        if (item.editTemplateName) {
          if (item.dataType === 'number') {
            item.cellTemplate = this.cellTemplate
          } else {
            item.cellTemplate = undefined
          }
          if (item.editTemplateName === 'cellCalEditTemplate') {
            item.visible = false;
          }
        }
      })
    }
    // this.stateGrid();
    this.loaderService.hide();
  }

  calData() {
    console.log(this.dataList)
    _.each(this.dataList, (item, indexs) => {
      item.id = indexs;
      _.each(this.listMonth, (itemMonth) => {
        if (item['isCalculateM' + itemMonth.month] === true) {

          const date = moment(itemMonth.year + '-' + itemMonth.month + '-01')

          let formulaMin = _.replace(this.formula, '{0}', item['minM' + itemMonth.month] ? item['minM' + itemMonth.month] : 0)
          formulaMin = _.replace(formulaMin, '{1}', date.daysInMonth())
          let formulaMax = _.replace(this.formula, '{0}', item['maxM' + itemMonth.month] ? item['maxM' + itemMonth.month] : 0)
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth())
          item['minDisplayM' + itemMonth.month] = eval(formulaMin);
          item['formulaMinM' + itemMonth.month] = formulaMin;
          item['maxDisplayM' + itemMonth.month] = eval(formulaMax);
          item['formulaMaxM' + itemMonth.month] = formulaMax;
        } else {
          item['isCalculateM' + itemMonth.month] = false;
          item['minDisplayM' + itemMonth.month] = item['minM' + itemMonth.month];
          item['maxDisplayM' + itemMonth.month] = item['maxM' + itemMonth.month];
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
    console.log("chk3");
    let datalist: any = {};
    let dataForm = [];
    let dataKT = [];

    let versionSave = (this.maxVersion ? this.maxVersion : 0) + 1;
    _.each(this.dataList, (item) => {
      dataForm.push({
        product: item.product,
        unit: item.unit,
        source: item.source,
        demand: item.demand,
        isCalculate: item.isCalculate,
        min: item.min,
        max: item.max,
        filePath: this.dataInfo.filePath,
        fileName: this.dataInfo.fileName,
        version: versionSave,
      })
      _.each(this.listMonth, (itemMonth) => {
        dataKT.push({
          product: item.product,
          unit: item.unit,
          source: item.source,
          demand: item.demand,
          year: itemMonth.year,
          month: itemMonth.month,
          isCalculate: item['isCalculateM' + itemMonth.month],
          min: item['minM' + itemMonth.month],
          max: item['maxM' + itemMonth.month],
          filePath: this.dataInfo.filePath,
          fileName: this.dataInfo.fileName,
          version: versionSave,
        })
      })

    })
    datalist.dataForm = dataForm;
    datalist.dataKT = dataKT;
    return datalist;
  }
  getDataMaxVersion(item: any, itemTemp: any) {

    return item.dataListMaxVersion[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  onAppltAll(event, data) {
    console.log("datalist", this.dataList);
    _.each(this.listMonth, (item) => {
      data["isCalculateM" + item.month] = data.isCalculate
      data["minM" + item.month] = data.min
      data["maxM" + item.month] = data.max
    })
  }

  setData(data: any) {
    console.log('data', data);
    // this.dataList = [{ "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE1", "Delivery point": "GSP RY", "min": "0", "max": "50" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE2", "Delivery point": "GSP RY", "min": "", "max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (Vol >274T/Hr)", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (SPOT) GSP5", "Delivery point": "GSP RY", "Min": "", "Max": "" }, { "product": "C2", "unit": "KT", "source": "GSP RY", "demand": "C2 - OLE3 (Hybrid) supplement C2", "Delivery point": "GSP RY", "Min": "", "Max": "" }, {
    //   "product": "C2", "unit": "KT", "source": "GSP RY"
    //   , "demand": "C2 - SCG", "Delivery point": "GSP RY", "min": "", "max": "16.2", "isCalculate": true
    // }];
    this.dataList = data;
    _.each(this.dataList, (item, indexs) => {
      item.id = indexs
      item.isApplyAll = false;
      _.each(this.listMonth, (itemMonth) => {
        item['minM' + itemMonth.month] = item.min;
        item['maxM' + itemMonth.month] = item.max;
        if (item.isCalculate) {
          const date = moment(itemMonth.year + '-' + itemMonth.month + '-01')
          item['isCalculateM' + itemMonth.month] = item.isCalculate;
          let formulaMin = _.replace(this.formula, '{0}', item['minM' + itemMonth.month] ? item['minM' + itemMonth.month] : 0)
          formulaMin = _.replace(formulaMin, '{1}', date.daysInMonth())
          let formulaMax = _.replace(this.formula, '{0}', item['maxM' + itemMonth.month] ? item['maxM' + itemMonth.month] : 0)
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth())
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth())
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
        this.dataGridMeterList.instance.state(null)
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
    console.log('event', event)
    console.log('this.dynamicColumns', this.dynamicColumns)
    if (event.value && event.value.length > 0) {
      if (this.dataGridMeterList && this.dataGridMeterList.instance) {
        _.each(this.listMonth, (item) => {
          this.dataGridMeterList.instance.columnOption('M' + item.month, 'visible', false);
          const tmpData = _.find(this.dynamicColumns, (i) => { return i.dataField == 'M' + item.month });
          if (tmpData) {
            tmpData.visible = false;
          }
        })
        _.each(event.value, (item) => {
          // this.dataGridMeterList.instance.columnOption(item, 'visible', true);
          const tmpData = _.find(this.dynamicColumns, (i) => { return i.dataField == item });
          if (tmpData) {
            tmpData.visible = true;
          }
        })

        this.gridRefresh();

      }
    } else if (event.value && event.value.length === 0) {
      if (this.dataGridMeterList && this.dataGridMeterList.instance) {
        _.each(this.listMonth, (item) => {
          this.dataGridMeterList.instance.columnOption('M' + item.month, 'visible', true);
        })
      }
    }
  }
}