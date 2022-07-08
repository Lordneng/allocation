import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable, forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { AbilityPentaneService } from 'src/app/service/ability-pentane.service';
import { MasterUnitService } from 'src/app/service/master-unit.service'
import { MasterProductsService } from 'src/app/service/master-products.service'
import { ProductionPlantService } from 'src/app/service/production-plant.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-ability-pentane-data-grid',
  templateUrl: './ability-pentane-data-grid.component.html',
  styleUrls: ['./ability-pentane-data-grid.component.css']
})
export class AbilityPentaneDataGridComponent implements OnInit {
  dataList: any = [];
  dataListOld: any = [];
  listMonth = [];
  dataInfo: any = {};
  dataInfoOld: any = {};
  dataInfoEditColumn: any = {};
  rowEdit: any = 0;
  validateResult: any = { isValid: true };
  calculateSetting: any = [
    {
      name: 'Ton/hr.',
      cal: 'hr'
    },
    {
      name: 'KT/Month',
      cal: 'm'
    }
  ];

  tiers: any = [
    {
      name: 'Pentane Tier1 - ROC',
      value: 1
    },
    {
      name: 'Pentane Tier2 - ROC',
      value: 2
    },
    {
      name: 'Pentane Tier3 - ROC',
      value: 3
    }
  ];

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
  year: any = '2021';
  month: any = moment().format('MM');
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  tmpMonth: any = {};
  formula = '{0} * 24 * {1} / 1000';
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

