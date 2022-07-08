import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { TankCapService } from 'src/app/service/tankcap.service';
import { MasterTankCapService } from "src/app/service/master-tank-cap.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-tank-cap-data-grid',
  templateUrl: './tank-cap-data-grid.component.html',
  styleUrls: ['./tank-cap-data-grid.component.css']
})
export class TankCapDataGridComponent implements OnInit {
  dataList: any = [];
  dataListOld: any = [];
  listMonth = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dynamicColumnsVisible: any[] = [];
  dynamicColumnsSelected: any[] = [];
  modalRef: BsModalRef;
  popupHeight: number = 550;
  productData = [{ id: 0, product: 'GSP 6', rowOrder: 0 }];
  masterData: any = {};
  listData: any = [];
  dataDayMonth: any = [];
  cellTemplate = 'cellTemplate';
  cellUnitTemplate = 'cellUnitTemplate';
  refineryCellTemplate = 'refineryCellTemplate';
  year: any = '2022';
  month: any = moment().format('MM');
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};
  isHistory = false;
  popupVisible = false;
  maxLength: any = 31;
  accessMenu: any;

  @Input() maxVersion: any = 0;
  @Input() defaultVersion: boolean = true;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dataGridList', { static: false }) dataGridList: DxDataGridComponent;
  @ViewChild('editTemplate', { static: true }) template: TemplateRef<any>;
  @Output() onEventClick = new EventEmitter();

  constructor(private TankCapService: TankCapService,
    private masterProductService: MasterTankCapService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    // let dateStart = moment('2021-01-01');
    // let dateEnd = moment('2021-12-01');
    // for (let thisDate = dateStart; thisDate <= dateEnd; thisDate = moment(thisDate).add(1,'M')) {
    //   this.dataDayMonth['dayMonthM' + (thisDate.month() + 1) + thisDate.year()] = thisDate.daysInMonth();

    // }

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

  onYearChange(year: any, month: any, version: any, maxVersion: any, defaultVersion: any, isHistory: any) {
    // this.loaderService.show();
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;
    this.defaultVersion = defaultVersion;
    this.listMonth = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = { Year: yearStart, Month: monthStart, MonthName: dateStart.format(this.formatMonthName), visible: true }
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'product',
      code: 'product',
      caption: 'Product',
      fixed: true,
      width: 180,
      fixedPosition: 'left',
      cellTemplate: this.refineryCellTemplate
    },
      {
        dataField: 'unit',
        code: 'unit',
        caption: 'Unit',
        fixed: true,
        width: 100,
        fixedPosition: 'left',
        cellTemplate: this.cellUnitTemplate
      })
    _.each(this.listMonth, (item, index) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.Month + item.Year,
        name: 'formulaM' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate
      })

    })

    if (this.isHistory) {
      this.retrieveMasterDataHistory().subscribe((res) => {
        this.masterData.TankCap = res[0];
        this.masterData.TankCapForm = res[1];
        this.masterData.masterProducts = res[2];
        this.retrieveData();
      });
    } else {
      this.retrieveMasterData().subscribe((res) => {
        console.log('res....', res);
        this.masterData.TankCap = res[0];
        this.masterData.TankCapForm = res[1];
        this.masterData.masterProducts = res[2];
        this.retrieveData();
      });
    }
  }

  retrieveMasterData(): Observable<any> {
    console.log('this.year', this.year);
    const TankCap = this.TankCapService.getList(this.year, this.month, this.version);
    const TankCapForm = this.TankCapService.getFormList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getList();
    return forkJoin([TankCap, TankCapForm, masterProducts]);
  }

  retrieveMasterDataHistory(): Observable<any> {
    const TankCap = this.TankCapService.getListHistory(this.year, this.month, this.version);
    const TankCapForm = this.TankCapService.getFormList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getList();
    return forkJoin([TankCap, TankCapForm, masterProducts]);
  }

  async retrieveData(isRetrospective: any = true) {
    let datas: any = [];

    _.each(this.masterData.masterProducts, (item, index) => {

      let productItem: any = {};
      productItem.id = index;
      productItem.unit = item.unit;
      productItem.product = item.productName;
      productItem.productionPlant = item.productionPlant;
      productItem.type = item.productCostName;
      productItem.rowOrder = item.rowOrder;
      productItem.modelId = item.modelId;
      productItem.tankCapType = item.tankCapType;

      let data = _.filter(this.masterData.TankCap, (itemProduct) => {
        return itemProduct.product === item.productName;
      });

      let dataForm = _.find(this.masterData.TankCapForm, (itemProduct) => {
        return itemProduct.product === item.productName;
      });

      productItem.valMonthM = dataForm ? dataForm.value : 0;
      productItem.capacityM = dataForm ? dataForm.capacity : 0;
      productItem.isAll = dataForm ? dataForm.isAll : true;

      _.each(this.listMonth, (itemMonth) => {

        console.log('Month', itemMonth.Month);
        console.log('Year', itemMonth.Year);

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
        })

        if (dataFormBase) {
          productItem['M' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
          productItem['valMonthM' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
          productItem['capacityM' + itemMonth.Month + itemMonth.Year] = dataFormBase.capacity;
          productItem['RemarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
        } else {
          productItem['M' + itemMonth.Month + itemMonth.Year] = 0;
          productItem['valMonthM' + itemMonth.Month + itemMonth.Year] = 0;
          productItem['capacityM' + itemMonth.Month + itemMonth.Year] = 0;
          productItem['RemarkM' + itemMonth.Month + itemMonth.Year] = null;
        }
      });

      datas.push(productItem);
    })

    this.dataList.data = datas;

    this.calData();
    this.calTotalData();
    this.loaderService.hide();
  }

  onPaste(event: any, columnIndex: any, row: any, data: any) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        if (index3 <= 13) {
          let month = this.listMonth[index3].Month;
          let year = this.listMonth[index3].Year;
          data[row + index]['valMonthM' + month + year] = _.trim(i3).replace(',', '')
        }
      });
    });

    return false;
  }

  calData() {
    console.log(this.dataList.data)
    _.each(this.dataList.data, (item, indexs) => {

      _.each(this.listMonth, (itemMonth) => {
        item["M" + itemMonth.Month + itemMonth.Year] = item['valMonthM' + itemMonth.Month + itemMonth.Year];
      });
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

    if (this.dataGridList && this.dataGridList.instance) {
      this.dataGridList.instance.refresh()
    }

    this.loaderService.hide();
  }

  onSubmit() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        if (this.dataInfo['valMonth' + this.dataInfoEditColumn['field']] !== this.dataInfoOld['valMonth' + this.dataInfoEditColumn['field']]) {
          this.dataInfo['isPaste' + this.dataInfoEditColumn['field']] = true;
          // this.dataList[this.rowEdit]['isPaste' + this.dataInfoEditColumn['field']] = true;
          // console.log("this.dataList >> ", this.dataList);
          this.stateGrid();
        }
        // this.dataList.data[this.rowEdit] = this.dataInfo;
        if (this.dataInfoEditColumn.isFrom && this.dataInfo.isAll) {
          this.onAppltAll(this.dataList.data[this.rowEdit])
        }
        this.calData();
        this.calTotalData();
        this.popupVisible = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
      }
    }
  }

  stateGrid() {
    if (this.dataGridList && this.dataGridList.instance) {
      setTimeout(() => {
        this.dataGridList.instance.state(null);
      }, 200);
    }
  }

  onCancel() {
    // this.dataList.data[this.rowEdit] = _.clone(this.dataInfoOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }

  itemClick($event, data: any, row: any, columnIndex: any, field: any, isFrom: boolean) {
    console.log('itemClick -> data', data)
    const title = 'Setting Tank Cap';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.isFrom = isFrom;
    this.dataInfoEditColumn.field = field;
    this.dataInfoEditColumn.product = data.product;
    this.dataInfoEditColumn.productionPlant = data.productionPlant;
    this.dataInfoEditColumn.type = data.type;

    if ($event.itemData.text === 'Edit') {

      if (isFrom) {
        this.dataInfoEditColumn.title = `${title} : All`;
        this.popupHeight = 400;
      } else {
        this.popupHeight = 550;
        month = this.listMonth[columnIndex].Month;
        year = this.listMonth[columnIndex].Year;
        this.dataInfoEditColumn.title = `${title} : ${month}/${year}`;
        this.maxLength = moment(year + '-' + month + '-01').daysInMonth();
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
            _.each(i2.split('\t'), (i3,) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              console.log('dataText', dataText);
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                if (runningIndex < 13) {
                  if (this.dataList.data[row + index]['type'] != 'Total') {
                    let month = this.listMonth[runningIndex].Month;
                    let year = this.listMonth[runningIndex].Year;
                    this.dataList.data[row + index]['valMonthM' + month + year] = dataText;
                    this.dataList.data[row + index]['isPasteM' + runningIndex] = true;
                    runningIndex++;
                    this.calData();
                  } else {
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
                this.calTotalData();
              }, 100);
            }

          });
        })
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });

      this.dataInfo = data;
      // this.dataList.data[this.rowEdit] = this.dataInfo;
    }
  }

  calTotalData() {

    const filterTotal = _.filter(_.cloneDeep(this.dataList.data), (x) => { return x.type == 'Total' });

    if (filterTotal.length) {
      _.each(filterTotal, (total) => {
        const totalArr = total.productionPlant.split("/");
        const filterProducts = [];
        _.each(totalArr, (m) => {
          const filterProduct = (_.filter(_.cloneDeep(this.dataList.data), (x) => { return x.productionPlant == m && x.type != 'Total' }));
          for (var i = 0; i < filterProduct.length; i++) {
            filterProducts.push(filterProduct[i]);
          }
        })
        _.each(this.listMonth, (x) => {
          let output = _.sumBy(filterProducts, 'valMonthM' + x['Month'] + x['Year']);
          const findTotal = _.find(this.dataList.data, { productionPlant: total.productionPlant, type: 'Total' });
          findTotal['valMonthM' + x['Month'] + x['Year']] = output;
          findTotal['M' + x['Month'] + x['Year']] = output;
        })
      })
    }
  }

  onEditModal() {
    this.popupVisible = false;
  }

  getDataSave() {
    let dataSave: any = {};
    let datalist = [];
    let dataForm = [];
    console.log('this.dataList.data', this.dataList.data)
    _.each(this.dataList.data, (itemList) => {
      let data: any = {};
      data.productionPlant = itemList['productionPlant'];
      data.product = itemList['product'];
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder'])
      data.version = this.version;
      data.modelId = itemList['modelId'];
      data.tankCapType = itemList['tankCapType'];

      let form: any = {}
      form.product = data.product;
      form.productionPlant = data.productionPlant;
      form.year = data.year;
      form.month = data.month;
      form.rowOrder = data.rowOrder;
      form.value = itemList['valMonthM'];
      form.capacity = itemList['capacityM'];
      form.version = data.version
      form.isAll = itemList['isAll'];
      form.modelId = itemList['modelId'];
      form.tankCapType = itemList['tankCapType'];
      dataForm.push(form);

      _.each(this.listMonth, (itemMonth) => {
        let productData: any = {}
        productData.product = itemList['product'];
        productData.unit = itemList['unit'];
        productData.productionPlant = itemList['productionPlant'];
        productData.modelId = itemList['modelId'];
        productData.tankCapType = itemList['tankCapType'];
        productData.year = data.year;
        productData.month = data.month;
        productData.rowOrder = data.rowOrder
        productData.version = data.version;
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.value = itemList["valMonthM" + itemMonth.Month + itemMonth.Year];
        productData.capacity = itemList["capacityM" + itemMonth.Month + itemMonth.Year];
        productData.remark = itemList["RemarkM" + itemMonth.Month + itemMonth.Year];
        datalist.push(productData);
      })

    })

    dataSave.dataList = datalist;
    dataSave.dataForm = dataForm;
    // console.log('dataSave',dataSave);
    return dataSave;
  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.data[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  onAppltAll(data: any) {
    _.each(this.listMonth, (item) => {
      const date = moment(item.year + '-' + item.month + '-01')
      if (data["valMonthM" + item.Month + item.Year] !== data.valMonthM) {
        data["isPasteM" + item.Month + item.Year] = true;
      }
      data["valMonthM" + item.Month + item.Year] = data.valMonthM;
      data["capacityM" + item.Month + item.Year] = data.capacityM;
      data["M" + item.Month + item.Year] = data.valMonthM;
    })

    console.log(data)
  }

  valMonthValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  isCalculateValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  onDefaultVersionChange($event) {
    this.defaultVersion = $event.value;
    this.onEventClick.emit(this.defaultVersion);
  }

  onCellPrepared(e) {

    if (e.rowType === "data" && e.data.type !== 'Total') {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 2)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data.type == 'Total') {
      e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#ECEFF1';
    }
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

}
