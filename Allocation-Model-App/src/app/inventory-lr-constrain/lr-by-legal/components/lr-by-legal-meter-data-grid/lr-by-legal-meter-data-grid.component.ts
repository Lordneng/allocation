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
import { LRByLegalService } from 'src/app/service/lr-by-legal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-lr-by-legal-meter-data-grid',
  templateUrl: './lr-by-legal-meter-data-grid.component.html',
  styleUrls: ['./lr-by-legal-meter-data-grid.component.css'],
})
export class LRByLegalMeterDataGridComponent implements OnInit {
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
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dynamicColumnsVisible: any[] = [];
  dynamicColumnsSelected: any[] = [];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  cellLRNameTemplate = 'cellLRNameTemplate';
  year: any = 2021;
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  isHistory = false;

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  dataFieldEdit: any = {};

  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  validateResult: any = { isValid: true };
  popupHeight: number = 350;
  accessMenu: any;

  @Input() maxVersion: any = 0;
  @ViewChild('dataGridMeterList', { static: false }) dataGridMeterList: DxDataGridComponent;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  formula = '{0} * 24 * {1} / 1000';

  @Output() onSetDataInfo = new EventEmitter();
  constructor(
    private lrbylegalService: LRByLegalService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.onYearChange(
    //   this.year,
    //   this.month,
    //   this.version,
    //   this.maxVersion,
    //   false
    // );
    this.accessMenuList();
  }
  setView() {
    if (!this.numberBoxReadOnly) {
      this.onEditData(null);
    }
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

  onYearChange(
    year: any,
    month: any,
    version: any,
    maxVersion: any,
    isHistory: any
  ) {
    // this.loaderService.show();
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    // dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
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

    console.log("this.listMonth >> ", this.listMonth);

    this.dynamicColumns = [];
    // this.dynamicColumnsVisible = [];
    // this.dynamicColumnsSelected = [];
    this.dynamicColumns.push({
      dataField: 'source',
      code: 'source',
      caption: 'LR Name',
      visible: true,
      fixed: true,
      fixedPosition: 'left',
      width: 300,
      cellTemplate: this.cellLRNameTemplate
    });

    this.dynamicColumns.push({
      // {
      dataField: 'unit',
      code: 'unit',
      caption: 'Unit',
      visible: true,
      fixed: true,
      width: 200,
      fixedPosition: 'left',
    });

    _.each(this.listMonth, (item, index) => {

      this.dynamicColumns.push({
        caption: item.MonthName,
        visible: item.visible,
        dataField: 'M' + item.month + item.year,
        code: index,
        dataType: 'number',
        editTemplateName: this.cellTemplate,
        cellTemplate: this.cellTemplate,
      });
    });

    this.retrieveHistoryData().subscribe((res) => {
      this.masterData.lrbylegal = res[0];
      this.masterData.lrbylegalForm = res[1];
      this.retrieveData();
    });

    // console.log("this.dynamicColumns >> ", this.dynamicColumns);
    // if (!this.isHistory) {
    //   this.retrieveMasterData().subscribe((res) => {
    //     this.masterData.lrbylegal = res[0];
    //     this.masterData.lrbylegalForm = res[1];
    //     this.retrieveData();
    //   });
    // }
    // else {
    //   this.retrieveHistoryData().subscribe((res) => {
    //     this.masterData.lrbylegal = res[0];
    //     this.masterData.lrbylegalForm = res[1];
    //     this.retrieveData();
    //   });
    // }
  }

  retrieveMasterData(): Observable<any> {
    const lrbylegal = this.lrbylegalService.getList(this.year, this.month);
    const lrbylegalForm = this.lrbylegalService.getForm(this.year);
    return forkJoin([lrbylegal, lrbylegalForm]);
  }

  retrieveHistoryData(): Observable<any> {
    const lrbylegal = this.lrbylegalService.getListHistory(this.year, this.month, this.version);
    const lrbylegalForm = this.lrbylegalService.getFormHistory(this.year, this.month, this.version);
    return forkJoin([lrbylegal, lrbylegalForm]);
  }

  retrieveData() {
    console.log("this.masterData >> ", this.masterData);
    if (this.masterData.lrbylegalForm) {
      this.dataList = _.cloneDeep(this.masterData.lrbylegalForm);
      _.each(this.dataList, (item) => {
        const data = _.filter(this.masterData.lrbylegal, (itemData) => {
          return (
            // itemData.product === item.product &&
            itemData.unit === item.unit &&
            itemData.source === item.source &&
            itemData.demand === item.demand
          );
        });

        _.each(this.listMonth, (itemMonth) => {

          if (data && data.length > 0) {
            const dataFormBase = _.find(data, (itemBase) => {
              return (
                itemBase.monthValue === itemMonth.month &&
                itemBase.yearValue === itemMonth.year
              );
            });
            item['M' + itemMonth.month + '' + itemMonth.year] = (dataFormBase ? dataFormBase.value : item.value);
            item['remarkM' + itemMonth.month + '' + itemMonth.year] = (dataFormBase ? dataFormBase.remarkMonth : null);
          }
          else {
            item['M' + itemMonth.month + '' + itemMonth.year] = item.value;
          }

        });
        // this.calData();
      });

      console.log("this.dataList >> ", this.dataList);
    }
    this.loaderService.hide();
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log('chk1', event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        if (index3 <= 12) {
          let month = this.listMonth[index3].month;
          let year = this.listMonth[index3].year;
          data[row + index]['valMonthM' + month + year] = _.trim(i3).replace(',', '')
        }
      });
    });

