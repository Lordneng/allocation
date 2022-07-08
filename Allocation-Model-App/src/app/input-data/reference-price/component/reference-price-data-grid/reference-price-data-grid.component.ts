import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin, Subject } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RefPricesService } from 'src/app/service/reference-prices.service';
import { MasterReferencePricesService } from "src/app/service/master-reference-prices.service";
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import data from 'src/app/constants/menu';
import { BaseService } from 'src/app/service/base.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reference-price-data-grid',
  templateUrl: './reference-price-data-grid.component.html',
  styleUrls: ['./reference-price-data-grid.component.css']
})
export class ReferencePriceDataGridComponent implements OnInit {
  dataList: any = [];
  dataListVersion0: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = 2022;
  @Input() month: any = 1;
  monthNow: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  dataFieldEdit: any = {};
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  isRecursive = false;
  recursiveMonth: any = 0;
  dataInfoEditColumn: any = {};
  dataSmartPrice: any = [];
  subject: Subject<any> = new Subject();
  @Input() maxVersion: any = 0;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(private masterCostsService: MasterCostsService,
    private refPricesService: RefPricesService,
    private modalService: BsModalService,
    private masterPricesService: MasterReferencePricesService,
    private loaderService: NgxSpinnerService,
    private baseService: BaseService) { }

  ngOnInit(): void {
    this.subject
      .pipe(debounceTime(100))
      .subscribe((data) => {
        this.setRetrieveData(data);
      }
      );
  }

