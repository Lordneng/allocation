import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';
import { MasterProductsService } from 'src/app/service/master-products.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as _ from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-ability-plan-data-grid-shipment',
  templateUrl: './ability-plan-data-grid-shipment.component.html',
  styleUrls: ['./ability-plan-data-grid-shipment.component.css']
})
export class AbilityPlanDataGridShipmentComponent implements OnInit {

  dataList: any = [];
  dataListOld: any = [];
  listMonth = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };

  isCollapsedAnimated = false;
  numberBoxFormat = '#,##0';

  dynamicColumns: any[] = [];
  productData = [{ id: 0, product: 'LPG', rowOrder: 0 }, { id: 1, product: 'NGL', rowOrder: 1 }];
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';

  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};
  isHistory = false;
  popupVisible = false;
  accessMenu: any;

  @Input() year: any = 2021;
  @Input() numberBoxDigi: any = 0;
  @Input() month: any = 1;
  @Input() maxVersion: any = 0;
  @Input() defaultVersion: boolean = true;
  @ViewChild('dataGridListShipment', { static: false }) dataGridListShipment: DxDataGridComponent;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  constructor(private abilityPlanKhm: AbilityPlanKhmService,
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
      dataField: 'product',
      code: 'product',
      caption: 'NGL Shipment',
      fixed: true,
      width: 180,
      fixedPosition: 'left'
    })
    _.each(this.listMonth, (item, index) => {
      this.dynamicColumns.push({
        dataField: 'MS' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate
      })
    })

    if (this.isHistory) {
      this.loaderService.show();
      this.retrieveMasterDataHistory().subscribe(res => {
        this.masterData.abilityPlanKhm = res[0];
        this.masterData.masterProducts = res[2];
        this.retrieveData();
        this.loaderService.hide();
      });
    } else {
      this.loaderService.show();
      this.retrieveMasterData().subscribe(res => {
        this.masterData.abilityPlanKhm = res[0];
        this.masterData.masterProducts = res[1];
        this.retrieveData();
        this.loaderService.hide();
      });
    }
  }

  retrieveMasterData(): Observable<any> {
    const abilityPlanKhm = this.abilityPlanKhm.getList(this.year, this.month, this.version)
    const masterProducts = this.masterProductService.getInActiveList();
    return forkJoin([abilityPlanKhm, masterProducts])
  }

  retrieveMasterDataHistory(): Observable<any> {
    const abilityPlanKhm = this.abilityPlanKhm.getListHistory(this.year, this.month, this.version);
    const abilityPlanKhmMaxVersion = this.abilityPlanKhm.getList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getInActiveList();
    return forkJoin([abilityPlanKhm, abilityPlanKhmMaxVersion, masterProducts]);
  }

  retrieveData() {
    let datas: any = [];
    console.log(this.masterData.masterProducts);
    this.masterData.khm = _.filter(this.masterData.masterProducts, (itemProduct) => {
      return itemProduct.productCode === 'NGL-SHIPMENT';
    });

    _.each(this.masterData.khm, (item, index) => {

      let productItem: any = {};
      productItem.id = index;
      productItem.productId = item.id;
      productItem.rowOrder = item.rowOrder;
      productItem.product = item.productName;

      let data = _.filter(this.masterData.abilityPlanKhm, (itemProduct) => {
        return itemProduct.productId === item.id;
      });
      _.each(this.listMonth, (itemMonth, indexMonth) => {

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
        })

        if (dataFormBase) {
          productItem['MS' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
          productItem['RemarkMS' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
        } else {
          productItem['MS' + itemMonth.Month + itemMonth.Year] = 0;
          productItem['RemarkMS' + itemMonth.Month + itemMonth.Year] = null;
        }


        productItem['isPasteMS' + itemMonth.Month + itemMonth.Year] = false;
        productItem['isEditMS' + itemMonth.Month + itemMonth.Year] = false;

      });
      datas.push(productItem);
    });

    this.dataList.shipment = datas;
    this.loaderService.hide();
  }

  onPaste(event: any, columnIndex: any, row: any, data: any) {
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

  onSubmit() {
    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {

        this.dataList.shipment[this.rowEdit] = this.dataInfo;
        this.popupVisible = false;

        if (this.dataInfoOld['MS' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] !== this.dataInfo['MS' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year]) {
          this.dataList.shipment[this.rowEdit]['isEditMS' + this.dataInfoEditColumn.month + this.dataInfoEditColumn.year] = true;
        }

        if (this.dataGridListShipment && this.dataGridListShipment.instance) {
          this.dataGridListShipment.instance.refresh()
        }
      }
    }
  }

  onCancel() {
    this.dataList.shipment[this.rowEdit] = _.clone(this.dataInfoOld);
    this.popupVisible = false;
  }

  getDataSave() {
    let dataSave: any = {};
    let datalist = [];

    _.each(this.dataList.shipment, (itemList) => {

      let data: any = {};
      data.productId = itemList['productId'];
      data.product = itemList['product'];
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder'])
      data.version = this.version;

      _.each(this.listMonth, (itemMonth) => {

        let productData: any = {}
        productData.product = itemList['product'];
        productData.productId = itemList['productId'];

        productData.year = data.year;
        productData.month = data.month;
        productData.rowOrder = data.rowOrder
        productData.version = data.version;
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.value = itemList["MS" + itemMonth.Month + itemMonth.Year];
        productData.remark = itemList["RemarkMS" + itemMonth.Month + itemMonth.Year];
        datalist.push(productData);
      })

    })

    dataSave.dataList = datalist;

    return dataSave;
  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.shipment[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  getDataVersion0(item: any, itemTemp: any) {
    return item.dataVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  onCellPrepared(e) {
    if (e.rowType === "data") {
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

  itemShipmentClick($event, data: any, row: any, columnIndex: any, field: any) {
    console.log('itemClick -> data', data)
    const title = 'Setting NGL Shipment';
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
                  this.dataList.shipment[row + index]['MS' + month + year] = dataText;
                  this.dataList.shipment[row + index]['isPasteMS' + month + year] = true;
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
      this.dataList.shipment[this.rowEdit] = this.dataInfo;
    }
  }

}