    return false;
  }

  onEditData($event) {
    _.remove(this.dynamicColumns, (item) => {
      return item.code === 'colForm';
    });

    console.log('chk2', $event);
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      this.dynamicColumns.push({
        caption: 'Form Value',
        code: 'colForm',
        fixed: true,
        fixedPosition: 'left',
        columns: [
          {
            dataField: 'value',
            code: 'value',
            caption: 'Value',
            valueName: 'value',
            dataType: 'number',
            width: 80,
            cellTemplate: 'cellEditTemplate',
          },
          {
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
            if (itemColumns.editTemplateName === 'cellCalEditTemplate') {
              itemColumns.visible = true;
            }
          });
        }
        if (item.editTemplateName) {
          item.cellTemplate = item.editTemplateName;
        }
        if (item.editTemplateName === 'cellCalEditTemplate') {
          item.visible = true;
        }
      });
    } else {
      this.numberBoxReadOnly = true;
      // console.log('444', this.numberBoxReadOnly);
      this.calData();
      _.each(this.dynamicColumns, (item) => {
        if (item.columns) {
          _.each(item.columns, (itemColumns) => {
            if (itemColumns.dataType === 'number') {
              itemColumns.cellTemplate = this.cellTemplate;
            } else {
              itemColumns.cellTemplate = undefined;
            }
            if (itemColumns.editTemplateName === 'cellCalEditTemplate') {
              itemColumns.visible = false;
            }
          });
        }
        if (item.editTemplateName) {
          if (item.dataType === 'number') {
            item.cellTemplate = this.cellTemplate;
          } else {
            item.cellTemplate = undefined;
          }
          if (item.editTemplateName === 'cellCalEditTemplate') {
            item.visible = false;
          }
        }
      });
    }
    // this.stateGrid();
    this.loaderService.hide();
  }

  calData() {
    // _.each(this.dataList, (item, indexs) => {
    //   // item.id = indexs;
    //   _.each(this.listMonth, (itemMonth) => {
    //     item['valueDisplayM' + itemMonth.month + itemMonth.year] =
    //       item['valueM' + itemMonth.month + itemMonth.year];
    //   });
    // });
  }
  stateGrid() {
    if (this.dataGridMeterList && this.dataGridMeterList.instance) {
      setTimeout(() => {
        this.dataGridMeterList.instance.state(null);
      }, 200);
    }
  }
  getDataSave(versionNumber: any, monthVersion: any) {
    console.log('getDataSave >>> ', this.dataList);
    let datalist: any = {};
    let dataForm = [];
    let dataKT = [];

    // let versionSave = (this.maxVersion ? this.maxVersion : 0);
    let versionSave = versionNumber;

    _.each(this.dataList, (item) => {
      dataForm.push({
        product: item.product,
        unit: item.unit,
        source: item.source,
        demand: item.demand,
        value: item.value,
        remark: (item.remark ? item.remark : null),
        activeStatus: 1,
        year: _.toInteger(this.year),
        month: _.toInteger(this.month),
        version: versionSave,
      });
      _.each(this.listMonth, (itemMonth) => {
        dataKT.push({
          product: item.product,
          unit: item.unit,
          source: item.source,
          demand: item.demand,
          year: this.year,
          month: monthVersion,
          monthValue: itemMonth.month,
          yearValue: itemMonth.year,
          value: item['M' + itemMonth.month + '' + itemMonth.year],
          remarkMonth: (item['remarkM' + itemMonth.month + '' + itemMonth.year] ? item['remarkM' + itemMonth.month + '' + itemMonth.year] : null),
          activeStatus: 1,
          version: versionSave,
        });
      });
    });
    datalist.dataForm = dataForm;
    datalist.dataKT = dataKT;
    return datalist;
  }
  getDataMaxVersion(item: any, itemTemp: any) {
    return item.dataListMaxVersion[itemTemp.rowIndex][
      itemTemp.column.dataField
    ];
  }

  setData(data: any) {
    console.log('data', data);
    this.dataList = data;
    _.each(this.dataList, (item, indexs) => {
      // item.id = indexs;
      item.isApplyAll = false;
      // _.each(this.listMonth, (itemMonth) => {
      //   //item['valueM' + itemMonth.month] = item.value;
      //   item['valueDisplayM' + itemMonth.month] = item.value;
      // });
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
  // onVisibleValueChange(event) {
  //   console.log('event', event);
  //   if (event.value && event.value.length > 0) {
  //     if (this.dataGridMeterList && this.dataGridMeterList.instance) {
  //       _.each(this.listMonth, (item) => {
  //         this.dataGridMeterList.instance.columnOption(
  //           'M' + item.month,
  //           'visible',
  //           false
  //         );
  //       });
  //       _.each(event.value, (item) => {
  //         this.dataGridMeterList.instance.columnOption(item, 'visible', true);
  //       });
  //     }
  //   } else if (event.value && event.value.length === 0) {
  //     if (this.dataGridMeterList && this.dataGridMeterList.instance) {
  //       _.each(this.listMonth, (item) => {
  //         this.dataGridMeterList.instance.columnOption(
  //           'M' + item.month,
  //           'visible',
  //           true
  //         );
  //       });
  //     }
  //   }
  // }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  onCellPrepared(e) {
    if (e.rowType === "data") {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
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
    // console.log("row :: ", row);
    const title = 'LR By Legal';
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
        data.isAll = (data.isAll ? data.isAll : false);
      } else {
        this.popupHeight = 350;
        month = this.listMonth[columnIndex].month;
        year = this.listMonth[columnIndex].year;
        this.dataInfoEditColumn.title = `${title} : ${moment(year + '-' + month + '-01').format(this.formatMonthName)}`;
      }
      setTimeout(() => {
        this.dataInfo = data;
        this.popupVisible = true;
        console.log('this.dataInfo', this.dataInfo);
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

      navigator.clipboard
        .readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningIndex = columnIndex;
            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                if (runningIndex < 13) {
                  let month = this.listMonth[runningIndex].month;
                  let year = this.listMonth[runningIndex].year;
                  // this.dataList[row + index]['M' + month] = dataText;
                  // this.dataList[row + index]['isPasteM' + month] = true;
                  this.dataList[row + index]['M' + month + year] = dataText;
                  this.dataList[row + index]['isPasteM' + month + year] = true;
                  runningIndex++;
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
        .catch((err) => {
          // alert("Please allow clipboard access permission");
        });

      this.dataInfo = data;
      this.stateGrid();
      console.log("this.dataList >> ", this.dataList);

      //this.dataList.data[this.rowEdit] = this.dataInfo;
    }
  }


  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataInfoOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }

  getDataVersion0(itemTemp: any) {
    // return item.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
    return null;
  }

  popupSaveClick = () => {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        if (this.dataInfo[this.dataInfoEditColumn['field']] !== this.dataInfoOld[this.dataInfoEditColumn['field']]) {
          this.dataInfo['isPaste' + this.dataInfoEditColumn['field']] = true;
          this.stateGrid();
        }
        if (this.dataInfoEditColumn.isFrom && this.dataInfo.isAll) {
          this.onAppltAll(this.dataList[this.rowEdit]);
        }
        this.popupVisible = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  onAppltAll(data: any) {
    _.each(this.listMonth, (item) => {
      data["M" + item.month + '' + item.year] = this.dataInfo['value'];
      data["isPasteM" + item.month + '' + item.year] = true;
    });
  }

  valMonthValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

}
