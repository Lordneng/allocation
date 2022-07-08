import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/service/base.service';
import { AbilityRefineryService } from 'src/app/service/ability-refinery.service';
import { AbilityPlanKhmService } from 'src/app/service/ability-plan-khm.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-or-demand-plan-data-grid-demand',
  templateUrl: './or-demand-plan-data-grid-demand.component.html',
  styleUrls: ['./or-demand-plan-data-grid-demand.component.css'],
})
export class OrDemandPlanDataGridDemandComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataListTotal: any = [];
  dataListByCar: any = [];
  dataListByVessel: any = [];
  dataListVersion0: any = [];
  abilityRefineryVersionList: any = [];
  abilityKHMVersionList: any = [];
  listMonth = [];
  dataInput = [];
  dataSupplier: any = [];
  dataVessel = ["GSP KHM", "GC", "SPRC", "PTTGC's Jetty"];
  dataCar = ["PTTEP/LKB", "BRP"];

  isCollapsedAnimated = false;

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];

  masterData: any = {};
  listData: any = [];
  dataCondition: any = {};
  cellTemplate = 'cellTemplate';
  year: any = '2021';
  @Input() month: any = 1;
  monthNow: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};
  versionInfo: any = {};
  abilityPlanKhmVersionId = null;
  abilityRefineryVersionId = null;

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
  dataInfo: any = {};
  dataInfoOld: any = {};

  @Input() maxVersion: any = 0;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridByCar', { static: false })
  dataGridByCar: DxDataGridComponent;
  @ViewChild('dataGridByVessel', { static: false })
  dataGridByVessel: DxDataGridComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(
    private masterCostsService: MasterCostsService,
    private abilityRefineryService: AbilityRefineryService,
    private abilityPlanKhmService: AbilityPlanKhmService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService,
    private baseService: BaseService
  ) { }

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

  onYearChange(
    year: any,
    month: any,
    version: any,
    maxVersion,
    versionInfo: any,
    callback?: any
  ) {
    this.versionInfo = versionInfo;
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

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'demand',
      code: 'demand',
      caption: 'Demand (KT)',
      alignment: 'center',
      fixed: true,
      fixedPosition: 'left',
    });
    _.each(this.listMonth, (item) => {
      this.tmpMonth['M' + item.month + item.year] = '';
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        caption: item.MonthName,
        // format: 'fixedPoint',
        // dataType: 'number',
        // precision: 2,
        cellTemplate: this.cellTemplate
      });
    });

    this.retrieveMasterData().subscribe((res) => {
      console.log('res :: ', res);
      this.abilityRefineryVersionList = res[0];
      this.abilityKHMVersionList = res[1];
      this.loaderService.hide();
      // this.retrieveData();
      if (callback) {
        callback();
      }
    });
  }
  retrieveMasterData(): Observable<any> {
    const abilityRefineryVersionList = this.abilityRefineryService.getVersion(
      this.year
    );
    const abilityKHMVersionList = this.abilityPlanKhmService.getMonthVersion(
      this.year,
      this.month
    );
    // const abilityKHMVersionList = [];
    return forkJoin([abilityRefineryVersionList, abilityKHMVersionList]);
  }

  setVersionSelect() {
    this.abilityPlanKhmVersionId = this.versionInfo?.abilityPlanKhmVersionId;
    this.abilityRefineryVersionId = this.versionInfo?.abilityRefineryVersionId;

    this.dataCondition.abilityRefineryVersionId = this.abilityRefineryVersionId;
    this.dataCondition.abilityKHMVersionId = this.abilityPlanKhmVersionId;
  }

  getdataListByCar() {
    let data: any = {};
    data.dataListByCar = this.dataListByCar;
    return data;
  }

  getdataListByVessel() {
    let data: any = {};
    data.dataListByVessel = this.dataListByVessel;
    return data;
  }

  getdataListTotal() {
    let data: any = {};
    data.dataListTotal = this.dataListTotal;
    return data;
  }

  retrieveDataSupplier(): Observable<any> {
    const abilityRefineryVersion = this.abilityRefineryVersionList.find((obj) => {
      return obj.id == this.dataCondition.abilityRefineryVersionId;
    });

    let abilityRefineryVersionList: any = [];

    if (abilityRefineryVersion?.version) {
      const refineryParam = {
        month: this.month,
        year: this.year,
        version: abilityRefineryVersion?.version,
        supplier: ["PTTGC's Jetty", 'SPRC', 'GC', 'PTTEP(LKB)'],
      };
      abilityRefineryVersionList = this.abilityRefineryService.getSupplier(refineryParam);
    } else {
      this.dataCondition.abilityRefineryVersionId = null;
    }

    const abilityKHMVersion = this.abilityKHMVersionList.find((obj) => {
      return obj.id == this.dataCondition.abilityKHMVersionId;
    });

    let abilityKHMVersionList: any = [];

    if (abilityKHMVersion?.version) {
      const planKhmParam = {
        month: this.month,
        year: this.year,
        version: abilityKHMVersion?.version,
        supplier: ['LPG'],
      };
      abilityKHMVersionList = this.abilityPlanKhmService.getSupplier(planKhmParam);
    } else {
      this.dataCondition.abilityKHMVersionId = null;
    }

    return forkJoin([abilityRefineryVersionList, abilityKHMVersionList]);
  }

  retrieveData(dataInput: any) {
    this.dataInput = dataInput;
    console.log('this.dataInput', this.dataInput);

    this.dataListTotal = [{ id: 0, demand: 'ทางรถ' }, { id: 1, demand: 'ทางเรือ' }];

    _.each(this.listMonth, (item) => {
      const findList = this.dataInput.find((obj) => {
        return obj.monthValue === item.month && obj.yearValue === item.year;
      });

      console.log('findList', findList);

      const findListCar = this.dataListTotal.find((obj) => {
        return obj.demand == 'ทางรถ';
      });
      findListCar['M' + item.month + item.year] = findList
        ? (findList.brpPttepValue + findList.ptttankValue) / 1000000
        : 0;

      const findListShip = this.dataListTotal.find((obj) => {
        return obj.demand == 'ทางเรือ';
      });
      findListShip['M' + item.month + item.year] = findList
        ? findList.mtPtttankRefineryValue / 1000000
        : 0;
    });

    this.loaderService.hide();
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

  onAccept(evevt: any, callback?: any) {
    if (
      !this.dataCondition.abilityRefineryVersionId ||
      !this.dataCondition.abilityKHMVersionId
    ) {
      this.dataListByVessel = [];
      this.dataListByCar = [];
      return;
    }

    this.loaderService.show;

    this.retrieveDataSupplier().subscribe((res) => {
      console.log('Res Data Supplier :: ', res);
      this.dataSupplier.abilityRefinery = res[0];
      this.dataSupplier.abilityKHM = res[1];
      this.setDataAbility();
      if (callback) {
        callback();
      }
    });
  }

  setDataAbility() {
    this.dataListByVessel = [];
    this.dataListByCar = [];
    const dataAbilityRefinery = this.dataSupplier.abilityRefinery;
    const dataAbilityKHM = this.dataSupplier.abilityKHM;

    // Box 2
    _.each(this.dataVessel, (itemVessel, index) => {
      const dataList = { id: index, demand: itemVessel };
      _.each(this.listMonth, (item) => {
        if (itemVessel == 'GSP KHM') {
          const findDataKHM = dataAbilityKHM.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year;
          });

          if (findDataKHM) {
            dataList['M' + item.month + item.year] = findDataKHM.value;
          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        } else {
          const findDataRefinery = dataAbilityRefinery.find((obj) => {
            return obj.monthValue === item.month && obj.yearValue === item.year && obj.supplier == itemVessel;
          });

          if (findDataRefinery) {
            dataList['M' + item.month + item.year] = findDataRefinery.value;
          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        }
      });

      this.dataListByVessel.push(dataList);

    });

    // Box 1
    _.each(this.dataCar, (itemTotal, index) => {
      const dataList = { id: index, demand: itemTotal };
      _.each(this.listMonth, (item) => {

        const findDataRefinery = dataAbilityRefinery.find((obj) => {
          return obj.monthValue === item.month && obj.yearValue === item.year && obj.supplier == 'PTTEP(LKB)';
        });

        const findListInput = this.dataInput.find((obj) => {
          return obj.monthValue === item.month && obj.yearValue === item.year;
        });

        if (findDataRefinery) {
          if (itemTotal == 'BRP') {

            dataList['M' + item.month + item.year] = ((findListInput.brpPttepValue / 1000000) + findDataRefinery.value);

          } else {
            dataList['M' + item.month + item.year] = findDataRefinery.value;
          }

        } else {

          if (itemTotal == 'BRP') {

            dataList['M' + item.month + item.year] = (findListInput.brpPttepValue / 1000000);

          } else {
            dataList['M' + item.month + item.year] = 0;
          }

        }

      });

      this.dataListByCar.push(dataList);

    });

    this.loaderService.hide;
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
        if (item['isManualM' + itemMonth.Month] === true) {
          dataManual.push({
            year: this.year,
            month: this.month,
            valueMonth: itemMonth.Month,
            cost: item.cost,
            product: item.referencePriceNameTo,
            value: _.toNumber(item['M' + itemMonth.Month]),
            remark: item['remarkM' + itemMonth.Month],
            version: item.varsion,
          });
          data['M' + itemMonth.Month] = _.toNumber(
            this.dataListVersion0[index]['M' + itemMonth.Month]
          );
        } else {
          data['M' + itemMonth.Month] = _.toNumber(item['M' + itemMonth.Month]);
        }
        data['remarkM' + itemMonth.Month] = item['remarkM' + itemMonth.Month];
      });
      _datalist.push(data);
    });
    //datalist =_.omit(datalist,'id');
    //datalist =Object.values(_.omit(datalist,'id'));
    dataSave.dataList = _datalist;
    dataSave.dataManual = dataManual;
    return dataSave;
  }

  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  displayVersion(item: any) {
    if (item) {
      return `${item.versionName}`;
    } else {
      return '';
    }
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

  itemClick(
    event: any,
    month: any,
    row: any,
    data: any,
    item: any,
    dataField: any
  ) {

    this.dataInfoOld = _.cloneDeep(data);
    if (event.itemData.text === 'Paste') {
      navigator.clipboard
        .readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          _.each(pastedText.split('\r\n'), (i2, index) => {
            _.each(i2.split('\t'), (i3, index3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));

              if (dataText && _.isNumber(dataText)) {
                // const refTo = _.replace(data[row + index].referencePriceNameTo, new RegExp(' ', 'g'), '');
                // if (refTo === 'PP:CFRSEA') {
                const formula = _.find(
                  _.cloneDeep(this.masterData.masterPrices),
                  (mProduct) => {
                    return (
                      mProduct.referencePriceNameFrom ==
                      data[row + index].referencePriceNameFrom &&
                      mProduct.referencePriceNameTo ==
                      data[row + index].referencePriceNameTo &&
                      mProduct.unit == data[row + index].unit
                    );
                  }
                ).formula;
                dataText = eval(dataText + formula);
                // }
                data[row + index]['isPasteM' + (month + index3)] = true;
                data[row + index]['M' + (month + index3)] = dataText;
              } else {
                Swal.fire({
                  title: 'ไม่สารถนำข้อมูลมาแสดงเพิ่ม',
                  text: 'เนื่องจากข้อมูลที่ Copy มาไม่เป็นตัวเลข',
                  icon: 'error',
                  showConfirmButton: true,
                  confirmButtonText: 'ปิด',
                  //timer: 1000
                });
                return false;
              }
            });
          });
        })

        // (A3) OPTIONAL - CANNOT ACCESS CLIPBOARD
        .catch((err) => {
          // alert("Please allow clipboard access permission");
        });

      setTimeout(() => {
        this.dataInfo = data;
      }, 50);

    } else if (event.itemData.text === 'Edit') {
      const title = _.find(this.dynamicColumns, (item) => {
        return item.dataField === dataField;
      });
      this.titleEdit = title.caption + ' : ' + item.referencePriceNameTo;
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
    this.popupVisible = false;
  };
  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataEditOld);
    //this.dataEdit = _.cloneDeep(this.dataEditOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  };
  onCellPrepared(e) {
    if (e.rowType === 'data' && e.columnIndex > 2) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (
      e.rowType === 'data' &&
      e.data &&
      e.data['isPasteM' + (e.columnIndex - 2)] === true
    ) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  gridRefresh() {
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.state(null);
    }
    if (this.dataGridByCar && this.dataGridByCar.instance) {
      this.dataGridByCar.instance.state(null);
    }
    if (this.dataGridByVessel && this.dataGridByVessel.instance) {
      this.dataGridByVessel.instance.state(null);
    }
  }
}
