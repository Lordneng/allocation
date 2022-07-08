import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin, identity } from 'rxjs';
import { MasterCostsService } from 'src/app/service/master-costs.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { BaseService } from 'src/app/service/base.service';
import { MasterContractService } from 'src/app/service/master-contract.service';
import { OrDemandPlanDataGridDemandComponent } from '../or-demand-plan-data-grid-demand/or-demand-plan-data-grid-demand.component';
import { OrDemandPlantService } from 'src/app/service/or-demand-plan.service';
import { OptimizationsService } from 'src/app/service/optimizations.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-or-demand-plan-data-grid-source',
  templateUrl: './or-demand-plan-data-grid-source.component.html',
  styleUrls: ['./or-demand-plan-data-grid-source.component.css'],
})
export class OrDemandPlanDataGridSourceComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataListVersion0: any = [];
  listMonth = [];
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  dataInfo: any = {};

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
  dataImport: any;
  dataInput: any;

  @Input() maxVersion: any = 0;
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridDemand') dataGridDemand: OrDemandPlanDataGridDemandComponent;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(private masterCostsService: MasterCostsService,
    private modalService: BsModalService,
    private loaderService: NgxSpinnerService,
    private masterContractService: MasterContractService,
    private orDemandPlantService: OrDemandPlantService,
    private optimizationsService: OptimizationsService,
    private authService: AuthService,
    private baseService: BaseService) { }

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

  onYearChange(year: any, month: any, version: any, maxVersion, dataInput?: any, dataImport?: any, callback?: any) {
    this.dataInput = dataInput;
    this.dataImport = dataImport;
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
      dataField: 'sourceName',
      code: 'Source',
      caption: 'Source',
      fixed: true,
      fixedPosition: 'left',
    });
    this.dynamicColumns.push({
      dataField: 'demandName',
      code: 'Demand',
      caption: 'Demand',
      fixed: true,
      fixedPosition: 'left',
    });
    this.dynamicColumns.push({
      dataField: 'deliveryName',
      code: 'DeliveryPoint',
      caption: 'Delivery Point',
      fixed: true,
      fixedPosition: 'left',
    });

    _.each(this.listMonth, (item) => {
      this.tmpMonth['M' + item.month + item.year] = '';
      this.dynamicColumns.push({
        dataField: 'M' + item.month + item.year,
        code: item.month + item.year,
        caption: item.MonthName,
        format: 'fixedPoint',
        dataType: 'number',
        precision: 2,
        cellTemplate: this.cellTemplate
      });
    });

    this.retrieveMasterData().subscribe(res => {
      console.log("res source TAB 3 :: ", res);
      this.masterData.masterContractProduct = res[0];
      this.masterData.masterDataManual = res[1];
      this.masterData.masterDataOptimizations = res[2];
      this.isRecursive = false;
      this.retrieveData();
      if (callback) {
        callback();
      }
    });
  }
  retrieveMasterData(): Observable<any> {
    const masterContractProduct = this.masterContractService.getGenM7(this.year, this.month);
    const masterDataManual = this.orDemandPlantService.getManual(this.year, this.month, this.version);
    const masterDataOptimizations = this.optimizationsService.getList(this.year, this.month, this.version, false);
    return forkJoin([masterContractProduct, masterDataManual, masterDataOptimizations]);
  }

  retrieveData() {

    this.setRetrieveData();
    this.loaderService.hide();

  }
  setRetrieveData() {
    this.dataList = [];

    _.each(this.masterData.masterContractProduct, (item, index) => {
      let objectPush: any = item;
      objectPush.id = index;

      _.each(this.listMonth, async (itemMonth) => {
        const dataManual = this.masterData.masterDataManual?.filter(
          data => data.sourceName == item.sourceName &&
            data.demandName == item.demandName &&
            data.deliveryName == item.deliveryName &&
            data.monthValue == itemMonth.month &&
            data.yearValue == itemMonth.year);
        if (dataManual?.length > 0) {
          objectPush['isManualM' + itemMonth.month + itemMonth.year] = true;
          objectPush['M' + itemMonth.month + itemMonth.year] = dataManual[0].value;
          objectPush['RealM' + itemMonth.month + itemMonth.year] = await this.getValueFromSourceDelivery(item.sourceName, item.demandName, item.deliveryName, item.transportationTypeCode, itemMonth.month, itemMonth.year);
        } else {
          objectPush['isManualM' + itemMonth.month + itemMonth.year] = false;
          objectPush['M' + itemMonth.month + itemMonth.year] = await this.getValueFromSourceDelivery(item.sourceName, item.demandName, item.deliveryName, item.transportationTypeCode, itemMonth.month, itemMonth.year);
        }
      });

      this.dataList.push(objectPush);
    })

    console.log('this.dataList TAB 3 ==>> ', this.dataList)

  }

  getValueFromSourceDelivery(source: any, demand: any, delivery: any, type: any, month: any, year: any) {

    // console.log('source', source);

    let resValue = 0;

    if (type == "ทางรถ") {

      const dataListInput = this.dataInput?.getdataList?.dataList;
      const dataListByCar = this.dataImport?.getdataListByCar?.dataListByCar;

      const filterDataListInput = dataListInput?.filter(input => input.monthValue == month && input.yearValue == year);
      // console.log('filterDataListInput',filterDataListInput);

      // ทางรถ //
      if (source == "PTTEP/LKB" && delivery == "PTTEP/LKB" && demand == "LPG PTT OR") {
        const filterDataListByCar = dataListByCar?.filter(car => car.demand == source);
        resValue = filterDataListByCar?.length > 0 ? filterDataListByCar[0]['M' + month + year] : 0;
      }
      else if (source == "GSP RY" && delivery == "PTT TANK (TRUCK)" && demand == "LPG PTT OR") {
        resValue = filterDataListInput?.length > 0 ? (filterDataListInput[0].propaneValue / 1000000) : 0;
      }
      else if (source == "GSP RY" && delivery == "GSP RY (Truck)" && demand == "LPG PTTOR (LPG ไม่มีกลิ่น)") {
        resValue = filterDataListInput?.length > 0 ? (filterDataListInput[0].spotOdorlessLpgValue / 1000000) : 0;
      }

    } else if (type == "ทางเรือ") {

      const dataListByVessel = this.dataImport?.getdataListByVessel?.dataListByVessel;

      // ทางเรือ //
      if (source == "GSP KHM" && delivery == "GSP KHM" && demand == "LPG PTT OR") {
        const filterDataListByVessel = dataListByVessel?.filter(vessel => vessel.demand == source);
        resValue = filterDataListByVessel?.length > 0 ? filterDataListByVessel[0]['M' + month + year] : 0;
      }
      else if (source == "SPRC" && delivery == "SPRC" && demand == "LPG PTT OR") {
        const filterDataListByVessel = dataListByVessel?.filter(vessel => vessel.demand == source);
        resValue = filterDataListByVessel?.length > 0 ? filterDataListByVessel[0]['M' + month + year] : 0;
      }
      else if (source == "GC" && delivery == "MT" && demand == "LPG PTT OR") {
        const filterDataListByVessel = dataListByVessel?.filter(vessel => vessel.demand == source);
        resValue = filterDataListByVessel?.length > 0 ? filterDataListByVessel[0]['M' + month + year] : 0;
      }
      else if (source == "IRPC" && delivery == "IRPC" && demand != "LPG PTT OR") {
        const filterDataListByVessel = dataListByVessel?.filter(vessel => vessel.demand == source);
        resValue = filterDataListByVessel?.length > 0 ? filterDataListByVessel[0]['M' + month + year] : 0;
      }

    }

    return resValue;

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

  getDataSave() {
    console.log('this.dataList tab 3', this.dataList);
    let dataSave: any = {};
    let _datalist = [];
    let dataManual = [];

    _.each(this.listMonth, (itemMonth) => {

      _.each(_.cloneDeep(this.dataList), (item, index) => {

        item.id = undefined;
        item.month = this.month;
        item.year = this.year;
        item.monthValue = itemMonth.month;
        item.yearValue = itemMonth.year;

        if (item['isManualM' + itemMonth.month + itemMonth.year] === true) {

          let _dataManual: any = item;
          _dataManual.value = _.toNumber(item['M' + itemMonth.month + itemMonth.year]);

          dataManual.push(_dataManual);
        }

        let data: any = item;
        data.value = _.toNumber(item['M' + itemMonth.month + itemMonth.year]);
        _datalist.push(data);

      });

    });

    dataSave.demandPlanValue = _datalist;
    dataSave.demandPlanManual = dataManual;
    console.log('dataSave ===> tab 3', dataSave);
    return dataSave;
  }

  getDataVersion0(item: any, itemTemp: any) {
    return this.dataListVersion0[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  changeManual(dataFieldEdit: any) {
    const isManual = this.dataEdit['isManual' + dataFieldEdit];
    if (isManual == false) {
      this.dataEdit[dataFieldEdit] = this.dataEdit['Real' + dataFieldEdit];
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
      if (dataExcel) {
        _.each(dataExcel, (itemProduct) => {
          //ตั้งแต่เดือนปัจจุบันให้ใช้ month
          for (let index = 1; index < 13; index++) {
            let data = _.toNumber(_.trim(_.replace(itemProduct['m' + index], ',', '')));
            if (data) {
              item['isPasteM' + (index)] = true;
              // if (itemProduct.product === 'PP Yarn : CFR SEA') {
              const formula = _.find(_.cloneDeep(this.masterData.masterPrices), mProduct => { return mProduct.referencePriceNameFrom == itemProduct.product }).formula;
              data = eval(data + formula);
              // }

              if (item['isManualM' + index] == undefined || item['isManualM' + index] === false) {
                item['M' + index] = data;
              }
            }
          }
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
      this.titleEdit = field.caption + ' : ' + data.sourceName + ', ' + data.demandName + ', ' + data.deliveryName;
      this.dataInfoEditColumn.month = month;
      this.dataInfoEditColumn.year = year;
      this.dataEdit = data;
      this.dataFieldEdit = field.dataField;

      setTimeout(() => {
        this.dataInfo = data;
        this.popupVisible = true;
        // this.dataList[this.rowEdit] = this.dataInfo;
      }, 50);

    } else if ($event.itemData.text === 'Paste') {

      // if (this.accessMenu !== 1) {
      //   Swal.fire({
      //     title: 'Access Denied',
      //     text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
      //     icon: 'error',
      //     showConfirmButton: true,
      //     confirmButtonText: 'ปิด',
      //   });

      //   return false;
      // }

      navigator.clipboard.readText()
        .then((txt: any) => {
          let pastedText = txt;
          pastedText = pastedText.trim('\r\n');
          let runningIndex = row;
          _.each(pastedText.split('\r\n'), (i2, index) => {
            let runningColumn = (field.index - 3);
            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {

                // console.log('Row',runningIndex);
                // console.log('Column',this.getColumnText(runningColumn))
                // console.log('Value',dataText)
                // console.log('--------------------------------------------')


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


  popupSaveClick = () => {
    this.popupVisible = false;

  }
  popupCancelClick = () => {
    // this.dataList[this.rowEdit] = _.cloneDeep(this.dataInfoOld);
    // this.dataEdit = _.cloneDeep(this.dataInfoOld);
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }
  onRowPrepared(e) {
    if (e.rowType === 'data' && e.data.type == 'Total') {
      e.rowElement.style.fontWeight = "bolder";
      e.rowElement.style.backgroundColor = '#ECEFF1';
    }
  }
  onCellPrepared(e) {
    // console.log('e.columnIndex',e);
    if (e.rowType === "data" && e.columnIndex > 2) {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }

    if (e.rowType === "data" && e.data && e.data["isManual" + e.column.dataField] == true) {
      // console.log('e.data["isManual" + e.column.dataField]',e.data["isManual" + e.column.dataField]);
      e.cellElement.classList.add('isManualStyle');

    }
  }

  gridRefresh() {
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.state(null)
    }
  }
}
