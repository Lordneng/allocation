
import { Component, Input, OnInit, AfterViewInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { CalMarginService } from 'src/app/service/cal-margin.service';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { MarginperunitDataGridComponent } from '../marginperunit-data-grid/marginperunit-data-grid.component';
import { SellingpriceDataGridComponent } from '../sellingprice-data-grid/sellingprice-data-grid.component';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-fullcost-data-grid',
  templateUrl: './fullcost-data-grid.component.html',
  styleUrls: ['./fullcost-data-grid.component.css']
})
export class FullcostDataGridComponent implements OnInit, AfterViewInit {
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;
  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  numberBoxDigi = 0;

  dynamicColumns: any[] = [];

  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = moment().format('yyyy');
  month: any = moment().format('M');
  formatMonthName = 'MMM-yyyy';
  version: any = 1;

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  accessMenu: any;

  fullcostData: any = [];
  fullcostManualData: any = [];
  fullcostList: any = [];
  dataInfoEditColumn: any = {};

  isFirstLoad: boolean = true;
  @Input() maxVersion: any = 0;
  @Output() onEventClick = new EventEmitter();
  @ViewChild('fullCostDataGrid', { static: false }) fullCostDataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(
    private loaderService: NgxSpinnerService,
    private authService: AuthService,
    private calMarginService: CalMarginService
  ) { }

  ngOnInit(): void {
    this.accessMenuList();
  }

  ngAfterViewInit(): void { }

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

