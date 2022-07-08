import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import { MasterSupplierService } from 'src/app/service/master-supplier.service';
import Swal from 'sweetalert2';
import { MasterProductsService } from 'src/app/service/master-products.service';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-ability-refinery-data-grid',
  templateUrl: './ability-refinery-data-grid.component.html',
  styleUrls: ['./ability-refinery-data-grid.component.css']
})
export class AbilityRefineryDataGridComponent implements OnInit {

  dataList: any = [];
  dataListOld: any = [];
  listMonth = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };
  popupVisible = false;

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  productData = [{ id: 0, product: 'LPG', rowOrder: 0 }];
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = '2021';
  month: any = moment().format('MM');
  formatMonthName = 'MMM-yyyy';
  formula = '{0} * 24 * {1} / 1000';
  version: any = 1;
  tmpMonth: any = {};
  isHistory = false;
  accessMenu: any;

  @Input() maxVersion: any = 0;
  @ViewChild('dataGridList', { static: false }) dataGridList: DxDataGridComponent;
  @ViewChild('targetGroup', { static: false }) validationGroup: DxValidationGroupComponent;

  constructor(private abilityRefineryService: AbilityRefineryService,
    private masterSupplierService: MasterSupplierService,
    private masterProductService: MasterProductsService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService) { }

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
    let dateStart = moment(this.year + '-' + month + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      this.listMonth.push({ Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName) });
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'supplier',
      code: 'supplier',
      caption: 'Supplier',
      fixed: true,
      width: 180,
      fixedPosition: 'left'
    })

    _.each(this.listMonth, (item, index) => {
      this.dynamicColumns.push({
        dataField: 'M' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate
      })
    })

    // if (this.isHistory) {
    this.retrieveMasterDataHistory().subscribe(res => {
      this.masterData.abilityRefinery = res[0];
      this.masterData.masterProducts = res[2];
      this.masterData.masterSuppliers = res[3];
      this.retrieveData();
    });
    // } else {
    //   this.retrieveMasterData().subscribe(res => {
    //     this.masterData.abilityRefinery = res[0];
    //     this.masterData.masterProducts = res[1];
    //     this.masterData.masterSuppliers = res[2];
    //     this.retrieveData();
    //   });
    // }
  }

  retrieveMasterData(): Observable<any> {
    const abilityRefinery = this.abilityRefineryService.getList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getActiveList();
    const masterSuppliers = this.masterSupplierService.getList();

    return forkJoin([abilityRefinery, masterProducts, masterSuppliers]);
  }

  retrieveMasterDataHistory(): Observable<any> {
    const abilityRefinery = this.abilityRefineryService.getListHistory(this.year, this.month, this.version);
    const abilityRefineryMaxVersion = this.abilityRefineryService.getList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getActiveList();
    const masterSuppliers = this.masterSupplierService.getList();
    return forkJoin([abilityRefinery, abilityRefineryMaxVersion, masterProducts, masterSuppliers]);
  }

  retrieveData() {
    let datas: any = [];

    const lpg = _.find(this.masterData.masterProducts, (itemProduct) => {
      return itemProduct.productCode === 'LPG';
    });

    _.each(this.masterData.masterSuppliers, (item, index) => {

      let refineryItem: any = {};
      refineryItem.id = index;
      refineryItem.productId = lpg.id;
      refineryItem.rowOrder = item.rowOrder;
      refineryItem.product = lpg.productName;
      refineryItem.productCode = lpg.productCode;
      refineryItem.supplierId = item.id;
      refineryItem.supplier = item.fullName;

      let data = _.filter(this.masterData.abilityRefinery, (itemProduct) => {
        return itemProduct.supplierId === item.id;
      });

      _.each(this.listMonth, (itemMonth) => {

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
        })

        if (dataFormBase) {
          refineryItem['M' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
          refineryItem['RemarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
        } else {
          refineryItem['M' + itemMonth.Month + itemMonth.Year] = 0;
          refineryItem['RemarkM' + itemMonth.Month + itemMonth.Year] = null;
        }

        refineryItem['isPasteM' + itemMonth.Month + itemMonth.Year] = false;
        refineryItem['isEditM' + itemMonth.Month + itemMonth.Year] = false;
      });
      datas.push(refineryItem);
    });

    this.dataList.data = datas;
    this.loaderService.hide();
  }

  onPaste(event: any, row: any, data: any) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        if (index3 <= 12) {
          let month = this.listMonth[index3].Month;
          let year = this.listMonth[index3].Year;
          data[row + index]['M' + month + year] = _.trim(i3).replace(',', '')
        }
      });
    });

    return false;
  }

  getDataSave() {
    let dataSave: any = {};
    let datalist = [];

    _.each(this.dataList.data, (itemList) => {

      let data: any = {};
      data.productId = itemList['productId'];
      data.product = itemList['product'];
      data.productCode = itemList['productCode'];
      data.supplierId = itemList['supplierId'];
      data.supplier = itemList['supplier'];
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder'])
      data.version = this.version;

      _.each(this.listMonth, (itemMonth) => {

        let productData: any = {}
        productData.product = itemList['product'];
        productData.productId = itemList['productId'];
        productData.productCode = itemList['productCode'];
        productData.supplierId = itemList['supplierId'];
        productData.supplier = itemList['supplier'];
        productData.year = data.year;
        productData.month = data.month;
        productData.rowOrder = data.rowOrder
        productData.version = data.version;
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.value = itemList["M" + itemMonth.Month + itemMonth.Year];
        productData.remark = itemList["RemarkM" + itemMonth.Month + itemMonth.Year];
        datalist.push(productData);
      })

    })

    dataSave.dataList = datalist;

    return dataSave;
  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.data[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  onSubmit() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {
        if (this.dataInfoOld['M' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['M' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }
        if (this.dataInfoOld['RemarkM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['RemarkM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.data[this.rowEdit]['isEditM' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }
        // this.dataList.data[this.rowEdit] = this.dataInfo;
        this.popupVisible = false;
        if (this.dataGridList && this.dataGridList.instance) {
          this.dataGridList.instance.refresh()
        }
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

  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 0) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
    if (e.rowType === "data" && e.data && e.data["isEdit" + e.column.dataField] === true) {
      e.cellElement.classList.add('backgroundColorEdit');
    }
  }

  itemClick($event, data: any, row: any, columnIndex: any, field: any) {
    console.log('itemClick -> data', data)
    const title = 'Setting Ability Khm';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.field = field;

    if ($event.itemData.text === 'Edit') {
      this.dataInfo = data;
      month = this.listMonth[columnIndex].Month;
      year = this.listMonth[columnIndex].Year;
      this.dataInfoEditColumn.year = year;
      this.dataInfoEditColumn.month = month;
      this.dataInfoEditColumn.title = `${title} : ${month}/${year}`;
      this.popupVisible = true;
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
                if (runningIndex <= 12) {
                  let month = this.listMonth[runningIndex].Month;
                  let year = this.listMonth[runningIndex].Year;
                  this.dataList.data[row + index]['M' + month + year] = dataText;
                  this.dataList.data[row + index]['isPasteM' + month + year] = true;
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
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });

      this.dataInfo = data;
      //this.dataList.data[this.rowEdit] = this.dataInfo;
    }
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

}