  onYearChange(year: any, month: any, version: any, maxVersion, dataImport?: any, callback?: any) {
    this.loaderService.show();
    this.month = month;
    this.year = year;
    this.version = version;
    this.maxVersion = maxVersion;
    this.recursiveMonth = month;
    this.listMonth = []
    let dateStart = moment(this.year + '-' + '01' + '-01');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index < 13; index++) {
      const data: any = {
        Year: yearStart,
        Month: monthStart + 1,
        MonthName: dateStart.format(this.formatMonthName),
        visible: true,
        index: index
      }
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'rowOrder',
      code: 'rowOrder',
      caption: '#',
      width: 30,
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'referencePriceNameTo',
      code: 'product',
      caption: 'Product',
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'unit',
      code: 'unit',
      caption: 'Unit',
      width: 80,
      fixed: true,
      fixedPosition: 'left'
    })
    _.each(this.listMonth, (item, index) => {
      this.tmpMonth['M' + item.Month] = '';
      this.dynamicColumns.push({
        dataField: 'M' + item.Month + item.Year,
        name: 'M' + item.Month + item.Year,
        code: index,
        caption: item.MonthName,
        dataType: 'number',
        cellTemplate: this.cellTemplate
      })
    })

    this.retrieveMasterData().subscribe(res => {
      console.log("res :: ", res);
      this.masterData.masterPrices = res[0];
      this.masterData.refPrices = res[1];
      //this.masterData.refPricesVersion0 = _.cloneDeep(res[1]);
      this.masterData.refPricesManual = res[2];
      this.masterData.refPricesActual = res[3];
      this.isRecursive = false;
      this.retrieveData(dataImport);
      if (callback) {
        callback();
      }
    });
  }
  retrieveMasterData(): Observable<any> {
    const masterPrices = this.masterPricesService.getList();
    const refPrices = this.refPricesService.getList(this.year, this.month, this.version);
    const refPricesManual = this.refPricesService.getManual(this.year, this.month, this.version);
    const refPricesActual = this.refPricesService.getActual(this.year, this.month, this.version);
    return forkJoin([masterPrices, refPrices, refPricesManual, refPricesActual]);
  }

  retrieveData(dataImport?: any) {
    this.subject.next(dataImport);


  }
  setRetrieveData(dataImport?: any) {

    this.dataList = [];
    this.dataListVersion0 = [];

    _.each(this.masterData.masterPrices, (itemProduct, index) => {

      let data = _.filter(this.masterData.refPrices, (itemRef) => {
        return itemRef.referencePriceNameTo === itemProduct.referencePriceNameTo;
      });

      let objectPush: any = {
        id: index,
        referencePriceNameTo: itemProduct.referencePriceNameTo,
        referencePriceNameFrom: itemProduct.referencePriceNameFrom,
        rowOrder: itemProduct.rowOrder,
        unit: itemProduct.unit
      };

      _.each(this.listMonth, (itemMonth) => {
        objectPush['isManualM' + itemMonth.Month + itemMonth.Year] = false;
        objectPush['isEditM' + itemMonth.Month + itemMonth.Year] = false;

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year &&
            itemBase.referencePriceNameTo === itemProduct.referencePriceNameTo;
        })

        if (dataFormBase) {
          objectPush['M' + itemMonth.Month + itemMonth.Year] = dataFormBase?.value;
          objectPush['remarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase?.remark;
          objectPush['OLD_M' + itemMonth.Month + itemMonth.Year] = dataFormBase?.value;
        } else {
          objectPush['M' + itemMonth.Month + itemMonth.Year] = 0;
          objectPush['remarkM' + itemMonth.Month + itemMonth.Year] = null;
          objectPush['OLD_M' + itemMonth.Month + itemMonth.Year] = 0;
        }

        const dataManual = _.filter(this.masterData.refPricesManual, (itemManual) => {
          return itemManual.product === itemProduct.referencePriceNameTo;
        })
        _.each(dataManual, (dataManualMonth) => {
          objectPush['M' + dataManualMonth.monthValue + dataManualMonth.yearValue] = dataManualMonth.value;
          objectPush['isManualM' + dataManualMonth.monthValue + dataManualMonth.yearValue] = true;
          objectPush['OLD_M' + itemMonth.Month + itemMonth.Year] = dataFormBase?.value;
        })
        const dataActual = _.filter(this.masterData.refPricesActual, (itemActual) => {
          return itemActual.referencePriceNameTo === itemProduct.referencePriceNameTo && itemActual.unit === itemProduct.unit;
        })
        _.each(dataActual, (dataManualMonth) => {
          objectPush['M' + dataManualMonth.monthValue + dataManualMonth.yearValue] = dataManualMonth.value;
          objectPush['isActualM' + dataManualMonth.monthValue + dataManualMonth.yearValue] = true;
          objectPush['OLD_M' + dataManualMonth.Month + dataManualMonth.Year] = dataFormBase?.value;
        })
      });

      this.dataList.push(objectPush);
      // this.dataListVersion0.push(objectPush);
    });

    this.dataList = _.orderBy(this.dataList, ['rowOrder'], ['asc']);
    // this.dataListVersion0 = _.orderBy(this.dataListVersion0, ['rowOrder'], ['asc']);

    if (this.dataList && this.dataList.length <= 0) {
      _.each(this.masterData.masterPrices, (itemProduct, index) => {
        let objectPush: any = {
          id: index,
          referencePriceNameTo: itemProduct.referencePriceNameTo,
          referencePriceNameFrom: itemProduct.referencePriceNameFrom,
          rowOrder: itemProduct.rowOrder,
          unit: itemProduct.unit
        };

        _.each(this.listMonth, (itemMonth) => {
          objectPush['isManualM' + itemMonth.Month + itemMonth.Year] = false;
        });
        this.dataList.push(objectPush);
        // this.dataListVersion0.push(objectPush);
      });
    }

    if (dataImport != undefined) {
      this.setData(dataImport, 'importOtherYear');
    }

    this.loaderService.hide();
  }

  onEditData($event) {
    this.loaderService.show();
    if (this.numberBoxReadOnly) {
      this.numberBoxReadOnly = false;
    }
    else {
      this.numberBoxReadOnly = true;
    }
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.refresh()
    }
    this.loaderService.hide();
  }

  // onEditData($event) {
  //   this.loaderService.show();
  //   if (this.numberBoxReadOnly) {
  //     this.numberBoxReadOnly = false;
  //     _.each(this.dynamicColumns, (item) => {
  //       if (item.cellTemplate === 'cellTemplate') {
  //         item.cellTemplate = 'cellEditTemplate'
  //       }
  //     })
  //   }
  //   else {
  //     this.numberBoxReadOnly = true;

  //     _.each(this.dynamicColumns, (item) => {
  //       if (item.cellTemplate === 'cellEditTemplate') {
  //         item.cellTemplate = 'cellTemplate'
  //       }
  //     })

  //   }
  //   if (this.dataGridList && this.dataGridList.instance) {
  //     console.log('data', this.dynamicColumns);
  //     setTimeout(() => {
  //       this.dataGridList.instance.state(null);
  //     }, 100);
  //   }
  //   this.loaderService.hide();
  // }
  getDataSave() {
    console.log('this.dataList', this.dataList);
    let dataSave: any = {};
    let _datalist = [];
    let dataManual = [];
    _.each(_.cloneDeep(this.dataList), (item, index) => {
      let data: any = {};
      item.id = undefined;
      item.month = this.month;
      item.version = 0;
      item.year = this.year;
      data.unit = item.unit;
      data.referencePriceNameFrom = item.referencePriceNameFrom;
      data.referencePriceNameTo = item.referencePriceNameTo;
      data.month = this.month;
      data.version = 0;
      data.year = this.year;

      _.each(this.listMonth, (itemMonth) => {
        let productData: any = {}

        productData.unit = data.unit;
        productData.referencePriceNameFrom = data.referencePriceNameFrom;
        productData.referencePriceNameTo = data.referencePriceNameTo;
        productData.rowOrder = data.rowOrder
        productData.version = data.version;
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.month = data.month;
        productData.year = data.year;
        productData.remark = item["remarkM" + itemMonth.Month + itemMonth.Year];

        if (item['isManualM' + itemMonth.Month + itemMonth.Year] === true) {
          dataManual.push({
            year: this.year,
            month: this.month,
            yearValue: itemMonth.Year,
            monthValue: itemMonth.Month,
            cost: item.cost,
            product: item.referencePriceNameTo,
            value: _.toNumber(item['M' + itemMonth.Month + itemMonth.Year]),
            remark: item['remarkM' + itemMonth.Month + itemMonth.Year],
            version: data.varsion,
          });
          productData.value = _.toNumber(item['OLD_M' + itemMonth.Month + itemMonth.Year]);
        } else {
          productData.value = _.toNumber(item['M' + itemMonth.Month + itemMonth.Year]);
        }
        _datalist.push(productData);
      })

    })
    //datalist =_.omit(datalist,'id');
    //datalist =Object.values(_.omit(datalist,'id'));
    dataSave.dataList = _datalist;
    dataSave.dataManual = dataManual;
    return dataSave;
  }

  getDataVersion0(itemTemp: any, dataField: any) {
    return itemTemp['OLD_' + dataField];
    // return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  onIsManualValueChange(values: any): void {
    // console.log(values.currentTarget.checked);
    if (values.currentTarget.checked === false) {
      this.dataEdit[this.dataFieldEdit] = this.dataEdit['OLD_' + this.dataFieldEdit];
    }
  }

  setData(data: any, month: any) {
    console.log('data ', data);
    // console.log('this.dataList ===> ', this.dataList);
    _.each(this.dataList, (item) => {
      const dataExcel = _.filter(data, (itemExcel) => {
        // return itemExcel.product === item.referencePriceNameFrom
        return this.baseService.replaceCpeciaCharacters(itemExcel.product) === this.baseService.replaceCpeciaCharacters(item.referencePriceNameFrom)
      })
      // console.log("dataExcel >> ", dataExcel);
      if (dataExcel) {
        _.each(dataExcel, (itemProduct) => {
          //ตั้งแต่เดือนปัจจุบันให้ใช้ month
          _.each(this.listMonth, (itemMonth) => {
            let data = _.toNumber(_.trim(_.replace(itemProduct['m' + itemMonth.index], ',', '')));

            if (data) {
              item['isPasteM' + itemMonth.Month + itemMonth.Year] = true;
              // if (itemProduct.product === 'PP Yarn : CFR SEA') {
              const formula = _.find(_.cloneDeep(this.masterData.masterPrices), mProduct => { return mProduct.referencePriceNameFrom == itemProduct.product }).formula;
              data = eval(data + formula);
              // }

              if (!item['isManualM' + itemMonth.Month + itemMonth.Year]) {
                item['M' + itemMonth.Month + itemMonth.Year] = data;
              }
            }
          });
        })

      }
    })

    if (month != 'importOtherYear') {
      this.loaderService.hide();
    }

  }

  onSearch($event: any) {
    this.modalRef = this.modalService.show(this.template, this.config);
  }


  itemClick(event: any, row: any, columnIndex: any, data: any, item: any, dataField: any) {
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.field = dataField;
    this.dataInfoOld = _.cloneDeep(data);
    if (event.itemData.text === 'Paste') {
      navigator.clipboard.readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningIndex = columnIndex;
            _.each(i2.split('\t'), (i3, index3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));

              if (dataText && _.isNumber(dataText)) {
                // const refTo = _.replace(data[row + index].referencePriceNameTo, new RegExp(' ', 'g'), '');
                // if (refTo === 'PP:CFRSEA') {
                // const formula = _.find(_.cloneDeep(this.masterData.masterPrices), mProduct => { return mProduct.referencePriceNameFrom == data[row + index].referencePriceNameFrom && mProduct.referencePriceNameTo == data[row + index].referencePriceNameTo && mProduct.unit == data[row + index].unit }).formula;
                // dataText = eval(dataText + formula);
                //comment ไว้ก่อนมันงง
                // }

                if (columnIndex <= 12) {
                  let month = this.listMonth[runningIndex].Month;
                  let year = this.listMonth[runningIndex].Year;
                  if (data[row + index]['isManualM' + month + year] !== true) {
                    data[row + index]['isPasteM' + month + year] = true;
                    data[row + index]['M' + month + year] = dataText;
                  }
                  runningIndex++;
                }

              } else {
                Swal.fire({
                  title: 'ไม่สารถนำข้อมูลมาแสดงเพิ่ม',
                  text: 'เนื่องจากข้อมูลที่ Copy มาไม่เป็นตัวเลข',
                  icon: 'error',
                  showConfirmButton: true,
                  confirmButtonText: 'ปิด'
                  //timer: 1000
                })
                return false;
              }

            });
          });
        })

        // (A3) OPTIONAL - CANNOT ACCESS CLIPBOARD
        .catch(err => {
          // alert("Please allow clipboard access permission");
        });

      setTimeout(() => {
        this.dataInfo = data;
      }, 50);

    } else if (event.itemData.text === 'Edit') {
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      })
      this.titleEdit = title.caption + " : " + item.referencePriceNameTo;
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.dataFieldEdit = dataField;
      this.popupVisible = true;

      setTimeout(() => {
        this.dataInfo = data;
      }, 50);
    }
  }

  popupSaveClick = () => {
    // console.log('this.dataEdit >> ', this.dataEdit);
    if (this.dataEdit[this.dataInfoEditColumn['field']] !== this.dataEditOld[this.dataInfoEditColumn['field']]) {
      this.dataEdit['isPaste' + this.dataInfoEditColumn['field']] = true;
      this.gridRefresh();
    }
    this.popupVisible = false;
  }
  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }
  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 2) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + (e.column.dataField)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');

    }
  }

  gridRefresh() {
    if (this.dataGrid && this.dataGrid.instance) {
      setTimeout(() => {
        this.dataGrid.instance.refresh();
      }, 50);
    }
  }

  setDataFormSmartPrice(data) {
    this.dataSmartPrice = data;
    console.log('this.dataSmartPrice', this.dataSmartPrice)
    _.each(this.dataList, (item) => {
      let data = _.filter(this.dataSmartPrice, (itemSmartPrice) => {
        return itemSmartPrice.referencePriceNameTo === item.referencePriceNameTo && itemSmartPrice.unit === item.unit
      })
      _.each(data, (itemSmartPrice) => {
        item['M' + itemSmartPrice.monthValue + itemSmartPrice.yearValue] = itemSmartPrice.value;
        item['isPasteM' + itemSmartPrice.monthValue + itemSmartPrice.yearValue] = true;
      })

    })
    this.gridRefresh();
  }
}