  onEditData($event) {
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
    }
    else {
      this.numberBoxReadOnly = true;
    }
    if (this.fullCostDataGrid && this.fullCostDataGrid.instance) {
      setTimeout(() => {
        this.fullCostDataGrid.instance.refresh();
      }, 100);
    }
    this.loaderService.hide();
  }

  async onYearChange(year: any, month: any, version: any, fullcostList: any, dynamicColumns: any, listMonth: any) {
    // console.log("version :: ", maxVersion);
    // this.loaderService.show();
    this.isFirstLoad = true;
    this.year = year;
    this.month = month;
    this.version = version;
    this.listMonth = listMonth;
    this.dynamicColumns = dynamicColumns;
    this.fullcostList = fullcostList;
    //return await this.retrieveData();
  }

  async retrieveData() {
    // console.log("this.fullcostData >> ", this.fullcostData);
    // console.log("this.listMonth >> ", this.listMonth);
    let productData = _.uniqBy(_.cloneDeep(this.fullcostData), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
    // prepare data month
    this.fullcostList = [];
    _.each(productData, (item) => {
      _.each(this.listMonth, (i) => {
        item['id'] = _.toUpper(uuid());
        const findData = _.find(_.cloneDeep(this.fullcostData), (x) => {
          return x.productName === item.productName && _.toNumber(x.monthValue) === _.toNumber(i.month) && _.toNumber(x.yearValue) === _.toNumber(i.year)
        });

        // find manual
        let manualValue = _.find(_.cloneDeep(this.fullcostManualData), it => {
          return it.product === item.productName
            && it.source === item.sourceName
            && it.deliveryPoint === item.deliveryName
            && it.demand === item.demandName
            && _.toNumber(it.valueMonth) === _.toNumber(i.month)
            && _.toNumber(it.year) === _.toNumber(i.year)
        });

        let fullCostValue = (manualValue ? manualValue.value : (findData && findData['fullCostValue'] ? findData['fullCostValue'] : 0));

        if (manualValue) { item['isManualM' + i.month + i.year] = true; item['calculateM' + i.month + i.year] = item['M' + i.month + i.year] }

        item['M' + i.month + i.year] = (fullCostValue ? fullCostValue : 0);
        item['formulaM' + i.month + i.year] = (findData && findData['fullcostFormulaText'] ? (findData['fullcostFormulaText'] ? findData['fullcostFormulaText'] : '') : '');

      });

      this.fullcostList.push(item);
    });

    this.fullcostList = _.orderBy(this.fullcostList, ['productName', 'customerPlantName'], ['asc', 'asc']);
    // console.log("this.fullcostList >> ", this.fullcostList);

    this.gridRefresh();
    // this.loaderService.hide();
    console.log('full')
  }

  onPaste(event: any, month: any, row: any, data: any) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        data[row + index]['M' + (month + index3)] = _.trim(i3)
      });
    });

    return false;
  }

  getDataSave(isSaveAS: boolean) {
    let datalist = [];
    let saveVersion = this.maxVersion;
    if (isSaveAS) {
      saveVersion = (this.maxVersion ? (_.toNumber(this.maxVersion) + 1) : 1);
    }

    console.log("this.fullcostList : ", this.fullcostList);
    _.each(this.fullcostList, (item) => {
      _.each(this.listMonth, (itemMonth) => {
        if (item['isManualM' + itemMonth.month + itemMonth.year] === true) {
          let data: any = {};
          data.id = _.toUpper(uuid());
          data.activeStatus = '1';
          data.product = item.productName
          data.unit = item.unitName;
          data.source = item.sourceName;
          data.demand = item.demandName;
          data.deliveryPoint = item.deliveryName;
          data.year = _.toNumber(this.year);
          data.month = _.toNumber(this.month);
          data.value = item['M' + itemMonth.month + itemMonth.year];
          data.valueMonth = _.toNumber(itemMonth.month);
          data.version = saveVersion;
          datalist.push(data);
        }
      });
    });
    return datalist;
  }

  getDataMaxVersion(itemTemp: any) {
    // console.log('demand: ',itemTemp.data['demand'],' value',itemTemp.data[itemTemp.column.dataField],'demand: ',this.masterData.fullCostMaxVersion[itemTemp.rowIndex-1]['demand'],' max: ',this.masterData.fullCostMaxVersion[itemTemp.rowIndex-1][itemTemp.column.dataField],' index : ',itemTemp.rowIndex)
    const maxFullCost = _.find(this.masterData.fullCostMaxVersion, (item) => {
      return item.id === itemTemp.data['id'];
    });
    return maxFullCost[itemTemp.column.dataField]
  }

  onDataChange(event: any, data, dataField) {
    if (data[dataField] !== data['calculate' + dataField]) {
      data['isManual' + dataField] = true;
    }
  }

  itemClick(event: any, month: any, row: any, columnIndex: any, data: any, item: any, dataField: any) {

    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.field = dataField;

    if (event.itemData.text === 'Paste') {

      if (this.accessMenu !== 1) {
        Swal.fire({
          title: 'Access Denied',
          text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
        });

        return;
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
                if (runningIndex < 13) {
                  let month = this.listMonth[runningIndex].month;
                  let year = this.listMonth[runningIndex].year;
                  this.fullcostList[row + index]['M' + month + year] = dataText;
                  this.fullcostList[row + index]['isPasteM' + month + year] = true;
                  this.fullcostList[row + index]['isManualM' + month + year] = true;
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

        }).catch(err => {
          console.log("error > ", err);
        });

    } else if (event.itemData.text === 'Edit') {
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      })
      this.titleEdit = "Full Cost : " + title.caption + " : " + item.demandName;
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.dataFieldEdit = dataField;
      this.popupVisible = true;
    }
  }

  popupSaveClick = () => {

    if (this.dataEditOld[this.dataInfoEditColumn.field] !== this.dataEdit[this.dataInfoEditColumn.field]) {
      this.dataEdit['isPaste' + this.dataInfoEditColumn.field] = true;
      this.gridRefresh();
    }

    this.popupVisible = false;
    this.onEventClick.emit(this.getDataSave(false));
  }

  popupCancelClick = () => {
    this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    this.popupVisible = false;
  }

  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 4) {
      e.cellElement.classList.add('hovers');
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  // gridRefresh() {
  //   if (this.dataGridList && this.dataGridList.instance) {
  //     setTimeout(() => {
  //       this.dataGridList.instance.refresh();
  //     }, 100);
  //   }
  // }

  gridRefresh(calBack?) {
    if (this.isFirstLoad) {
      this.gridState(calBack);
      return;
    }

    if (this.fullCostDataGrid && this.fullCostDataGrid.instance) {
      this.fullCostDataGrid.instance.refresh();
      if (calBack) {
        calBack();
      }
    }
  }

  gridState(calBack?) {
    if (this.fullCostDataGrid && this.fullCostDataGrid.instance) {
      this.fullCostDataGrid.instance.state(null);
      if (calBack) {
        calBack();
      }
    }
  }
  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  clearList() {
    this.fullcostList = [];
    this.gridRefresh();
  }

}
