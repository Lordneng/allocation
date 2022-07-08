import { Component, Input, OnInit, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { MasterCostProductsTypesService } from 'src/app/service/master-product-cost-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleChanges } from '@angular/core';
import { CostsService } from 'src/app/service/costs.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/service/base.service';
@Component({
  selector: 'app-cost-data-grid',
  templateUrl: './cost-data-grid.component.html',
  styleUrls: ['./cost-data-grid.component.css']
})
export class CostDataGridComponent implements OnInit {
  dataList: any = [];
  listMonth = [];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  isOpen: any = true;
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  year: any = 2021;
  @Input() month: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  @Input() maxVersion: any = 0;
  @Input() accessMenu: any;

  popupVisible = false;
  dataEdit: any = {};
  dataEditOld: any = {};
  titleEdit: any = "";
  rowEdit: any = 0;
  columnEdit: any = 0;
  dataFieldEdit: any = {};

  recursiveMonth: any = 0;
  dataInfoEditColumn: any = {};
  monthNow: any = 1;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChildren(DxDataGridComponent) dataGrids: QueryList<DxDataGridComponent>
  constructor(
    private masterCostsService: MasterCostsService,
    private masterCostProductTypesService: MasterCostProductsTypesService,
    private costsService: CostsService,
    private loaderService: NgxSpinnerService,
    private baseService: BaseService) {

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
  }

  onYearChange(year: any, month: any, version: any, maxVersion, dataImport?: any, callback?: any) {
    this.year = year;
    this.month = month;
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
      // groupIndex: 0,
      width: 180,
      fixed: true,
      fixedPosition: 'left'
    })

    _.each(this.listMonth, (item, index) => {
      // this.dynamicColumns.push({  // {
      //   dataField: 'isManualM' + item.Month,
      //   code: item.Month,
      //   caption: 'manual',
      //   dataType: 'boolean',
      //   cellTemplate: this.cellTemplate
      // })
      this.dynamicColumns.push({  // {
        dataField: 'M' + item.Month + item.Year,
        name: 'M' + item.Month + item.Year,
        caption: item.MonthName,
        code: index,
        dataType: 'number',
        cellTemplate: this.cellTemplate
      })
    })

    this.retrieveMasterData().subscribe(res => {
      this.masterData.masterCosts = res[0];
      this.masterData.masterProducts = res[1];
      this.masterData.costs = res[2];
      // this.masterData.costsVersionOriginals = _.cloneDeep(res[2]);
      this.masterData.costManual = res[3];
      this.masterData.costActual = res[4];
      this.retrieveData(dataImport);
      if (callback) {
        callback();
      }
    });
  }

  retrieveMasterData(): Observable<any> {
    const masterCost = this.masterCostsService.getList();
    const masterProduct = this.masterCostProductTypesService.getList();
    const costs = this.costsService.getList(this.year, this.month, this.version);
    const costManual = this.costsService.getManual(this.year, this.month, this.version);
    const costActual = this.costsService.getActual(this.year, this.month, this.version);
    return forkJoin([masterCost, masterProduct, costs, costManual, costActual]);
  }

  retrieveData(dataImport?: any) {
    // if (this.masterData.costs && this.masterData.costs.length === 0) {
    //   // console.log("this.month >> ", this.month);
    //   // console.log("this.masterData.costs >> ", this.masterData.costs);
    //   // this.monthNow = this.month;
    //   this.recursiveMonth = (this.recursiveMonth - 1);
    //   this.month = this.recursiveMonth;
    //   this.version = 0;
    //   if (this.month > 0) {
    //     this.retrieveMasterData().subscribe(res => {
    //       console.log('master', res)
    //       this.masterData.masterCosts = res[0];
    //       this.masterData.masterProducts = res[1];
    //       this.masterData.costs = res[2];
    //       this.masterData.costsVersionOriginals = _.cloneDeep(res[2]);
    //       this.masterData.costManual = res[3];
    //       // this.month = this.monthNow;
    //       this.retrieveData(dataImport);
    //     });
    //   }
    // }
    _.each(this.masterData.masterCosts, (item) => {
      item.dataList = [];
      item.dataListVersionOriginals = [];
      let data = _.filter(this.masterData.costs, (itemCost) => {
        return itemCost.cost === item.productCostName;
      });

      _.each(this.masterData.masterProducts, (itemProduct) => {
        let productItem: any = {};
        productItem.id = itemProduct.id;
        productItem.product = itemProduct.name;
        productItem.rowOrder = itemProduct.rowOrder;
        productItem.cost = item?.productCostName

        _.each(this.listMonth, (itemMonth) => {
          const dataFormBase = _.find(data, (itemBase) => {
            return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year && itemBase.productId === productItem.id;
          })

          if (dataFormBase) {
            productItem['M' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
            productItem['remarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
            productItem['OLD_M' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
          } else {

            productItem['M' + itemMonth.Month + itemMonth.Year] = 0;
            productItem['remarkM' + itemMonth.Month + itemMonth.Year] = null;
            productItem['OLD_M' + itemMonth.Month + itemMonth.Year] = 0;
          }

          const dataManual = _.filter(this.masterData.costManual, (itemManual) => {
            return itemManual.cost === item.productCostName && itemManual.product === productItem.product
          })

          _.each(dataManual, (dataManualMonth) => {
            productItem['M' + dataManualMonth.monthValue + dataManualMonth.yearValue] = dataManualMonth.value;
            productItem['isManualM' + dataManualMonth.monthValue + dataManualMonth.yearValue] = true;
          })

          const dataActual = _.filter(this.masterData.costActual, (itemActual) => {
            return itemActual.cost === item.productCostName && itemActual.product === productItem.product
          })

          _.each(dataActual, (dataActualMonth) => {
            if (dataActualMonth?.value > 0) {
              productItem['M' + dataActualMonth.monthValue + dataActualMonth.yearValue] = dataActualMonth.value;
              productItem['isActualM' + dataActualMonth.monthValue + dataActualMonth.yearValue] = true;
              productItem['OLD_M' + dataActualMonth.Month + dataActualMonth.Year] = dataFormBase?.value;
            }
          })
        });

        item.dataList.push(productItem);
        //item.dataListVersionOriginals.push(productItem);
      });


      item.dataList = _.orderBy(item.dataList, ['rowOrder'], ['asc'])
      // data = _.filter(this.masterData.costsVersionOriginals, (itemCost) => {
      //   return itemCost.cost === item.productCostName;
      // });
      // item.dataListVersionOriginals = _.orderBy(item.dataList, ['rowOrder'], ['asc'])

      if (item.dataList && item.dataList.length <= 0) {
        _.each(this.masterData.masterProducts, (itemProduct) => {
          let productItem: any = {};
          productItem.id = itemProduct.id;
          productItem.product = itemProduct.name;
          productItem.rowOrder = itemProduct.rowOrder;

          _.each(this.listMonth, (itemMonth) => {
            productItem['M' + itemMonth.Month + itemMonth.Year] = 0;
            productItem['remarkM' + itemMonth.Month + itemMonth.Year] = null;
          });

          item.dataList.push(productItem);
          //item.dataListVersionOriginals.push(productItem);
        });
      }
    })

    console.log("item.dataList :: ", this.masterData.masterCosts);

    if (dataImport != undefined) {
      this.setData(dataImport, true);
    }
    else {
      this.loaderService.hide();
    }

    // this.loaderService.hide();
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log(event);
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.trim('\r\n');
    _.each(pastedText.split('\r\n'), (i2, index) => {
      _.each(i2.split('\t'), (i3, index3) => {
        data[row + index]['M' + (month + index3)] = _.trim(i3).replace(',', '')
      });
    });

    return false;
  }


  getDataSave() {
    let dataSave: any = {};
    let dataList = [];
    let dataManual = [];
    _.each(this.masterData.masterCosts, (item) => {
      _.each(item.dataList, (itemProduct, index) => {
        let data: any = {}
        data.year = this.year
        data.month = this.month

        data.costId = item.id;
        data.cost = item.productCostName;
        data.productId = itemProduct.id;
        data.product = itemProduct.product;
        data.rowOrder = _.toNumber(itemProduct.rowOrder)
        data.version = this.version;

        _.each(this.listMonth, (itemMonth) => {

          let productData: any = {}

          productData.costId = data.costId;
          productData.cost = data.cost;
          productData.product = data.product;
          productData.productId = data.productId;
          productData.rowOrder = data.rowOrder
          productData.version = data.version;
          productData.monthValue = itemMonth.Month;
          productData.yearValue = itemMonth.Year;
          productData.remark = itemProduct["remarkM" + itemMonth.Month + itemMonth.Year];

          if (itemProduct['isManualM' + itemMonth.Month + itemMonth.Year] === true) {
            dataManual.push({
              year: this.year,
              month: this.month,
              yearValue: itemMonth.Year,
              monthValue: itemMonth.Month,
              costId: data.costId,
              cost: data.cost,
              productId: data.productId,
              product: data.product,
              value: _.toNumber(itemProduct['M' + itemMonth.Month + itemMonth.Year]),
              remark: item['remarkM' + itemMonth.Month + itemMonth.Year],
              version: data.varsion,
            });
            productData.value = _.toNumber(itemProduct['OLD_M' + itemMonth.Month + itemMonth.Year]);
          } else {
            productData.value = _.toNumber(itemProduct['M' + itemMonth.Month + itemMonth.Year]);
          }

          dataList.push(productData);
        })

      })
    })
    dataSave.dataList = dataList;
    dataSave.dataManual = dataManual;
    return dataSave;
  }

  getDataVersion0(itemTemp: any, dataField: any) {
    return itemTemp['OLD_' + dataField];
    // return item.dataListVersionOriginals[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  // getCheckBoxValue(input: boolean) {
  //   let value: boolean = false;
  //   if (input) {
  //     value = true
  //   }
  //   return value;
  // }



  onIsManualValueChange(values: any): void {
    // console.log(values.currentTarget.checked);
    if (values.currentTarget.checked === false) {
      this.dataEdit[this.dataFieldEdit] = this.dataEdit['OLD_' + this.dataFieldEdit];
    }
  }

  setData(data: any, isImport?: any) {
    _.each(this.masterData.masterCosts, (item) => {
      const dataExcel = _.filter(data, (itemExcel) => {
        // return itemExcel.cost === item.productCostName
        return this.baseService.replaceCpeciaCharacters(itemExcel.cost) === this.baseService.replaceCpeciaCharacters(item.productCostName)
      })
      _.each(item.dataList, (itemProduct) => {
        const dataExcelProduct = _.find(dataExcel, (itemExcelProduct) => {
          return itemExcelProduct.product === itemProduct.product
        })
        if (dataExcelProduct) {
          _.each(this.listMonth, (itemMonth) => {
            if (!itemProduct['isManualM' + itemMonth.Month + itemMonth.Year]) {
              itemProduct['M' + itemMonth.Month + itemMonth.Year] = _.toNumber(_.trim(_.replace(dataExcelProduct['m' + itemMonth.index], ',', '')))
            }
          });
          // for (let index = 1; index < 13; index++) {
          //   if (!itemProduct['isManualM' + index]) {
          //     itemProduct['M' + index] = _.toNumber(_.trim(_.replace(dataExcelProduct['m' + index], ',', '')))
          //   }
          // }
        }
      })

      this.masterData.costs = item.dataList;

      // _.each(item.dataListVersionOriginals, (itemProduct) => {
      //   const dataExcelProduct = _.find(dataExcel, (itemExcelProduct) => {
      //     return itemExcelProduct.product === itemProduct.product
      //   })
      //   if (dataExcelProduct) {
      //     _.each(this.listMonth, (itemMonth, index) => {
      //       itemProduct['M' + itemMonth.Month + itemMonth.Year] = _.toNumber(_.trim(_.replace(dataExcelProduct['m' + itemMonth.index], ',', '')))
      //     });
      //   }
      // })

      // this.masterData.costsVersionOriginals = item.dataListVersionOriginals;
    })

    // if (isImport != true) {
    //   this.loaderService.hide();
    // }

  }

  itemClick(event: any, row: any, columnIndex: any, data: any, item: any, dataField: any) {
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.field = dataField;
    if (event.itemData.text === 'Paste') {
      if (this.accessMenu == 1) {
        navigator.clipboard.readText()
          .then((txt: any) => {
            let pastedText = txt;
            pastedText = pastedText.trim('\r\n');
            _.each(pastedText.split('\r\n'), (i2, index) => {
              let runningIndex = columnIndex;
              _.each(i2.split('\t'), (i3) => {
                let dataText = _.toNumber(_.trim(i3).replace(',', ''));
                if (dataText && _.isNumber(dataText)) {
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
                    title: 'ไม่สามารถนำข้อมูลมาแสดงเพิ่ม',
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
      } else {
        Swal.fire({
          title: 'Access Denied',
          text: 'ไม่สามารถวางข้อมูลได้ เนื่องจาก ไม่มีสิทธิ์',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด'
          //timer: 1000
        })
      }
    } else if (event.itemData.text === 'Edit') {
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      })

      // console.log('title', title);
      console.log('item', item);
      this.titleEdit = title.caption + " : " + item.cost + "(" + item.product + ")";
      this.dataEdit = item;
      this.dataEditOld = _.cloneDeep(item);
      this.rowEdit = row;
      this.columnEdit = columnIndex;
      this.dataFieldEdit = dataField;
      this.popupVisible = true;
    }
  }

  popupSaveClick = () => {
    // console.log("this.dataEdit", this.dataEdit);
    if (this.dataEdit[this.dataInfoEditColumn['field']] !== this.dataEditOld[this.dataInfoEditColumn['field']]) {
      this.dataEdit['isPaste' + this.dataInfoEditColumn['field']] = true;
      // this.gridRefresh();
      this.refreshAllGrids();
    }

    this.popupVisible = false;
  }
  popupCancelClick = () => {
    console.log('rowEdit', this.rowEdit)
    this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    this.popupVisible = false;
  }

  onCellPrepared(e) {
    if (e.rowType === "data" && e.columnIndex > 0) {
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
      }, 200);
    }
  }

  refreshAllGrids() {
    this.dataGrids.forEach(function (dataGrid) {
      dataGrid.instance.refresh();
    })
  }
}
