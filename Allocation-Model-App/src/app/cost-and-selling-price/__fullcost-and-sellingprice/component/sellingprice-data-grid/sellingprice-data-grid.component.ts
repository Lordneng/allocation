import { SellingPricesService } from 'src/app/service/selling-prices.service';
import { Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { SellingPricesManualService } from 'src/app/service/selling-prices-manual.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';
import { v4 as uuid } from 'uuid';
import { CalMarginService } from 'src/app/service/cal-margin.service';
import { MarginperunitDataGridComponent } from '../marginperunit-data-grid/marginperunit-data-grid.component';

@Component({
  selector: 'app-sellingprice-data-grid',
  templateUrl: './sellingprice-data-grid.component.html',
  styleUrls: ['./sellingprice-data-grid.component.css']
})
export class SellingpriceDataGridComponent implements OnInit {
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;
  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  numberBoxDigi = 0;
  dynamicSellColumns: any[] = [];
  // sellCost
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = moment().year();
  month: any = moment().month();
  formatMonthName = 'MMM-yyyy';
  version: any = 1;

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  accessMenu: any;

  sellPriceData: any = [];
  sellPriceManualData: any = [];
  sellPriceList: any = [];

  @Input() maxVersion: any = 0;
  @Output() onEventClick = new EventEmitter();
  @ViewChild('sellPriceDataGrid', { static: false }) sellPriceDataGrid: DxDataGridComponent;
  @ViewChild('marginPerInitDataGrid') marginPerInitDataGrid: MarginperunitDataGridComponent;
  constructor(
    private sellingPriceService: SellingPricesService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService,
    private calMarginService: CalMarginService
  ) { }

  ngOnInit(): void {
    this.accessMenuList();
  }

  ngAfterViewInit(): void {
    if (this.sellPriceDataGrid && this.sellPriceDataGrid.instance) {
      console.log('numberBoxReadOnly', this.numberBoxReadOnly);
      this.sellPriceDataGrid.instance.updateDimensions()
    }

    setTimeout(() => {
      // this.accessMenuList();
      this.accessMenu = 1;
    }, 500);
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

  onEditData($event) {
    console.log('numberBoxReadOnly', this.numberBoxReadOnly);
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
      _.each(this.dynamicSellColumns, (item) => {
        if (item.cellTemplate === 'cellTemplate') {
          item.cellTemplate = 'cellEditTemplate'
        }
      })
    }
    else {
      this.numberBoxReadOnly = true;

      _.each(this.dynamicSellColumns, (item) => {
        if (item.cellTemplate === 'cellEditTemplate') {
          item.cellTemplate = 'cellTemplate'
        }
      })

    }
    if (this.sellPriceDataGrid && this.sellPriceDataGrid.instance) {
      setTimeout(() => {
        this.sellPriceDataGrid.instance.state(null);
      }, 100);
    }
    this.loaderService.hide();
  }

  onYearChange(year: any, month: any, version: any, calMarginData?: any) {
    this.loaderService.show();
    this.year = year;
    this.month = month;
    this.version = version;
    // this.maxVersion = maxVersion;
    this.listMonth = []
    let dateStart = moment(this.year + '-' + this.month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = {
        year: yearStart,
        month: monthStart,
        monthName: dateStart.format(this.formatMonthName),
      };

      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicSellColumns = [];

    this.dynamicSellColumns.push({
      dataField: 'productName',
      code: 'product',
      caption: 'Product',
      // groupIndex: 0,
      // width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicSellColumns.push({
      dataField: 'unitName',
      code: 'unit',
      caption: 'Unit',
      // width: 100,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicSellColumns.push({
      dataField: 'sourceName',
      code: 'source',
      caption: 'Source',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicSellColumns.push({
      dataField: 'demandName',
      code: 'demand',
      caption: 'Demand',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    this.dynamicSellColumns.push({
      dataField: 'deliveryName',
      code: 'deliveryPoint',
      caption: 'Delivery Point',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    });

    _.each(this.listMonth, (item, index) => {
      this.dynamicSellColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        monthIndex: index,
        caption: item.monthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate,
        fixed: true,
        width: 80
      });
    });



    this.retrieveMasterData().subscribe(res => {
      console.log("sellPrice res :: ", res);
      // this.sellPriceData = res[0];
      this.sellPriceManualData = res[0];
      this.sellPriceData = calMarginData;
      this.retrieveData();
    });

  }

  retrieveMasterData(): Observable<any> {
    // const sellingPrice = this.calMarginService.getList(this.month, this.year, this.version, conditionHeader.costProductTypeId, conditionHeader.costVersionId, conditionHeader.referencePriceVersionId);
    const sellingPriceManual = this.calMarginService.getFollCostManual(this.month, this.year, this.version);
    return forkJoin([sellingPriceManual]);
  }

  retrieveData() {
    // console.log("this.sellPriceData >> ", this.sellPriceData);
    // console.log("this.listMonth >> ", this.listMonth);
    let productData = _.uniqBy(_.cloneDeep(this.sellPriceData), 'productName');
    // prepare data month
    this.sellPriceList = [];
    _.each(productData, (item) => {
      _.each(this.listMonth, (i) => {
        item['id'] = _.toUpper(uuid());
        const findData = _.find(_.cloneDeep(this.sellPriceData), (x) => {
          return x.productName === item.productName && _.toNumber(x.monthValue) === _.toNumber(i.month) && _.toNumber(x.yearValue) === _.toNumber(i.year)
        });

        // find manual
        let manualValue = _.find(_.cloneDeep(this.sellPriceManualData), it => {
          return it.product === item.productName
            && it.source === item.sourceName
            && it.deliveryPoint === item.deliveryName
            && it.demand === item.demandName
            && _.toNumber(it.month) === _.toNumber(i.month)
            && _.toNumber(it.year) === _.toNumber(i.year)
        });

        let sellingPriceValue = (manualValue ? manualValue.value : (findData && findData['sellingPriceValue'] ? findData['sellingPriceValue'] : 0));

        item['M' + i.month + i.year] = (sellingPriceValue ? sellingPriceValue : 0);
        if (manualValue) { item['isManualM' + i.month + i.year] = true; }
        item['formulaM' + i.month + i.year] = (findData && findData['sellingPriceFormulaText'] ? (findData['sellingPriceFormulaText'] ? findData['sellingPriceFormulaText'] : '') : '');

      });

      this.sellPriceList.push(item);
    });

    // console.log("this.sellPriceList >> ", this.sellPriceList);
    this.gridRefresh();
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
          data[row + index]['M' + month + year] = _.trim(i3).replace(',', '')
        }
      });
    });

    return false;
  }

  getDataSave() {
    let datalist = [];
    // console.log("this.sellPriceList : ", this.sellPriceList);
    _.each(this.sellPriceList, (item) => {
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
          data.version = (this.maxVersion ? (_.toNumber(this.maxVersion) + 1) : 1);
          datalist.push(data);
        }
      });
    });
    return datalist;
  }

  gridRefresh() {
    if (this.sellPriceDataGrid && this.sellPriceDataGrid.instance) {
      this.sellPriceDataGrid.instance.state(null)
    }
  }

  getDataMaxVersion(itemTemp: any) {

    // console.log('demand: ',itemTemp.data['demand'],' value',itemTemp.data[itemTemp.column.dataField],'demand: ',this.masterData.sellCostMaxVersion[itemTemp.rowIndex-1]['demand'],' max: ',this.masterData.sellCostMaxVersion[itemTemp.rowIndex-1][itemTemp.column.dataField],' index : ',itemTemp.rowIndex)
    const maxSelling = _.find(this.masterData.sellCostMaxVersion, (item) => {
      return item.id === itemTemp.data['id'];
    });

    // console.log('maxSelling1',maxSelling[itemTemp.column.dataField]);
    // console.log('maxSelling2',this.masterData.sellCostMaxVersion[itemTemp.rowIndex-1][itemTemp.column.dataField]);

    return maxSelling[itemTemp.column.dataField];
  }

  itemClick(event: any, month: any, row: any, columnIndex: any, data: any, item: any, dataField: any) {

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
                  this.sellPriceList[row + index]['M' + month + year] = dataText;
                  this.sellPriceList[row + index]['isPasteM' + month + year] = true;
                  this.sellPriceList[row + index]['isManualM' + month + year] = true;
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
      // console.log("dataEdit :: ", this.dataEdit);
      const title = _.find(this.dynamicSellColumns, (item) => { return item.dataField === dataField; });
      this.titleEdit = "Selling Price : " + title.caption + " : " + item.demandName;
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.dataFieldEdit = dataField;
      this.popupVisible = true;
    }
  }

  popupSaveClick = () => {
    this.popupVisible = false;
    this.onEventClick.emit(this.getDataSave());
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

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

  clearList() {
    this.sellPriceList = [];
    this.gridRefresh();
  }

}
