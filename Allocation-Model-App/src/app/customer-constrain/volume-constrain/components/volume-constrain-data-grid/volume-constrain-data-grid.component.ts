import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { VolumeConstrainService } from 'src/app/service/volume-constrain.service';
import { MasterContractService } from 'src/app/service/master-contract.service'
import { MasterTurnaroundService } from 'src/app/service/master-turnaround.service'
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-volume-constrain-data-grid',
  templateUrl: './volume-constrain-data-grid.component.html',
  styleUrls: ['./volume-constrain-data-grid.component.css']
})
export class VolumeConstrainDataGridComponent implements OnInit {
  accessMenu: any;
  dataList: any = [];
  dataInfo: any = {};
  listMonth: any = [];
  listMonthColumn: any = [];
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };
  calculateSetting: any = [
    {
      name: 'KT/Month',
      cal: false
    },
    {
      name: 'Ton/Hr',
      cal: true
    }
  ];

  isCollapsedAnimated = false;

  dataTurnAround: any = [];
  public dataTurnAround$: BehaviorSubject<any> = new BehaviorSubject<any>(this.dataTurnAround);

  @Input() numberBoxReadOnly = true;
  numberBoxFormat = '#,##0';
  @Input() numberBoxDigi = 0;

  dynamicColumns: any[] = [];
  dynamicColumnsVisible: any[] = [];
  dynamicColumnsSelected: any[] = [];
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  refineryCellTemplate = 'refineryCellTemplate';
  year: any = 2021;
  month: any = 1;
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  isHistory = false;
  isFrist = true;
  popupVisible = false;
  isNullMin = false;
  isNullMax = false;
  @Input() maxVersion: any = 0;
  @ViewChild('targetGroup', { static: true }) validationGroup: DxValidationGroupComponent;
  @ViewChild('dataGridList', { static: false }) dataGridList: DxDataGridComponent;
  formula = '{0} * 24 * {1} / 1000';//ค่า min Max * 24 / จำนวน workday /1000
  formulaTurnAround = '( {0} / {1} ) * {2}';//แปลงให้เป็นหน่อย KT/Month เอาค่า min Max * จำนวนวันที่/จำนวนวันที่เหลือจากการ TurnAround
  //formula *
  textBoxSelected: any = { data: {}, column: {} };
  valueMonth: any = [];

  subject: Subject<any> = new Subject();
  onToolbarPreparing(e) {
    // e.toolbarOptions.items.unshift(
    //   {
    //     location: 'after',
    //     template: 'tagBoxTemplate',
    //   },
    // )ซ้อนไว้ก่อน
  }
  constructor(
    private volumeConstrainService: VolumeConstrainService,
    private masterContractService: MasterContractService,
    private masterTurnaroundService: MasterTurnaroundService,
    private loaderService: NgxSpinnerService,
    private authService: AuthService,) {

  }

  settingData: any = [{
    name: 'month.',
    cal: false
  },
  {
    name: 'hr.',
    cal: true
  }
  ];

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
    this.accessMenuList();
    this.subject
      .pipe(debounceTime(100))
      .subscribe((event) => {
        if (event.value && event.value.length > 0) {
          if (this.dataGridList && this.dataGridList.instance) {
            console.log('event', event)
            _.each(this.listMonth, (item) => {
              const dataVisible = _.find(event.value, (itemVisible) => {
                return itemVisible === 'M' + item.Month + item.Year;
              })
              if (dataVisible) {
                this.dataGridList.instance.columnOption('M' + item.Month + item.Year, 'visible', true);
              } else {
                this.dataGridList.instance.columnOption('M' + item.Month + item.Year, 'visible', false);
              }
            })
            // _.each(event.value, (item) => {
            //   this.dataGridList.instance.columnOption(item, 'visible', true);
            // })
          }
        } else if (event.value && event.value.length === 0) {
          if (this.dataGridList && this.dataGridList.instance) {
            _.each(this.listMonth, (item) => {
              this.dataGridList.instance.columnOption('M' + item.Month + item.Year, 'visible', true);
            })
          }
        }
        this.loaderService.hide();
      }
      );
  }

  ngAfterViewInit(): void { }

  accessMenuList() {
    // 1 : Add,Edit, 2 : View Only
    this.authService.menuAll$.subscribe(res => {
      console.log('res contract', res);
      if (res && res.currentMenu) {
        // console.log("res >>>>>>> ", res['currentMenu']);
        console.log("actionMenu > ", res.currentMenu?.actionMenu);
        this.accessMenu = res['currentMenu']['actionMenu'];
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
    this.listMonthColumn = [];
    let dateStart = moment(this.year + '-' + month + '-01');
    //dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = {
        Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName)
        //, visible: index < 5 ? true : false
        , visible: true
      }

      this.listMonth.push(data);
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }
    this.dynamicColumns = [];
    this.dynamicColumnsVisible = [];
    this.dynamicColumnsSelected = [];
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
      //width: 180,
      fixed: true,
      fixedPosition: 'left',
      cellTemplate: this.refineryCellTemplate
    })
    this.dynamicColumns.push({  // {
      dataField: 'unit',
      code: 'unit',
      caption: 'Unit',
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'source',
      code: 'source',
      caption: 'Source',
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'demand',
      code: 'demand',
      caption: 'Demand',
      fixed: true,
      fixedPosition: 'left'
    })
    this.dynamicColumns.push({  // {
      dataField: 'deliveryPoint',
      code: 'deliveryPoint',
      caption: 'Delivery Point',
      fixed: true,
      fixedPosition: 'left'
    })

    console.log('this.listMonth', this.listMonth);

    let columnMonthIndex = 0;

    _.each(this.listMonth, (item, index) => {

      let dataColumnMonthMin: any = {}
      dataColumnMonthMin.index = columnMonthIndex;
      dataColumnMonthMin.year = item.Year;
      dataColumnMonthMin.month = item.Month;
      dataColumnMonthMin.field = 'minM' + item.Month + item.Year;

      this.listMonthColumn.push(dataColumnMonthMin);

      columnMonthIndex++;
      let dataColumnMonthMax: any = {}
      dataColumnMonthMax.index = columnMonthIndex;
      dataColumnMonthMax.year = item.Year;
      dataColumnMonthMax.month = item.Month;
      dataColumnMonthMax.field = 'maxM' + item.Month + item.Year;

      this.listMonthColumn.push(dataColumnMonthMax);
      columnMonthIndex++;
      const dataColumn = {
        caption: item.MonthName,
        visible: item.visible,
        dataField: 'M' + item.Month + item.Year,
        alignment: 'center',
        columns: [
          {
            // {
            dataField: 'displayMinM' + item.Month + item.Year,
            code: dataColumnMonthMin.index,
            name: 'formulaMinM' + item.Month + item.Year,
            caption: 'Min',
            dataType: 'number',
            width: 80,
            cellTemplate: this.cellTemplate,
          },
          {
            // {
            dataField: 'displayMaxM' + item.Month + item.Year,
            code: dataColumnMonthMax.index,
            name: 'formulaMaxM' + item.Month + item.Year,
            caption: 'Max',
            dataType: 'number',
            width: 80,
            cellTemplate: this.cellTemplate,
          },
        ],
      }
      this.dynamicColumns.push(dataColumn);
      this.dynamicColumnsVisible.push(_.omit(dataColumn, ['visible']));
      if (item.visible) {
        this.valueMonth.push(dataColumn.dataField);
      }
    });

    this.retrieveMasterData().subscribe(res => {
      console.log('res ==>', res);
      this.masterData.volumeConstrain = res[0];
      this.masterData.volumeConstrainForm = res[1];
      this.masterData.maserContract = res[2];
      this.masterData.turnaround = res[3];
      console.log('this.masterData.turnaround', this.masterData.turnaround)
      this.retrieveData();
    });

    // if (this.isHistory) {
    //   this.retrieveMasterDataHistory().subscribe(res => {
    //     this.masterData.volumeConstrain = res[0];
    //     this.masterData.volumeConstrainForm = res[1];
    //     this.retrieveData();
    //   });
    // } else {
    //   this.retrieveMasterData().subscribe(res => {
    //     this.masterData.volumeConstrain = res[0];
    //     this.masterData.volumeConstrainForm = res[1];
    //     this.retrieveData();
    //   });
    // }

  }
  retrieveMasterData(): Observable<any> {

    const volumeConstrain = this.volumeConstrainService.getList(this.year, this.month, this.version);
    const volumeConstrainForm = this.volumeConstrainService.getForm(this.year);
    const masterContractProduct = this.masterContractService.getGen(this.year, this.month);
    const masterTurnaround = this.masterTurnaroundService.gettovolumeconstrain(this.year, this.month);
    return forkJoin([volumeConstrain, volumeConstrainForm, masterContractProduct, masterTurnaround]);
  }
  retrieveMasterDataHistory(): Observable<any> {

    const volumeConstrain = this.volumeConstrainService.getListHistory(this.version);
    const volumeConstrainForm = this.volumeConstrainService.getFormHistory(this.version);
    return forkJoin([volumeConstrain, volumeConstrainForm]);
  }
  retrieveData() {
    let dataAll: any = [];
    let productData = _.uniqBy(_.cloneDeep(this.masterData.maserContract), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
    _.each(productData, (item, index) => {
      let volumeItem: any = {};
      volumeItem.product = item.productName;
      volumeItem.plantName = item.customerPlantName;
      volumeItem.unit = item.unitName;
      volumeItem.source = item.sourceName;
      volumeItem.demand = item.demandName;
      volumeItem.deliveryPoint = item.deliveryName;
      volumeItem.contractNumber = item.contractNumber;
      volumeItem.contractConditionOfSaleId = item.contractConditionOfSaleId;
      let data = _.filter(this.masterData.volumeConstrain, (itemData) => {
        return itemData.contractConditionOfSaleId === item.contractConditionOfSaleId
      });

      let dataForm = _.find(this.masterData.volumeConstrainForm, (itemForm) => {
        return itemForm.contractConditionOfSaleId === item.contractConditionOfSaleId
      });

      volumeItem.isCalculate = dataForm ? dataForm.isCalculate : false;
      volumeItem.min = dataForm ? dataForm.min : null;
      volumeItem.max = dataForm ? dataForm.max : null;
      volumeItem.isNullMin = dataForm ? dataForm.isNullMin : false;
      volumeItem.isNullMax = dataForm ? dataForm.isNullMax : false;
      volumeItem.dayMonth = dataForm ? dataForm.dayValue : 0;
      volumeItem.isAll = dataForm ? dataForm.isAll : true;

      _.each(this.listMonth, (itemMonth) => {

        let dataTurnAround = _.filter(this.masterData.turnaround, (dataTurnAroundFilter) => {
          return dataTurnAroundFilter.month == itemMonth.Month
            && dataTurnAroundFilter.year == itemMonth.Year
        });

        let turnaroundDay = 0;
        let turnaroundPercent = 0;
        if (dataTurnAround.length > 0) {

          let dataTD = _.filter(dataTurnAround[0].data, (datadtItem) => { return datadtItem.productId == item.productId });
          let day = 0;
          _.each(dataTD, (datadtItem) => {
            if (moment(datadtItem.startTurnaroundDate).format('YYYY-M') === itemMonth.Year + '-' + itemMonth.Month && moment(datadtItem.endTurnaroundDate).format('YYYY-M') === itemMonth.Year + '-' + itemMonth.Month) {
              //เริ่มต้นและสอ้นสุดอยู่ในเดือนเดวกันเอา day *percent ได้เลย
              day = datadtItem.day;
            } else if (moment(datadtItem.startTurnaroundDate).format('YYYY-M') === itemMonth.Year + '-' + itemMonth.Month && moment(datadtItem.endTurnaroundDate).format('YYYY-M') !== itemMonth.Year + '-' + itemMonth.Month) {
              //เริ่มต้นอยู่ในเดือนเดวกันเอา แต่สิ้นสุดไม่เป็นเดือนอื่น เอา dauInMonth - วันที่เริ่มต้น + 1
              const date = moment(itemMonth.Year + _.padStart(itemMonth.Month, 2, '0') + '-01')
              day = moment(itemMonth.Year + '-' + _.padStart(itemMonth.Month, 2, '0') + '-' + date.daysInMonth()).diff(moment(datadtItem.startTurnaroundDate), 'days') + 1

            } else if (moment(datadtItem.startTurnaroundDate).format('YYYY-M') !== itemMonth.Year + '-' + itemMonth.Month && moment(datadtItem.endTurnaroundDate).format('YYYY-M') === itemMonth.Year + '-' + itemMonth.Month) {
              //เริ่มต้นไม่ได้อยู่ในเดือนนั้น สิ้นสุดสุดอยู่ในเดือนั้น
              const date = moment(itemMonth.Year + '-' + _.padStart(itemMonth.Month, 2, '0') + '-01')
              day = moment(datadtItem.endTurnaroundDate).diff(date, 'days') + 1

            } else if (moment(datadtItem.startTurnaroundDate).format('YYYY-M') !== itemMonth.Year + '-' + itemMonth.Month && moment(datadtItem.endTurnaroundDate).format('YYYY-M') === itemMonth.Year + '-' + itemMonth.Month) {
              //เริ่มต้นและสอ้นสุดอยู่ในช่วงนนั้นเอาทุกวันในเดือนนั้น
              const date = moment(itemMonth.Year + _.padStart(itemMonth.Month, 2, '0') + '-01')
              day = date.daysInMonth();


            }
            turnaroundDay = turnaroundDay + (day * datadtItem.percent / 100);
            turnaroundPercent = datadtItem.percent;
          });

        }

        volumeItem['dayTurnAroundM' + itemMonth.Month + itemMonth.Year] = turnaroundDay;
        volumeItem['percentTurnAroundM' + itemMonth.Month + itemMonth.Year] = turnaroundPercent;

        const dataFormBase = _.find(data, (itemBase) => {
          return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
        })
        const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');

        if (dataFormBase) {
          volumeItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = dataFormBase.isCalculate;
          volumeItem['displayMinM' + itemMonth.Month + itemMonth.Year] = dataFormBase.min;
          volumeItem['minM' + itemMonth.Month + itemMonth.Year] = dataFormBase.min;
          volumeItem['displayMaxM' + itemMonth.Month + itemMonth.Year] = dataFormBase.max;
          volumeItem['maxM' + itemMonth.Month + itemMonth.Year] = dataFormBase.max;
          volumeItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = dataFormBase.dayValue;
          volumeItem['isNullMinM' + itemMonth.Month + itemMonth.Year] = dataFormBase.isNullMin;
          volumeItem['isNullMaxM' + itemMonth.Month + itemMonth.Year] = dataFormBase.isNullMax;
          volumeItem['remarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
        } else {
          volumeItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
          volumeItem['displayMinM' + itemMonth.Month + itemMonth.Year] = 0;
          volumeItem['minM' + itemMonth.Month + itemMonth.Year] = 0;
          volumeItem['displayMaxM' + itemMonth.Month + itemMonth.Year] = 0;
          volumeItem['maxM' + itemMonth.Month + itemMonth.Year] = 0;
          volumeItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
          volumeItem['isNullMinM' + itemMonth.Month + itemMonth.Year] = false;
          volumeItem['isNullMaxM' + itemMonth.Month + itemMonth.Year] = false;
          volumeItem['remarkM' + itemMonth.Month + itemMonth.Year] = null;
        }
      });

      dataAll.push(volumeItem);

    });


    console.log("dataAll >> ", dataAll);
    this.dataList = _.orderBy(dataAll, ['product', 'plantName'], ['asc', 'asc']);


    this.calData();
    this.onGenFile();
    // this.gridRefresh();
    this.loaderService.hide();
  }

  onPaste(event: any, month: any, row: any, data: any) {
    console.log("chk1", event);
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


  onSubmit() {

    // console.log(this.dataList);
    // return;

    if (this.validationGroup && this.validationGroup.instance) {
      this.validateResult = this.validationGroup.instance.validate();
      if (this.validateResult.isValid) {

        let dataFeild = this.dataInfoEditColumn['field'].replace('displayMin', '').replace('displayMax', '');

        console.log('this.dataInfoEditColumn', this.dataInfoEditColumn)

        if (this.dataInfo['min' + dataFeild] !== this.dataInfoOld['min' + dataFeild]) {
          this.dataInfo['isPaste' + 'Min' + dataFeild] = true;
          this.stateGrid();
        }

        if (this.dataInfo['max' + dataFeild] !== this.dataInfoOld['max' + dataFeild]) {
          this.dataInfo['isPaste' + 'Max' + dataFeild] = true;
          this.stateGrid();
        }

        // this.dataList[this.rowEdit] = this.dataInfo;
        if (this.dataInfoEditColumn.isFrom && this.dataInfo.isAll) {
          this.onAppltAll(this.dataInfo)
        }
        this.calData();
        this.popupVisible = false;
      }
    }
  }

  onCancel() {
    for (var key in this.dataInfo) {
      this.dataInfo[key] = this.dataInfoOld[key]
    }
    this.popupVisible = false;
  }

  itemClick($event, data: any, row: any, columnIndex: any, field: any, isFrom: boolean) {

    const title = 'Setting Volume Constrain';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.isFrom = isFrom;
    this.dataInfoEditColumn.field = field;

    console.log('this.dataInfoEditColumn', this.dataInfoEditColumn);

    if ($event.itemData.text === 'Edit') {
      if (isFrom) {
        this.dataInfoEditColumn.title = `${title} : All`;
        this.dataInfoEditColumn.type = 'all'
      } else {
        month = this.listMonthColumn[columnIndex].month;
        year = this.listMonthColumn[columnIndex].year;
        this.dataInfoEditColumn.title = `${title} : ${month}/${year}`;
        this.dataInfoEditColumn.month = month;
        this.dataInfoEditColumn.year = year;

        if (field.includes('Max')) {
          this.dataInfoEditColumn.type = 'max';
        } else {
          this.dataInfoEditColumn.type = 'min';
        }
      }

      this.dataInfo = data;
      this.popupVisible = true;
      // setTimeout(() => {
      // }, 50);

    } else if ($event.itemData.text === 'Paste') {
      if (this.accessMenu == 1) {
        navigator.clipboard.readText()
          .then((txt: any) => {
            let pastedText = txt;
            pastedText = pastedText.trim('\r\n');
            _.each(pastedText.split('\r\n'), (i2, index) => {
              let runningIndex = columnIndex;
              _.each(i2.split('\t'), (i3) => {
                let dataText = _.toNumber(_.trim(i3).replace(',', ''));
                if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                  if (runningIndex <= 23) {
                    console.log('row', row)
                    console.log('runningIndex', runningIndex)
                    let field = this.listMonthColumn[runningIndex].field;
                    this.dataList[row + index][field] = dataText;
                    this.dataList[row + index]['isPasteM' + runningIndex] = true;
                    runningIndex++;
                    this.calData();
                    console.log('dataList ====> ', this.dataList);
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
      } else {
        Swal.fire({
          title: 'Access Denied',
          text: 'ไม่สามารถทำรายการได้ เนื่องจาก ไม่มีสิทธิ์',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ปิด',
          //timer: 1000
        });
      }

      this.dataInfo = data;
      // this.dataList[this.rowEdit] = this.dataInfo;
    }
  }

  onEditModal() {
    this.popupVisible = false;
  }

  calData() {
    _.each(this.dataList, (item, indexs) => {
      item.id = indexs;
      _.each(this.listMonth, (itemMonth) => {
        const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01')
        item['dayMonthminDisplayM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
        item['dayMonthmaxDisplayM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
        if (item['isCalculateM' + itemMonth.Month + itemMonth.Year] === true) {
          const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01')
          let formulaMin;
          let formulaMax
          if (item['minM' + itemMonth.Month + itemMonth.Year]) {
            formulaMin = _.replace(this.formula, '{0}', item['minM' + itemMonth.Month + itemMonth.Year])
            formulaMin = _.replace(formulaMin, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
          } else {
            formulaMin = null;
          }
          if (item['maxM' + itemMonth.Month + itemMonth.Year]) {
            formulaMax = _.replace(this.formula, '{0}', item['maxM' + itemMonth.Month + itemMonth.Year])
            formulaMax = _.replace(formulaMax, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
          } else {
            formulaMax = null;
          }
          if (item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year] > 0) {
            if (formulaMin) {
              formulaMin = _.replace(this.formulaTurnAround, '{0}', formulaMin)
              formulaMin = _.replace(formulaMin, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
              formulaMin = _.replace(formulaMin, '{2}', _.toNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) - _.toNumber(item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year]))
            }
            if (formulaMax) {
              formulaMax = _.replace(this.formulaTurnAround, '{0}', formulaMax)
              formulaMax = _.replace(formulaMax, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
              formulaMax = _.replace(formulaMax, '{2}', _.toNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) - _.toNumber(item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year]))
            }
          }
          item['displayMinM' + itemMonth.Month + itemMonth.Year] = formulaMin ? eval(formulaMin) : formulaMin;
          item['formulaMinM' + itemMonth.Month + itemMonth.Year] = formulaMin;
          item['displayMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax ? eval(formulaMax) : formulaMax;
          item['formulaMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax;
        } else {
          if (item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year] === 0) {
            item['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
            item['displayMinM' + itemMonth.Month + itemMonth.Year] = item['minM' + itemMonth.Month + itemMonth.Year];
            item['displayMaxM' + itemMonth.Month + itemMonth.Year] = item['maxM' + itemMonth.Month + itemMonth.Year];
            item['formulaMinM' + itemMonth.Month + itemMonth.Year] = null;
            item['formulaMaxM' + itemMonth.Month + itemMonth.Year] = null;
          } else {
            let formulaMax, formulaMin;
            if (item['minM' + itemMonth.Month + itemMonth.Year]) {
              formulaMin = _.replace(this.formulaTurnAround, '{0}', item['minM' + itemMonth.Month + itemMonth.Year])
              formulaMin = _.replace(formulaMin, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
              formulaMin = _.replace(formulaMin, '{2}', _.toNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) - _.toNumber(item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year]))
            } else {
              formulaMin = null;
            }

            if (item['maxM' + itemMonth.Month + itemMonth.Year]) {
              formulaMax = _.replace(this.formulaTurnAround, '{0}', item['maxM' + itemMonth.Month + itemMonth.Year])
              formulaMax = _.replace(formulaMax, '{1}', item['dayMonthM' + itemMonth.Month + itemMonth.Year])
              formulaMax = _.replace(formulaMax, '{2}', _.toNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) - _.toNumber(item['dayTurnAroundM' + itemMonth.Month + itemMonth.Year]))
            } else {
              formulaMax = null
            }


            item['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
            item['displayMinM' + itemMonth.Month + itemMonth.Year] = formulaMin ? eval(formulaMin) : item['minM' + itemMonth.Month + itemMonth.Year];
            item['formulaMinM' + itemMonth.Month + itemMonth.Year] = formulaMin;
            item['displayMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax ? eval(formulaMax) : item['maxM' + itemMonth.Month + itemMonth.Year];
            item['formulaMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax;
          }

        }
      });
    });
  }

  stateGrid() {
    if (this.dataGridList && this.dataGridList.instance) {
      setTimeout(() => {
        this.dataGridList.instance.refresh();
      }, 200);
    }
  }
  getDataSave() {
    let datalist: any = {};
    let dataForm = [];
    let data = [];
    _.each(this.dataList, (item) => {
      dataForm.push({
        product: item.product,
        unit: item.unit,
        source: item.source,
        demand: item.demand,
        deliveryPoint: item.deliveryPoint,
        isCalculate: item.isCalculate,
        year: this.year,//ใช้แต่ ปี เพราะ form จะแยก contract ตามปี
        // month: this.month,
        min: item.min,
        max: item.max,
        isNullMax: item.isNullMax === true ? true : false,//ทำไมเปื่อกรณีเป็น null
        isNullMin: item.isNullMin === true ? true : false,
        isAll: item.isAll,
        // filePath: this.dataInfo.filePath,
        // fileName: this.dataInfo.fileName,
        //version: this.version,
        contractNumber: item.contractNumber,
        contractConditionOfSaleId: item.contractConditionOfSaleId
      })
      _.each(this.listMonth, (itemMonth) => {
        data.push({
          product: item.product,
          unit: item.unit,
          source: item.source,
          demand: item.demand,
          deliveryPoint: item.deliveryPoint,
          yearValue: itemMonth.Year,
          monthValue: itemMonth.Month,
          year: this.year,
          month: this.month,
          isCalculate: item['isCalculateM' + itemMonth.Month + itemMonth.Year],
          min: item['minM' + itemMonth.Month + itemMonth.Year],
          max: item['maxM' + itemMonth.Month + itemMonth.Year],
          isNullMax: item['isNullMaxM' + itemMonth.Month + itemMonth.Year] === true ? true : false,
          isNullMin: item['isNullMinM' + itemMonth.Month + itemMonth.Year] === true ? true : false,
          remark: item['remarkM' + itemMonth.Month + itemMonth.Year],
          dayValue: item['dayMonthM' + itemMonth.Month + itemMonth.Year],
          version: this.version,
          contractNumber: item.contractNumber,
          contractConditionOfSaleId: item.contractConditionOfSaleId,
        })
      })

    })
    datalist.dataForm = dataForm;
    datalist.data = data;
    return datalist;
  }
  getDataMaxVersion(item: any, itemTemp: any) {

    return item.dataListMaxVersion[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  // onAppltAll(event, data) {
  //   console.log("datalist", this.dataList);
  //   _.each(this.listMonth, (item) => {
  //     data["isCalculateM" + item.month] = data.isCalculate
  //     data["minM" + item.month] = data.min
  //     data["maxM" + item.month] = data.max
  //   })
  // }

  onAppltAll(data: any) {
    console.log('datadata', data);
    _.each(this.listMonth, (item) => {
      data["isPasteMinM" + item.Month + item.Year] = true;
      data["isPasteMaxM" + item.Month + item.Year] = true;
      data["isCalculateM" + item.Month + item.Year] = data.isCalculate;
      data["minM" + item.Month + item.Year] = data.min;
      data["maxM" + item.Month + item.Year] = data.max;
      data["isNullMinM" + item.Month + item.Year] = data['isNullMin']
      data["isNullMaxM" + item.Month + item.Year] = data['isNullMax']
    })

    console.log(data)
  }

  setData(data: any) {
    console.log('data', data);
    this.dataList = data;
    _.each(this.dataList, (item, indexs) => {
      item.id = indexs
      item.isApplyAll = false;
      _.each(this.listMonth, (itemMonth) => {
        item['minM' + itemMonth.Month + itemMonth.Year] = item.minM;
        item['maxM' + itemMonth.Month + itemMonth.Year] = item.maxM;
        if (item.isCalculate) {
          const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01')
          item['isCalculateM' + itemMonth.Month + itemMonth.Year] = item.isCalculate;
          let formulaMin = _.replace(this.formula, '{0}', item['minM' + itemMonth.Month + itemMonth.Year] ? item['minM' + itemMonth.Month + itemMonth.Year] : 0)
          formulaMin = _.replace(formulaMin, '{1}', date.daysInMonth())
          let formulaMax = _.replace(this.formula, '{0}', item['maxM' + itemMonth.Month + itemMonth.Year] ? item['maxM' + itemMonth.Month + itemMonth.Year] : 0)
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth())
          formulaMax = _.replace(formulaMax, '{1}', date.daysInMonth())
          item['displayMinM' + itemMonth.Month + itemMonth.Year] = eval(formulaMin);
          item['formulaMinM' + itemMonth.Month + itemMonth.Year] = formulaMin;
          item['displayMaxM' + itemMonth.Month + itemMonth.Year] = eval(formulaMax);
          item['formulaMaxM' + itemMonth.Month + itemMonth.Year] = formulaMax;
        } else {
          item.isCalculate = false;
          item['isCalculateM' + itemMonth.Month + itemMonth.Year] = item.isCalculate;
          item['displayMinM' + itemMonth.Month + itemMonth.Year] = item.minM;
          item['displayMaxM' + itemMonth.Month + itemMonth.Year] = item.maxM;
        }
      });
    });

    // this.stateGrid();
    this.loaderService.hide();
  }

  gridRefresh() {
    if (this.dataGridList && this.dataGridList.instance) {
      this.dataGridList.instance.refresh();
    }

  }
  onVisibleValueChange(event) {
    this.loaderService.show();
    this.subject.next(event);



  }
  onGenFile() {
    let abilityPlanRayongDataGrid = this.dataList;
    //console.log('abilityPlanRayongDataGrid', abilityPlanRayongDataGrid);
    let dataSend: any = {};
    let dataCost = [];
    let dataLRbyLegal = [];
    let dataTankcap = [];
    let data: any = {};
    // data.product = item.product;
    // data.unit = item.unit;
    // data.source = item.source;
    // data.demand = item.demand;
    // data.deliveryPoint = item.deliveryPoint;
    const _string = '_';
    _.each(abilityPlanRayongDataGrid, (item) => {
      _.each(this.listMonth, (itemMonth) => {
        data = {};
        data.key = item.product + _string + item.source + _string + item.demand + _string + item.deliveryPoint + _string + _.padStart(itemMonth.month, 2, '0') + _string + itemMonth.year;
        data.min = item['displayMinM' + itemMonth.Month]
        data.max = item['displayMaxM' + itemMonth.Month]
        dataCost.push(data);
        dataLRbyLegal.push({
          key: 'C3_Legal' + _string + _.padStart(itemMonth.month, 2, '0') + _string + itemMonth.year,
          value: 19
        })
        dataTankcap.push({
          key: 'C3LPG_Tankcap' + _string + _.padStart(itemMonth.month, 2, '0') + _string + itemMonth.year,
          value: 47475.62
        })
        dataTankcap.push({
          key: 'NGL_Tankcap' + _string + _.padStart(itemMonth.month, 2, '0') + _string + itemMonth.year,
          value: 22500
        })
      })

    })

    dataSend.volumeMonth = dataCost
    dataSend.LRbyLegal = dataLRbyLegal
    dataSend.tankCap = dataTankcap
    //console.log('dataSend', dataSend);
  }
  onFocus(event, itemTemp) {
    console.log(itemTemp);
    this.textBoxSelected = itemTemp
  }

  valMonthValueChanged($event, field: any) {
    console.log('$event.value', $event.value);
    this.dataInfo[field] = $event.value;
    // this.dataInfo['isNull' + field] = $event.value == null ? true : false;
  }

  isCalculateValueChanged($event, field: any) {
    this.dataInfo[field] = $event.value;
  }

  isNullMinValueChanged($event, field: any) {
    this.isNullMin = $event.value;
    if (this.dataInfoEditColumn.isFrom === true) {
      this.dataInfo['isNullMin'] = $event.value;
    } else {
      this.dataInfo['isNull' + field] = $event.value;
    }
    if ($event.value === true) {

      this.dataInfo[field] = null;
    }
  }

  isNullMaxValueChanged($event, field: any) {
    this.isNullMax = $event.value;
    if (this.dataInfoEditColumn.isFrom === true) {
      this.dataInfo['isNullMax'] = $event.value;
    } else {
      this.dataInfo['isNull' + field] = $event.value;
    }
    if ($event.value === true) {

      this.dataInfo[field] = null;
    }
  }

  // onCellPrepared(e) {

  //   if (e.rowType === "data") {
  //     e.cellElement.classList.add('hovers');
  //     //e.cellElement.style.padding = '0';
  //   }
  //   if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 5)] === true) {
  //     e.cellElement.classList.add('backgroundColorPaste');
  //   }
  // }

  onCellPrepared(e) {

    if (e.rowType === "data" && e.data.type !== 'Total') {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 5)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
    if (e.rowType === "data" && e.data && e.data["isPaste" + e.column.dataField.replace('display', '')] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }
}