  constructor(private abilityPentaneService: AbilityPentaneService,
    private masterUnitService: MasterUnitService,
    private masterProductService: MasterProductsService,
    private productionPlant: ProductionPlantService,
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
    let monthStart = dateStart.month();
    let yearStart = dateStart.year();
    for (let index = 1; index <= 13; index++) {
      const data: any = { Year: yearStart, Month: monthStart + 1, MonthName: dateStart.format(this.formatMonthName), visible: true }
      this.listMonth.push(data);

      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month();
      yearStart = dateStart.year();
    }

    this.dynamicColumns = [];
    this.dynamicColumns.push({
      dataField: 'product',
      code: 'product',
      caption: 'โรงแยกก๊าซ',
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


    //History เลิกใช้งาน
    //if (this.isHistory) {
    // this.retrieveMasterDataHistory().subscribe(res => {
    //   this.masterData.abilityPentane = res[0];
    //   this.masterData.abilityPentaneForm = res[1];
    //   this.masterData.masterProducts = res[2];
    //   this.masterData.masterUnit = res[3];
    //   this.masterData.productionPlant = res[4];
    //   this.retrieveData();
    // });
    // } else {
    this.retrieveMasterData().subscribe(res => {
      this.masterData.abilityPentane = res[0];
      this.masterData.abilityPentaneForm = res[1];
      this.masterData.masterProducts = res[2];
      this.masterData.masterUnit = res[3];
      this.masterData.productionPlant = res[4];
      this.retrieveData();
    });
    // }
  }

  retrieveMasterData(): Observable<any> {
    const abilityPentane = this.abilityPentaneService.getList(this.year, this.month, this.version);
    const abilityPentaneForm = this.abilityPentaneService.getFormList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getActiveList();
    const masterUnit = this.masterUnitService.getList();
    const productionPlant = this.productionPlant.getList();
    return forkJoin([abilityPentane, abilityPentaneForm, masterProducts, masterUnit, productionPlant]);
  }

  retrieveMasterDataHistory(): Observable<any> {
    const abilityPentane = this.abilityPentaneService.getListHistory(this.year, this.month, this.version);
    const abilityPentaneForm = this.abilityPentaneService.getFormList(this.year, this.month, this.version);
    const masterProducts = this.masterProductService.getActiveList();
    const masterUnit = this.masterUnitService.getList();
    const productionPlant = this.productionPlant.getList();
    return forkJoin([abilityPentane, abilityPentaneForm, masterProducts, masterUnit, productionPlant]);
  }

  async retrieveData(isRetrospective: any = true) {
    let datas: any = [];

    // if (this.masterData.abilityPentane && this.masterData.abilityPentane.length === 0 && isRetrospective === true) {
    //   this.month = this.month - 1;

    //   let res: any = await this.abilityPentaneService.getMonthMaxVersion(this.year, this.month)

    //   if(res.length > 0){
    //     const lastVersion = res[0]
    //     this.version = lastVersion.version;
    //     this.retrieveMasterData().subscribe(res => {
    //       this.masterData.abilityPentane = res[0];
    //       this.masterData.abilityPentaneForm = res[1];
    //       this.masterData.masterProducts = res[2];
    //       this.masterData.masterUnit = res[3];
    //       this.masterData.productionPlant = res[4];
    //       this.retrieveData(false);
    //     });
    //   }

    //   this.month = this.month + 1;
    // }

    this.masterData.pentane = _.filter(this.masterData.masterProducts, (itemProduct) => {
      return itemProduct.productCode === 'Pentane';
    });

    _.each(this.masterData.pentane, (item, index) => {
      let plants = _.filter(this.masterData.productionPlant, (itemProduct) => {
        return itemProduct.code === 'GSP6';
      });

      _.each(plants, (itemPlant) => {

        let unit = _.find(this.masterData.masterUnit, (itemProduct) => {
          return itemProduct.code === item.productCode;
        });

        let productItem: any = {};
        productItem.id = index;
        productItem.productId = item.id;
        productItem.unit = unit.fullName;
        productItem.unitId = unit.id;
        productItem.product = itemPlant.name;
        productItem.productionPlantId = itemPlant.id;
        productItem.rowOrder = itemPlant.rowOrder;

        let data = _.filter(this.masterData.abilityPentane, (itemProduct) => {
          return itemProduct.productId === item.id;
        });

        let dataForm = _.find(this.masterData.abilityPentaneForm, (itemProduct) => {
          return itemProduct.product === itemPlant.fullName;
        });

        productItem.isCalculate = dataForm && dataForm.isCalculate ?
          'hr' : dataForm && !dataForm.isCalculate ? 'm' : 'm';
        productItem.valMonthM = dataForm ? dataForm.value : 0;
        productItem.dayMonthM = dataForm ? dataForm.dayValue : 0;
        productItem.isAll = dataForm ? dataForm.isAll : true;
        productItem.tierM = dataForm ? _.toInteger(dataForm.tierCode) : 2;

        _.each(this.listMonth, (itemMonth) => {

          const dataFormBase = _.find(data, (itemBase) => {
            return itemBase.monthValue === itemMonth.Month && itemBase.yearValue === itemMonth.Year;
          })

          const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');

          if (dataFormBase) {

            productItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = dataFormBase.isCalculate ?
              'hr' : !dataFormBase.isCalculate ? 'm' : 'm';
            productItem['M' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
            productItem['valMonthM' + itemMonth.Month + itemMonth.Year] = dataFormBase.value;
            productItem['tierM' + itemMonth.Month + itemMonth.Year] = _.toInteger(dataFormBase.tierCode);
            productItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = dataFormBase.dayValue;
            productItem['RemarkM' + itemMonth.Month + itemMonth.Year] = dataFormBase.remark;
          } else {
            //his.dataDayMonth['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
            productItem['isCalculateM' + itemMonth.Month + itemMonth.Year] = 'm';
            productItem['M' + itemMonth.Month + itemMonth.Year] = 0;
            productItem['valMonthM' + itemMonth.Month + itemMonth.Year] = 0;
            productItem['tierM' + itemMonth.Month + itemMonth.Year] = 2;
            productItem['dayMonthM' + itemMonth.Month + itemMonth.Year] = date.daysInMonth();
            productItem['RemarkM' + itemMonth.Month + itemMonth.Year] = null;
          }
        });

        datas.push(productItem);
      })

    });

    this.dataList.data = datas;

    // if (this.dataList.data && this.dataList.data.length <= 0) {

    //   _.each(this.masterData.pentane, (item, index) => {

    //     let plants =  _.filter(this.masterData.productionPlant, (itemProduct) => {
    //       return itemProduct.code === item.productCode;
    //     });

    //     _.each(plants, (itemPlant) => {

    //       let unit = _.find(this.masterData.masterUnit, (itemProduct) => {
    //         return itemProduct.code === item.productCode;
    //       });

    //       let dataProduct : any = {};
    //       dataProduct.id = index;
    //       dataProduct.productId = item.id;
    //       dataProduct.product = itemPlant.fullName;
    //       dataProduct.rowOrder = itemPlant.rowOrder;
    //       dataProduct.productionPlantId = itemPlant.id;
    //       dataProduct.unit = unit.fullName;
    //       dataProduct.unitId = unit.id;

    //       _.each(this.listMonth, (itemMonth, index) => {
    //         const date = moment(itemMonth.Year + '-' + itemMonth.Month + '-01');
    //         dataProduct['tierM' + itemMonth.Month + itemMonth.Year] = 2;
    //         dataProduct['isCalculateM' + itemMonth.Month + itemMonth.Year] = false;
    //         dataProduct['dayMonthM' +  itemMonth.Month + itemMonth.Year] =  date.daysInMonth();
    //       });

    //       datas.push(dataProduct);
    //     })

    //   });
    // }

    this.calData();
    this.loaderService.hide();
    console.log(this.dataList.data);
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
        const date = moment(itemMonth.year + '-' + itemMonth.month + '-01')
        if (item['isCalculateM' + itemMonth.Month + itemMonth.Year] === 'hr') {
          let formulaValMonth = _.replace(this.formula, '{0}', item['valMonthM' + itemMonth.Month + itemMonth.Year] ? item['valMonthM' + itemMonth.Month + itemMonth.Year] : 0)
          formulaValMonth = _.replace(formulaValMonth, '{1}', _.isNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) ? item['dayMonthM' + itemMonth.Month + itemMonth.Year] : date.daysInMonth())
          item["M" + itemMonth.Month + itemMonth.Year] = eval(formulaValMonth);
          item['dayMonthM' + itemMonth.Month + itemMonth.Year] = item['dayMonthM' + itemMonth.Month + itemMonth.Year];
          item['formulaM' + itemMonth.Month + itemMonth.Year] = formulaValMonth;
        } else {
          item['isCalculateM' + itemMonth.Month + itemMonth.Year] = 'm';
          item['dayMonthM' + itemMonth.Month + itemMonth.Year] = _.isNumber(item['dayMonthM' + itemMonth.Month + itemMonth.Year]) ? item['dayMonthM' + itemMonth.Month + itemMonth.Year] : date.daysInMonth();
          item["M" + itemMonth.Month + itemMonth.Year] = item['valMonthM' + itemMonth.Month + itemMonth.Year];
          item['formulaM' + itemMonth.Month + itemMonth.Year] = null;
        }
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
        // this.dataList.data[this.rowEdit] = this.dataInfo;
        if (this.dataInfoEditColumn.isFrom && this.dataInfo.isAll) {
          this.onAppltAll(this.dataList.data[this.rowEdit])
        }
        this.calData();
        this.popupVisible = false;
      } else {
        this.validateResult.brokenRules[0].validator.focus();
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

  itemClick($event, data: any, row: any, columnIndex: any, field: any, isFrom: boolean) {
    console.log('itemClick -> data', data)
    const title = 'Setting Ability Pentane';
    let month: any = 1;
    let year: any = 1;
    this.rowEdit = row;
    this.dataInfoOld = _.cloneDeep(data);
    this.dataInfoEditColumn.index = columnIndex;
    this.dataInfoEditColumn.isFrom = isFrom;
    this.dataInfoEditColumn.field = field;

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
            _.each(i2.split('\t'), (i3) => {
              let dataText = _.toNumber(_.trim(i3).replace(',', ''));
              if (((dataText && _.isNumber(dataText)) || dataText === 0) && i3 !== '') {
                if (columnIndex <= 12) {
                  let month = this.listMonth[runningIndex].Month;
                  let year = this.listMonth[runningIndex].Year;
                  this.dataList.data[row + index]['valMonthM' + month + year] = dataText;
                  this.dataList.data[row + index]['isPasteM' + runningIndex] = true;
                  runningIndex++;
                  this.calData();
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

  onEditModal() {
    this.popupVisible = false;
  }

  getDataSave() {
    let dataSave: any = {};
    let datalist = [];
    let dataForm = [];
    console.log(this.dataList.data)
    _.each(this.dataList.data, (itemList) => {
      let tier = _.find(this.tiers, (tier) => {
        return tier.value === itemList['tierM'];
      });
      let data: any = {};
      data.productId = itemList['productId'];
      data.unitId = itemList['unitId'];
      data.productionPlantId = itemList['productionPlantId'];
      data.product = itemList['product'];
      data.year = this.year;
      data.month = this.month;
      data.rowOrder = _.toNumber(itemList['rowOrder'])
      data.version = this.version;
      data.tierName = tier.name;

      let form: any = {}
      form.productId = data.productId;
      form.product = data.product;
      form.year = data.year;
      form.month = data.month;
      form.rowOrder = data.rowOrder;
      form.isCalculate = itemList['isCalculate'] === 'hr' ? true : false;
      form.value = itemList['valMonthM'];
      form.version = data.version
      form.tierCode = itemList['tierM'];
      form.tierName = data.tierName;
      form.isAll = itemList['isAll'];
      dataForm.push(form);

      _.each(this.listMonth, (itemMonth) => {
        let tierMonth = _.find(this.tiers, (tier) => {
          return tier.value === itemList['tierM' + itemMonth.Month + itemMonth.Year];
        });
        let productData: any = {}
        productData.product = itemList['product'];
        productData.productId = itemList['productId'];
        productData.unitId = itemList['unitId'];
        productData.productionPlantId = itemList['productionPlantId'];
        productData.year = data.year;
        productData.month = data.month;
        productData.rowOrder = data.rowOrder
        productData.version = data.version;
        productData.monthValue = itemMonth.Month;
        productData.yearValue = itemMonth.Year;
        productData.value = itemList["valMonthM" + itemMonth.Month + itemMonth.Year];
        productData.dayValue = itemList["dayMonthM" + itemMonth.Month + itemMonth.Year];
        productData.isCalculate = itemList["isCalculateM" + itemMonth.Month + itemMonth.Year] === 'hr' ? true : false,
          productData.tierCode = itemList["tierM" + itemMonth.Month + itemMonth.Year];
        productData.tierName = tierMonth.name;
        productData.remark = itemList["RemarkM" + itemMonth.Month + itemMonth.Year];
        datalist.push(productData);
      })

    })

    dataSave.dataList = datalist;
    dataSave.dataForm = dataForm;
    return dataSave;
  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.data[itemTemp.rowIndex][itemTemp.column.dataField]
  }

  onAppltAll(data: any) {
    _.each(this.listMonth, (item) => {
      data["isCalculateM" + item.Month + item.Year] = data.isCalculate;
      data["dayMonthM" + item.Month + item.Year] = data.dayMonthM ? data.dayMonthM : data["dayMonthM" + item.Month + item.Year];
      data["tierM" + item.Month + item.Year] = data.tierM ? data.tierM : data["tierM" + item.Month + item.Year];
      data["valMonthM" + item.Month + item.Year] = data.valMonthM;
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

    if (e.rowType === "data") {
      e.cellElement.classList.add('hovers');
      //e.cellElement.style.padding = '0';
    }
    if (e.rowType === "data" && e.data && e.data["isPasteM" + (e.columnIndex - 2)] === true) {
      e.cellElement.classList.add('backgroundColorPaste');
    }
  }

  checkNullValue(e: any) {
    this.numberBoxDigi = (this.numberBoxDigi ? this.numberBoxDigi : 0);
  }

}
