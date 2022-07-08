import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/service/base.service';
import data from '../../../../constants/menu';
import { v4 as uuid } from 'uuid';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-or-demand-plan-data-grid-input',
  templateUrl: './or-demand-plan-data-grid-input.component.html',
  styleUrls: ['./or-demand-plan-data-grid-input.component.css'],
})
export class OrDemandPlanDataGridInputComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  dataListVersion0: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

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
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = '';
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };
  isRecursive = false;
  recursiveMonth: any = 0;

  @Input() maxVersion: any = 0;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(
    private orDemandPlantService: OrDemandPlantService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.accessMenuList();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.calData();

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
    maxVersion,
    dataImport?: any,
    callback?: any
  ) {
    this.loaderService.show();
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    dateStart = dateStart.add(1, 'M');
    for (let index = 1; index <= 12; index++) {
      const data: any = { year: yearStart, month: monthStart, MonthName: dateStart.format(this.formatMonthName), visible: true }
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }
    this.dynamicColumns = [];
    // this.dynamicColumns.push({
    //   dataField: '#',
    //   code: 'index',
    //   caption: 'ลำดับ',
    //   alignment: 'center',
    //   fixed: true,
    //   fixedPosition: 'left',
    // });
    this.dynamicColumns.push({
      dataField: 'monthName',
      code: 'monthName',
      caption: 'เดือน',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
    });
    this.dynamicColumns.push({
      dataField: 'unitName',
      code: 'unitName',
      caption: 'Unit',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
    });

    this.dynamicColumns.push({
      caption: 'ทางบก',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
      columns: [
        {
          dataField: 'brpPttepValue',
          code: 'brpPttep',
          caption: 'คก.บป. + ปตท.สผ.',
          alignment: 'right',
          cellTemplate: this.cellTemplate
        },
        {
          dataField: 'ptttankValue',
          code: 'ptttank',
          caption: 'PTT Tank',
          alignment: 'right',
          cellTemplate: this.cellTemplate
        },
      ],
    });
    this.dynamicColumns.push({
      caption: 'ทางเรือ',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
      columns: [
        {
          dataField: 'mtPtttankRefineryValue',
          code: 'mtPtttankRefinery',
          caption: 'คก.ขบ. + GSP#4 + PTT Tank + Refinery',
          alignment: 'right',
          cellTemplate: this.cellTemplate
        },
      ],
    });
    this.dynamicColumns.push({
      caption: 'รวม',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
      columns: [
        {
          dataField: 'total',
          code: 'total',
          caption: '(บก+เรือ)',
          alignment: 'right',
          cellTemplate: this.cellTemplate
          // format: 'fixedPoint',
          // dataType: "number",
          // precision: 2
        },
      ],
    });

    this.dynamicColumns.push({
      dataField: 'propaneValue',
      code: 'propane',
      caption: 'Propane',
      alignment: 'right',
      cellTemplate: this.cellTemplate
    });

    this.dynamicColumns.push({
      dataField: 'importForExportValue',
      code: 'importForExport',
      caption: 'Import for Export',
      alignment: 'right',
      cellTemplate: this.cellTemplate
    });

    this.dynamicColumns.push({
      dataField: 'spotOdorlessLpgValue',
      code: 'spotOdorlessLpg',
      caption: 'Aerosol PTTOR(Spot Odorless LPG)',
      alignment: 'right',
      cellTemplate: this.cellTemplate
    });

    this.loaderService.hide();

    this.retrieveMasterData().subscribe((res) => {
      console.log('res :: ', res);
      this.masterData.masterData = res[0];
      this.masterData.version = res[1];
      this.isRecursive = false;
      this.retrieveData();
      if (callback) {
        callback();
      }
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterData = this.orDemandPlantService.getList(this.year, this.month, this.version);
    const versionData = this.orDemandPlantService.getVersion(this.year, -1);
    return forkJoin([masterData, versionData]);
  }

  retrieveData() {
    this.setRetrieveData();
  }

  setRetrieveData() {

    this.dataList = [];

    if (this.isRecursive) {
      if (_.toInteger(this.year) > moment().year()) {
        this.month = 0;
      } else if (_.toInteger(this.year) < moment().year()) {
        this.month = 13;
      } else {
        this.month = moment().month() + 1;
      }
    }

    console.log('this.masterData.masterData', this.masterData.masterData);

    _.each(this.listMonth, (item, index) => {


      let dataList: any = {};

      const findList = this.masterData.masterData.find((obj) => {
        return obj.monthValue === item.month && obj.yearValue === item.year;
      })

      if (findList) {
        dataList = findList;
      } else {
        dataList = {
          id: uuid(),
          month: this.month,
          year: this.year,
          monthValue: item.month,
          yearValue: item.year,
          unitName: 'Kg',
          brpPttepValue: 0,
          brpPttepRemark: null,
          ptttankValue: 0,
          ptttankRemark: null,
          mtPtttankRefineryValue: 0,
          mtPtttankRefineryRemark: null,
          total: 0,
          propaneValue: 0,
          propaneRemark: null,
          importForExportValue: 0,
          importForExportRemark: null,
          spotOdorlessLpgValue: 0,
          spotOdorlessLpgRemark: null,
          version: 0,
        }
      }

      dataList.monthName = item.MonthName;

      this.dataList.push(dataList);

    })

    this.calData();

    this.loaderService.hide();
  }

  calData() {

    _.each(_.cloneDeep(this.dataList), (item, index) => {

      const sumTotal = (this.dataList[index].brpPttepValue + this.dataList[index].ptttankValue + this.dataList[index].mtPtttankRefineryValue);
      this.dataList[index].total = sumTotal;

    });

  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log(event);
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
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
    } else {
      this.numberBoxReadOnly = true;
    }
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.refresh();
    }
    this.loaderService.hide();
  }

  getDataSave() {
    console.log('this.dataList', this.dataList);
    let dataSave: any = {};
    let _datalist = _.cloneDeep(this.dataList);
    dataSave = _datalist;
    return dataSave;
  }

  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  setData(data: any, month: any) {
    console.log('data ', data);
    // console.log('this.dataList ===> ', this.dataList);
    _.each(this.dataList, (item) => {
      const dataExcel = _.filter(data, (itemExcel) => {
        // return itemExcel.product === item.referencePriceNameFrom
        return (
          this.baseService.replaceCpeciaCharacters(itemExcel.product) ===
          this.baseService.replaceCpeciaCharacters(item.referencePriceNameFrom)
        );
      });
      if (dataExcel) {
        _.each(dataExcel, (itemProduct) => {
          //ตั้งแต่เดือนปัจจุบันให้ใช้ month
          for (let index = 1; index < 13; index++) {
            let data = _.toNumber(
              _.trim(_.replace(itemProduct['m' + index], ',', ''))
            );
            if (data) {
              item['isPasteM' + index] = true;
              // if (itemProduct.product === 'PP Yarn : CFR SEA') {
              const formula = _.find(
                _.cloneDeep(this.masterData.masterPrices),
                (mProduct) => {
                  return mProduct.referencePriceNameFrom == itemProduct.product;
                }
              ).formula;
              data = eval(data + formula);
              // }

              if (
                item['isManualM' + index] == undefined ||
                item['isManualM' + index] === false
              ) {
                item['M' + index] = data;
              }
            }
          }
        });
      }
    });

    if (month != 'importOtherYear') {
      this.loaderService.hide();
    }
  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  // itemClick(
  //   event: any,
  //   data: any,
  //   row: any,
  //   column: any,
  //   dataField: any,
  //   item: any,
  // ) {
  //   if (event.itemData.text === 'Paste') {
  //     navigator.clipboard
  //       .readText()
  //       .then((txt: any) => {
  //         let pastedText = txt;
  //         pastedText = pastedText.trim('\r\n');
  //         _.each(pastedText.split('\r\n'), (i2, index) => {
  //           _.each(i2.split('\t'), (i3, index3) => {
  //             let dataText = _.toNumber(_.trim(i3).replace(',', ''));

  //             if (dataText && _.isNumber(dataText)) {
  //               // const refTo = _.replace(data[row + index].referencePriceNameTo, new RegExp(' ', 'g'), '');
  //               // if (refTo === 'PP:CFRSEA') {
  //               const formula = _.find(
  //                 _.cloneDeep(this.masterData.masterPrices),
  //                 (mProduct) => {
  //                   return (
  //                     mProduct.referencePriceNameFrom ==
  //                       data[row + index].referencePriceNameFrom &&
  //                     mProduct.referencePriceNameTo ==
  //                       data[row + index].referencePriceNameTo &&
  //                     mProduct.unit == data[row + index].unit
  //                   );
  //                 }
  //               ).formula;
  //               dataText = eval(dataText + formula);
  //               // }
  //               data[row + index]['isPasteM' + (column + index3)] = true;
  //               data[row + index]['M' + (column + index3)] = dataText;
  //             } else {
  //               Swal.fire({
  //                 title: 'ไม่สารถนำข้อมูลมาแสดงเพิ่ม',
  //                 text: 'เนื่องจากข้อมูลที่ Copy มาไม่เป็นตัวเลข',
  //                 icon: 'error',
  //                 showConfirmButton: true,
  //                 confirmButtonText: 'ปิด',
  //                 //timer: 1000
  //               });
  //               return false;
  //             }
  //           });
  //         });
  //       })

  //       // (A3) OPTIONAL - CANNOT ACCESS CLIPBOARD
  //       .catch((err) => {
  //         // alert("Please allow clipboard access permission");
  //       });
  //   } else if (event.itemData.text === 'Edit') {
  //     console.log('item',item);
  //     this.titleEdit = data.monthName + ' : ' + column.caption;
  //     this.dataEdit = item;
  //     this.dataEditOld = _.cloneDeep(item);
  //     this.rowEdit = row;
  //     this.dataFieldEdit = dataField;
  //     this.popupVisible = true;
  //   }
  // }

  itemClick($event, data: any, row: any, columnIndex: any, field: any, isFrom: boolean, item: any) {
    console.log('itemClick -> data', data)
    console.log('row', row)
    console.log('columnIndex', columnIndex)
    console.log('field', field)
    console.log('item', item)
    const title = 'Setting Depot Constrain';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.field = field;

    if ($event.itemData.text === 'Edit') {
      month = data.monthValue;
      year = data.yearValue;
      this.dataInfoEditColumn.title = `${title} : ${month}/${year}`;
      this.titleEdit = data.monthName + ' : ' + field.caption;
      this.dataInfoEditColumn.month = month;
      this.dataInfoEditColumn.year = year;
      this.dataEdit = data;
      this.dataFieldEdit = columnIndex;

      setTimeout(() => {
        this.dataInfo = data;
        this.popupVisible = true;
        this.dataList.data[this.rowEdit] = this.dataInfo;
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
          let runningIndex = row;
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningColumn = this.getColumnNumber(columnIndex);
            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replaceAll(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {

                console.log('Row', runningIndex);
                console.log('runningColumn', runningColumn);
                console.log('Column', this.getColumnText(runningColumn))
                console.log('Value', dataText)
                console.log('--------------------------------------------')

                if (this.getColumnText(runningColumn) != 'total') {

                  this.dataList[runningIndex][this.getColumnText(runningColumn)] = dataText;
                  this.dataList[runningIndex]['isPasteM' + this.getColumnText(runningColumn)] = true;

                  // console.log('this.dataList',this.dataList);

                  runningColumn++;
                  this.calData();
                } else {
                  runningColumn++;
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

            runningIndex++;

          });



        })
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });

      this.dataInfo = data;
      // this.dataList.data[this.rowEdit] = this.dataInfo;

    }
  }

  getColumnText(row: number) {
    let txtColumn = null;

    switch (row) {
      case 0: {
        txtColumn = 'brpPttepValue';
        break;
      }
      case 1: {
        txtColumn = 'ptttankValue';
        break;
      }
      case 2: {
        txtColumn = 'mtPtttankRefineryValue';
        break;
      }
      case 3: {
        txtColumn = 'total';
        break;
      }
      case 4: {
        txtColumn = 'propaneValue';
        break;
      }
      case 5: {
        txtColumn = 'importForExportValue';
        break;
      }
      case 6: {
        txtColumn = 'spotOdorlessLpgValue';
        break;
      }

    }

    return txtColumn;

  }

  getColumnNumber(rowTxt: string) {
    let numColumn = null;

    switch (rowTxt) {
      case 'brpPttep': {
        numColumn = 0;
        break;
      }
      case 'ptttank': {
        numColumn = 1;
        break;
      }
      case 'mtPtttankRefinery': {
        numColumn = 2;
        break;
      }
      case 'total': {
        numColumn = 3;
        break;
      }
      case 'propane': {
        numColumn = 4;
        break;
      }
      case 'importForExport': {
        numColumn = 5;
        break;
      }
      case 'spotOdorlessLpg': {
        numColumn = 6;
        break;
      }

    }

    return numColumn;

  }

  getdataList() {
    let data: any = {};
    data.dataList = this.dataList;
    return data;
  }

  popupSaveClick = () => {

    if (this.dataEditOld[this.getColumnText(this.dataInfoEditColumn.field.index - 3)] !== this.dataEdit[this.getColumnText(this.dataInfoEditColumn.field.index - 3)]) {
      this.dataEdit['isPasteM' + this.getColumnText(this.dataInfoEditColumn.field.index - 3)] = true;
      this.gridRefresh();
    }

    this.calData();
    this.popupVisible = false;
  };
  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataInfoOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  };

  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data.type == 'Total') {
      e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#ECEFF1';
    }
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.columnIndex > 1) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (
      e.rowType === 'data' &&
      e.data &&
      e.row.data['isPasteM' + e.column.dataField] === true
    ) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  gridRefresh() {
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.state(null);
    }
  }
}
