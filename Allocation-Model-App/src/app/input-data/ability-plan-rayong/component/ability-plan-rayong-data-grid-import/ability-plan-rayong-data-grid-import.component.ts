import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable } from 'rxjs';
import { AbilityPlanRayongService } from 'src/app/service/ability-plan-rayong.service';
import * as _ from 'lodash';
import { MasterProductsService } from '../../../../service/master-products.service';
import { MasterUnitService } from '../../../../service/master-unit.service';
import { ProductionPlantService } from '../../../../service/production-plant.service';
import * as moment from 'moment';
@Component({
  selector: 'app-ability-plan-rayong-data-grid-import',
  templateUrl: './ability-plan-rayong-data-grid-import.component.html',
  styleUrls: ['./ability-plan-rayong-data-grid-import.component.css'],
})
export class AbilityPlanRayongDataGridImportComponent implements OnInit {
  listMonth = [];
  dataList: any = {
    monthNow: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p1: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p2: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p3: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p4: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p5: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p6: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p7: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p8: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p9: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p10: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p11: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    , p12: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
  };
  dataSum: any = [];
  dataFormExcel: any = [];
  dataSheet: any = { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] };
  dynamicColumns: any[] = [];
  productData = [
    { id: 0, product: 'C2', rowOrder: 0 },
    { id: 1, product: 'C3/LPG', rowOrder: 1 },
    { id: 2, product: 'NGL', rowOrder: 2 },
    { id: 3, product: 'C3', rowOrder: 3 },
    { id: 4, product: 'LPG', rowOrder: 4 },
  ];
  sheets: any = [];
  masterData: any = {};
  listData: any = [];
  cellTemplate = 'cellTemplate';
  formatMonthName = 'MMM-yyyy';
  version: any = 1;
  isHistory = false;
  sheetValue = '';
  monthSelect = '- Select Sheet -';

  sheetNameObj: any = ['monthNow', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'];
  productObj: any = ['c2', 'ngl', 'c3', 'lpg'];
  isOpen: any = true;
  @Input() numberBoxReadOnly = true;
  @Input() year: any = 2021;
  @Input() month: any = 1;
  @Input() maxVersion: any = 0;

  @Output() onEventDataMonthDaily = new EventEmitter();
  @ViewChild('dataGridEthene', { static: false })
  dataGridEthene: DxDataGridComponent;
  @ViewChild('dataGridNgl', { static: false }) dataGridNgl: DxDataGridComponent;
  @ViewChild('dataGridC3', { static: false }) dataGridC3: DxDataGridComponent;
  @ViewChild('dataGridLpg', { static: false }) dataGridLpg: DxDataGridComponent;

  constructor(
    // private masterUnitService: MasterUnitService,
    // private masterProductService: MasterProductsService,
    // private productionPlant: ProductionPlantService,
    // private abilityPlanRayong: AbilityPlanRayongService,
    // private loaderService: NgxSpinnerService
  ) { }

  ngOnInit(): void { }

  async onYearChange(
    masterData: any,
    year: any,
    month: any,
    version: any,
    maxVersion: any,
    isHistory: any,
    isImport: any
  ) {
    this.sheetValue = "";
    this.sheets = [];
    this.isHistory = isHistory;
    this.year = year;
    this.month = month;
    this.version = version;
    this.maxVersion = maxVersion;
    this.dataList = {
      monthNow: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [], gc: [] }
      , p1: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p2: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p3: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p4: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p5: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p6: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p7: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p8: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p9: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p10: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p11: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
      , p12: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    };

    this.masterData = masterData;
    if (!isImport) {
      this.retrieveData();
    }
    // this.retrieveMasterData().subscribe((res) => {
    //   this.masterData.masterProducts = res[0];
    //   this.masterData.masterUnit = res[1];
    //   this.masterData.productionPlant = res[2];
    //   this.masterData.abilityDaily = res[3];
    //   this.masterData.abilityList = res[4];
    //   if (!isImport) {
    //     this.retrieveData();
    //   }
    // });
  }

  // retrieveMasterData(): Observable<any> {

  //   console.log(this.year, this.month, this.version);
  //   const masterProducts = this.masterProductService.getList();
  //   const masterUnit = this.masterUnitService.getList();
  //   const productionPlant = this.productionPlant.getList();

  //   const abilityDaily = this.abilityPlanRayong.getDaily(this.year, this.month, this.version);
  //   const abilityList = this.abilityPlanRayong.getList(this.year, this.month, this.version);
  //   return forkJoin([
  //     masterProducts, masterUnit, productionPlant,
  //     abilityDaily, abilityList
  //   ]);

  // }

  retrieveData() {
    //monthNow: { c2: [], c3Lpg: [], ngl: [], c3: [], lpg: [] }
    if (this.masterData.abilityDaily && this.masterData.abilityDaily.length > 0) {

      const date = moment(this.year + '-' + _.padStart(this.month, 2, '0') + '-01');
      const dateEnd = moment(date).add(12, 'M');
      let i = 0;
      for (let index = date; index <= dateEnd; index = moment(index).add(1, 'M')) {
        const arryData = _.filter(this.masterData.abilityDaily, (item) => {
          return moment(item.date).format('YYYY-MM') === index.format('YYYY-MM');
        })
        if (arryData.length > 0) {
          this.setDataFormDataBase(arryData, 'Ethane', 'c2', index, i);
          // this.setDataFormDataBase(arryData, 'NGL', 'ngl', index, i);
          // this.setDataFormDataBase(arryData, 'C3', 'c3', index, i);
          // this.setDataFormDataBase(arryData, 'LPG', 'lpg', index, i);
        }
        i++;
      }
    }
    this.sheetValue = 'monthNow';
    this.getDataMonthDaily()
    this.onEventDataMonthDaily.emit(this.dataSum);
    this.dataSheet = this.dataList[this.sheetValue];
    // this.loaderService.hide();
    return this.dataSum;
  }
  async setDataFormDataBase(arryData, productName, productObj, index, i) {
    const dataProduct = _.filter(arryData, (item) => {
      return _.trim(item.product) === productName;
    });

    let obj: any = {};
    let dayDate = moment(index).add(-1, 'day');
    for (let day = 1; day <= index.daysInMonth(); day++) {
      dayDate = dayDate.add(1, 'day');

      const dataDay = _.filter(dataProduct, (data) => {
        return moment(data.date).format('YYYY-MM-DD') === moment(dayDate).format('YYYY-MM-DD');

      })
      if (dataDay.length > 0) {
        if (dayDate.format('YYYY-MM-DD') === index.format('YYYY-MM-DD')) {
          const dataSheet = _.find(this.sheets, (itemSheet) => {
            return itemSheet.sheet === this.sheetNameObj[i];
          })
          if (!dataSheet) {
            this.sheets.push({ name: dataDay[0].sheetName, sheet: this.sheetNameObj[i] })
          }
        }
        obj = {};
        _.each(dataDay, (data) => {
          obj.createDate = data.date;
          if (data.productionPlant === 'GSP1') {
            obj.gsP1 = data.value;
          }
          if (data.productionPlant === 'GSP2') {
            obj.gsP2 = data.value;
          }
          if (data.productionPlant === 'GSP3') {
            obj.gsP3 = data.value;
          }
          if (data.productionPlant === 'GSP5') {
            obj.gsP5 = data.value;
          }
          if (data.productionPlant === 'GSP6') {
            obj.gsP6 = data.value;
          }
          if (data.productionPlant === 'Stab') {
            obj.stab = data.value;
          }
          if (data.productionPlant === 'ESP') {
            obj.esp = data.value;
          }
          if (data.productionPlant === 'low CO2') {
            obj.lowcO2 = data.value;
          }
          if (data.productionPlant === 'High CO2') {
            obj.highcO2 = data.value;
          }
          // if (data.productionPlant === 'GC') {
          //   obj.GC = data.value;
          // }

          obj.total = (obj.gsP1 + obj.gsP2 + obj.gsP3 + obj.gsP5 + obj.gsP6 + obj.esp);
          obj.avg = (obj.total ? obj.total / 24 : 0);
          obj.tonhr = ((obj.lowcO2 + obj.highcO2) / 24);

        });

        this.dataList[this.sheetNameObj[i]][productObj].push(_.cloneDeep(obj));
      }
    }
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
          data[row + index]['M' + month + year] = _.trim(i3).replace(',', '');
        }
      });
    });

    return false;
  }

  getDataSave() {
    let dataSave: any = [];
    let obj: any = {};

    _.each(this.sheetNameObj, (item) => {
      dataSave = _.concat(dataSave, this.getDataFormDataList(item));
    })
    // obj.dataSave = dataSave;
    return dataSave;
  }

  getDataFormDataList(sheetName: any) {
    let obj: any = {};
    let listData: any = [];
    _.each(this.productObj, (productObjName) => {
      const data = this.dataList[sheetName][productObjName];
      _.each(data, (item) => {
        //_.each(itemData, (item) => {
        obj = {};
        obj.date = item.createDate;
        obj.year = this.year;
        obj.month = this.month;
        const sheet = _.find(this.sheets, (itemProduct) => {
          return itemProduct.sheet === sheetName;
        })

        obj.sheetName = sheet.name;
        const data = _.find(this.masterData.masterProducts, (itemProduct) => {
          return _.toUpper(_.trim(itemProduct.productShortName)) === _.toUpper(_.trim(item.product)) || _.toUpper(_.trim(itemProduct.productName)) === _.toUpper(_.trim(item.product));
        })
        //เอาเฉพาะ product ที่มีในระบบเท่านั้น
        if (data) {
          obj.productId = data.id;
          obj.product = _.trim(item.product);
          if (item.gsP1) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'GSP1';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'GSP1';
              obj.value = item.gsP1;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.gsP2) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'GSP2';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'GSP2';
              obj.value = item.gsP2;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.gsP3) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'GSP3';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'GSP3';
              obj.value = item.gsP3;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.gsP5) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'GSP5';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'GSP5';
              obj.value = item.gsP5;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.gsP6) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'GSP6';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'GSP6';
              obj.value = item.gsP6;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.esp) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'ESP';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'ESP';
              obj.value = item.esp;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.stab) {
            const dataProductionPlant = _.find(this.masterData.productionPlant, (itemProduct) => {
              return itemProduct.code === 'Stab';
            })
            if (dataProductionPlant) {
              obj.productionPlantId = dataProductionPlant.id;
              obj.productionPlant = 'Stab';
              obj.value = item.stab;
              listData.push(_.cloneDeep(obj));
            }
          }
          if (item.lowcO2) {
            obj.productionPlantId = null;
            obj.productionPlant = 'low CO2';
            obj.value = item.lowcO2;
            listData.push(_.cloneDeep(obj));
          }
          if (item.highcO2) {
            obj.productionPlantId = null;
            obj.productionPlant = 'High CO2';
            obj.value = item.highcO2;
            listData.push(_.cloneDeep(obj));
          }
          if (item.lpgPetro) {
            obj.productionPlantId = null;
            obj.productionPlant = 'LPG-Petro';
            obj.value = item.lpgPetro;
            listData.push(_.cloneDeep(obj));
          }
          if (item.lpgDomestic) {
            obj.productionPlantId = null;
            obj.productionPlant = 'LPG-Domestic';
            obj.value = item.lpgDomestic;
            listData.push(_.cloneDeep(obj));
          }
        }
        //});
      });
    })

    return listData;
  }

  getDataMaxVersion(itemTemp: any) {
    return this.dataList.data[itemTemp.rowIndex][itemTemp.column.dataField];
  }

  setData(data: any) {
    this.dataFormExcel = data;
    console.log('excel', this.dataFormExcel);
    if (this.dataFormExcel.monthNow && this.dataFormExcel.monthNow.length > 0) {
      const date = moment(this.dataFormExcel.monthNow[0].createDate);
      this.year = date.year(); // กำหนดเดือนปีของข้อมูลจากการ import excel
      this.month = date.month() + 1;
    }
    _.each(this.sheetNameObj, (item) => {
      this.setDataFormExcel(item);
    })

    this.sheetValue = 'monthNow';
    this.getDataMonthDaily()
    // this.loaderService.hide();
    this.dataSheet = this.dataList[this.sheetValue];
    return this.dataSum;
  }

  setDataFormExcel(sheetName: any) {

    if (this.dataFormExcel[sheetName]) {
      const monthNowSheet = { name: this.dataFormExcel[sheetName][0].name, sheet: sheetName };
      this.sheets.push(monthNowSheet);

      const dataEthaneExcel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'Ethane';
      });

      const datac3LpgExcel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'C3/LPG';
      });

      const dataNglExcel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'NGL';
      });

      const dataC3Excel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'C3';
      });

      const dataLpgExcel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'LPG';
      });

      const dataC2Excel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'C2';
      });

      const dataGcExcel = _.filter(this.dataFormExcel[sheetName], (itemExcel) => {
        return _.trim(itemExcel.product) === 'GC';
      });

      _.each(dataEthaneExcel, (itemData) => {
        this.dataList[sheetName].c2.push(itemData);
      });

      _.each(datac3LpgExcel, (itemData) => {
        this.dataList[sheetName].c3Lpg.push(itemData);
      });

      _.each(dataNglExcel, (itemData) => {
        this.dataList[sheetName].ngl.push(itemData);
      });

      _.each(dataC3Excel, (itemData) => {
        this.dataList[sheetName].c3.push(itemData);
      });

      _.each(dataLpgExcel, (itemData) => {
        this.dataList[sheetName].lpg.push(itemData);
      });

      _.each(dataGcExcel, (itemData) => {
        this.dataList[sheetName].gc.push(itemData);
      });

      _.each(dataC2Excel, (itemData) => {
        const data = _.find(this.dataList[sheetName].c2, (item) => {
          return item.createDate === itemData.createDate;
        })
        if (data) {
          data.highcO2 = itemData.highcO2;
          data.lowcO2 = itemData.lowcO2;
          data.tonhr = itemData.tonhr;
        }
      });

    }

  }

  onValueChanged(e) {
    console.log(this.dataList);
    const newValue = e.value;
    if (newValue) {
      this.dataSheet = this.dataList[newValue];
    }

    // const date = new Date(this.dataSheet.c2[0].createDate);
    // const month = date.toLocaleString('default', { month: 'long' });
    // this.monthSelect = month + ' ' + date.getFullYear();
  }

  gridRefresh() {
    //this.isOpen = true;
    this.isOpenChange(true, 'Ethane');
    this.isOpenChange(true, 'ngl');
    this.isOpenChange(true, 'c3');
    this.isOpenChange(true, 'lpg');

  }

  isOpenChange(event, type) {
    console.log('event', event)
    if (event === true) {
      if (type === 'Ethane') {
        if (this.dataGridEthene && this.dataGridEthene.instance) {
          this.dataGridEthene.instance.state(null)
        }
      } else if (type === 'ngl') {
        if (this.dataGridNgl && this.dataGridNgl.instance) {
          this.dataGridNgl.instance.state(null)
        }
      } else if (type === 'c3') {
        if (this.dataGridC3 && this.dataGridC3.instance) {
          this.dataGridC3.instance.state(null)
        }
      } else if (type === 'lpg') {
        if (this.dataGridLpg && this.dataGridLpg.instance) {
          this.dataGridLpg.instance.state(null)
        }
      }
    }
  }

  dataC2: any = [{ id: 1, product: 'C2', productionPlant: 'GSP1' }
    , { id: 2, product: 'C2', productionPlant: 'GSP2' }
    , { id: 3, product: 'C2', productionPlant: 'GSP3' }
    , { id: 4, product: 'C2', productionPlant: 'GSP5' }
    , { id: 5, product: 'C2', productionPlant: 'GSP6' }
    , { id: 6, product: 'C2', productionPlant: 'ESP' }
    , { id: 7, product: 'C2', productionPlant: 'Total' }
    , { id: 8, product: 'C2', productionPlant: 'Low CO2' }
    , { id: 9, product: 'C2', productionPlant: 'High CO2' }
  ];
  dataC3LPG: any = [{ id: 10, product: 'C3/LPG', productionPlant: 'GSP1' }
    , { id: 11, product: 'C3/LPG', productionPlant: 'GSP2' }
    , { id: 12, product: 'C3/LPG', productionPlant: 'GSP3' }
    , { id: 13, product: 'C3/LPG', productionPlant: 'GSP5' }
    , { id: 14, product: 'C3/LPG', productionPlant: 'GSP6' }
    , { id: 15, product: 'C3/LPG', productionPlant: 'Total' }
  ];
  dataC3: any = [{ id: 16, product: 'C3', productionPlant: 'GSP1' }
    , { id: 17, product: 'C3', productionPlant: 'GSP2' }
    , { id: 18, product: 'C3', productionPlant: 'GSP3' }
    , { id: 19, product: 'C3', productionPlant: 'GSP5' }
    , { id: 20, product: 'C3', productionPlant: 'GSP6' }
    , { id: 21, product: 'C3', productionPlant: 'Total' }
  ];
  dataLPG: any = [{ id: 22, product: 'LPG', productionPlant: 'GSP1' }
    , { id: 23, product: 'LPG', productionPlant: 'GSP2' }
    , { id: 24, product: 'LPG', productionPlant: 'GSP3' }
    , { id: 25, product: 'LPG', productionPlant: 'GSP5' }
    , { id: 26, product: 'LPG', productionPlant: 'GSP6(Butane)' }
    , { id: 27, product: 'LPG', productionPlant: 'Total' }
    , { id: 28, product: 'LPG', productionPlant: 'LPG-Petro' }
    , { id: 29, product: 'LPG', productionPlant: 'LPG-Domestic' }
  ];
  dataNGL: any = [{ id: 30, product: 'NGL', productionPlant: 'GSP1' }
    , { id: 31, product: 'NGL', productionPlant: 'GSP2' }
    , { id: 32, product: 'NGL', productionPlant: 'GSP3' }
    , { id: 33, product: 'NGL', productionPlant: 'GSP5' }
    , { id: 34, product: 'NGL', productionPlant: 'GSP6' }
    , { id: 35, product: 'NGL', productionPlant: 'Stab' }
    , { id: 36, product: 'NGL', productionPlant: 'Total' }
  ];
  dataGC: any = [{ id: 37, product: 'C2', productionPlant: 'Low CO2' }
    , { id: 38, product: 'C2', productionPlant: 'High CO2' }
    , { id: 39, product: 'NGL', productionPlant: 'Total' }
  ];

  getDataMonthDaily() {
    this.dataSum = [];
    let dateStart = moment(this.year + '-' + this.month + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');
    let i = 0;
    const oneThousand = 1000;

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      //C2
      let dataGsp1C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.gsP1) });
      let dataGsp2C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.gsP2) });
      let dataGsp3C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.gsP3) });
      let dataGsp5C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.gsP5) });
      let dataGsp6C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.gsP6) });
      let dataespC2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.esp) });
      let datalowcO2C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.lowcO2) });
      let datahighcO2C2 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c2'], (item) => { return _.toNumber(item.highcO2) });

      this.dataC2[0]['M' + index.format('MYYYY')] = dataGsp1C2 / oneThousand;
      this.dataC2[1]['M' + index.format('MYYYY')] = dataGsp2C2 / oneThousand;
      this.dataC2[2]['M' + index.format('MYYYY')] = dataGsp3C2 / oneThousand;
      this.dataC2[3]['M' + index.format('MYYYY')] = dataGsp5C2 / oneThousand;
      this.dataC2[4]['M' + index.format('MYYYY')] = dataGsp6C2 / oneThousand;
      this.dataC2[5]['M' + index.format('MYYYY')] = dataespC2 / oneThousand;
      this.dataC2[6]['M' + index.format('MYYYY')] = (dataGsp1C2 + dataGsp2C2 + dataGsp3C2 + dataGsp5C2 + dataGsp6C2 + dataespC2) / 1000;
      this.dataC2[7]['M' + index.format('MYYYY')] = datalowcO2C2 / oneThousand;
      this.dataC2[8]['M' + index.format('MYYYY')] = datahighcO2C2 / oneThousand;

      //C3
      let dataGsp1C3 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c3'], (item) => { return _.toNumber(item.gsP1) });
      let dataGsp2C3 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c3'], (item) => { return _.toNumber(item.gsP2) });
      let dataGsp3C3 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c3'], (item) => { return _.toNumber(item.gsP3) });
      let dataGsp5C3 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c3'], (item) => { return _.toNumber(item.gsP5) });
      let dataGsp6C3 = _.sumBy(this.dataList[this.sheetNameObj[i]]['c3'], (item) => { return _.toNumber(item.gsP6) });

      this.dataC3[0]['M' + index.format('MYYYY')] = dataGsp1C3 / oneThousand;
      this.dataC3[1]['M' + index.format('MYYYY')] = dataGsp2C3 / oneThousand;
      this.dataC3[2]['M' + index.format('MYYYY')] = dataGsp3C3 / oneThousand;
      this.dataC3[3]['M' + index.format('MYYYY')] = dataGsp5C3 / oneThousand;
      this.dataC3[4]['M' + index.format('MYYYY')] = dataGsp6C3 / oneThousand;
      this.dataC3[5]['M' + index.format('MYYYY')] = (dataGsp1C3 + dataGsp2C3 + dataGsp3C3 + dataGsp5C3 + dataGsp6C3) / oneThousand;

      //ngl
      let dataGsp1ngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.gsP1) });
      let dataGsp2ngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.gsP2) });
      let dataGsp3ngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.gsP3) });
      let dataGsp5ngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.gsP5) });
      let dataGsp6ngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.gsP6) });
      let dataStabngl = _.sumBy(this.dataList[this.sheetNameObj[i]]['ngl'], (item) => { return _.toNumber(item.stab) });

      this.dataNGL[0]['M' + index.format('MYYYY')] = dataGsp1ngl / oneThousand;
      this.dataNGL[1]['M' + index.format('MYYYY')] = dataGsp2ngl / oneThousand;
      this.dataNGL[2]['M' + index.format('MYYYY')] = dataGsp3ngl / oneThousand;
      this.dataNGL[3]['M' + index.format('MYYYY')] = dataGsp5ngl / oneThousand;
      this.dataNGL[4]['M' + index.format('MYYYY')] = dataGsp6ngl / oneThousand;
      this.dataNGL[5]['M' + index.format('MYYYY')] = dataStabngl / oneThousand;
      this.dataNGL[6]['M' + index.format('MYYYY')] = (dataGsp1ngl + dataGsp2ngl + dataGsp3ngl + dataGsp5ngl + dataGsp6ngl + dataStabngl) / oneThousand;

      //lpg
      let dataGsp1lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.gsP1) });
      let dataGsp2lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.gsP2) });
      let dataGsp3lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.gsP3) });
      let dataGsp5lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.gsP5) });
      let dataGsp6lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.gsP6) });
      let datalowcO2lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.lpgPetro) });
      let datahighcO2lpg = _.sumBy(this.dataList[this.sheetNameObj[i]]['lpg'], (item) => { return _.toNumber(item.lpgDomestic) });

      this.dataLPG[0]['M' + index.format('MYYYY')] = dataGsp1lpg / oneThousand;
      this.dataLPG[1]['M' + index.format('MYYYY')] = dataGsp2lpg / oneThousand;
      this.dataLPG[2]['M' + index.format('MYYYY')] = dataGsp3lpg / oneThousand;
      this.dataLPG[3]['M' + index.format('MYYYY')] = dataGsp5lpg / oneThousand;
      this.dataLPG[4]['M' + index.format('MYYYY')] = dataGsp6lpg / oneThousand;
      this.dataLPG[5]['M' + index.format('MYYYY')] = (dataGsp1lpg + dataGsp2lpg + dataGsp3lpg + dataGsp5lpg + dataGsp6lpg) / oneThousand;
      this.dataLPG[6]['M' + index.format('MYYYY')] = datalowcO2lpg / oneThousand;
      this.dataLPG[7]['M' + index.format('MYYYY')] = datahighcO2lpg / oneThousand;

      this.dataC3LPG[0]['M' + index.format('MYYYY')] = (dataGsp1C3 + dataGsp1lpg) / oneThousand;
      this.dataC3LPG[1]['M' + index.format('MYYYY')] = (dataGsp2C3 + dataGsp2lpg) / oneThousand;
      this.dataC3LPG[2]['M' + index.format('MYYYY')] = (dataGsp3C3 + dataGsp3lpg) / oneThousand;
      this.dataC3LPG[3]['M' + index.format('MYYYY')] = (dataGsp5C3 + dataGsp5lpg) / oneThousand;
      this.dataC3LPG[4]['M' + index.format('MYYYY')] = (dataGsp6C3 + dataGsp6lpg) / oneThousand;
      this.dataC3LPG[5]['M' + index.format('MYYYY')] = (dataGsp1C3 + dataGsp2C3 + dataGsp3C3 + dataGsp5C3 + dataGsp6C3 + dataGsp1lpg + dataGsp2lpg + dataGsp3lpg + dataGsp5lpg + dataGsp6lpg) / oneThousand;

      // GC
      let datalowcO2GC = _.sumBy(this.dataList[this.sheetNameObj[i]]['gc'], (item) => { return _.toNumber(item.lowcO2) });
      let datahighcO2GC = _.sumBy(this.dataList[this.sheetNameObj[i]]['gc'], (item) => { return _.toNumber(item.highcO2) });

      this.dataGC[0]['M' + index.format('MYYYY')] = datalowcO2GC / oneThousand;
      this.dataGC[1]['M' + index.format('MYYYY')] = datahighcO2GC / oneThousand;
      this.dataGC[1]['M' + index.format('MYYYY')] = (datahighcO2GC + datahighcO2GC) / oneThousand;

      i++;
    }

    if (this.dataFormExcel.ability) {

      let excelData = this.dataFormExcel.ability;
      // C2
      let C2_GSP1 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'GSP I' });
      let C2_GSP2 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'GSP II' });
      let C2_GSP3 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'GSP III' });
      let C2_GSP5 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'GSP V' });
      let C2_GSP6 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'GSP VI' });
      let C2_ESP = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'ESP' });
      let C2_LOWCO2 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'Ethane Low CO2' });
      let C2_HIGHCO2 = _.find(_.cloneDeep(excelData), { productHeadder: 'C2', product: 'Ethane High CO2' });
      // C3
      let C3_GSP1 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3', product: 'Propane     GSP I' });
      let C3_GSP2 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3', product: 'GSP II' });
      let C3_GSP3 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3', product: 'GSP III' });
      let C3_GSP5 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3', product: 'GSP V' });
      let C3_GSP6 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3', product: 'GSP VI' });
      // C3LPG
      let C3LPG_GSP1 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3/LPG', product: 'C3/LPG     GSP I' });
      let C3LPG_GSP2 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3/LPG', product: 'GSP II' });
      let C3LPG_GSP3 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3/LPG', product: 'GSP III' });
      let C3LPG_GSP5 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3/LPG', product: 'GSP V' });
      let C3LPG_GSP6 = _.find(_.cloneDeep(excelData), { productHeadder: 'C3/LPG', product: 'GSP VI' });
      // LPG
      let LPG_GSP1 = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'LPG          GSP I' });
      let LPG_GSP2 = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'GSP II' });
      let LPG_GSP3 = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'GSP III' });
      let LPG_GSP5 = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'GSP V' });
      let LPG_GSP6 = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'Butane          GSP VI' });
      let LPG_PETRO = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'LPG-Petrochemical' });
      let LPG_DOMESTIC = _.find(_.cloneDeep(excelData), { productHeadder: 'LPG', product: 'LPG-Domestic' });
      // NGL
      let NGL_GSP1 = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'GSP I' });
      let NGL_GSP2 = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'GSP II' });
      let NGL_GSP3 = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'GSP III' });
      let NGL_GSP5 = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'GSP V' });
      let NGL_GSP6 = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'GSP VI' });
      let NGL_Stab = _.find(_.cloneDeep(excelData), { productHeadder: 'NGL', product: 'NGL FROM STABILIZER' });

      for (let x = 1; x < 13; x++) {

        this.dataC2[0]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_GSP1['m' + x]);
        this.dataC2[1]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_GSP2['m' + x]);
        this.dataC2[2]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_GSP3['m' + x]);
        this.dataC2[3]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_GSP5['m' + x]);
        this.dataC2[4]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_GSP6['m' + x]);
        this.dataC2[5]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_ESP['m' + x]);
        this.dataC2[7]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_LOWCO2['m' + x]);
        this.dataC2[8]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C2_HIGHCO2['m' + x]);

        this.dataC3[0]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3_GSP1['m' + x]);
        this.dataC3[1]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3_GSP2['m' + x]);
        this.dataC3[2]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3_GSP3['m' + x]);
        this.dataC3[3]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3_GSP5['m' + x]);
        this.dataC3[4]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3_GSP6['m' + x]);

        this.dataC3LPG[0]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3LPG_GSP1['m' + x]);
        this.dataC3LPG[1]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3LPG_GSP2['m' + x]);
        this.dataC3LPG[2]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3LPG_GSP3['m' + x]);
        this.dataC3LPG[3]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3LPG_GSP5['m' + x]);
        this.dataC3LPG[4]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(C3LPG_GSP6['m' + x]);

        this.dataLPG[0]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_GSP1['m' + x]);
        this.dataLPG[1]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_GSP2['m' + x]);
        this.dataLPG[2]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_GSP3['m' + x]);
        this.dataLPG[3]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_GSP5['m' + x]);
        this.dataLPG[4]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_GSP6['m' + x]);
        this.dataLPG[6]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_PETRO['m' + x]);
        this.dataLPG[7]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(LPG_DOMESTIC['m' + x]);

        this.dataNGL[0]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_GSP1['m' + x]);
        this.dataNGL[1]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_GSP2['m' + x]);
        this.dataNGL[2]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_GSP3['m' + x]);
        this.dataNGL[3]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_GSP5['m' + x]);
        this.dataNGL[4]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_GSP6['m' + x]);
        this.dataNGL[5]['ABL_M' + moment(excelData[0]['m' + x]).format('MYYYY')] = _.toNumber(NGL_Stab['m' + x]);

      }

    }

    this.dataSum = _.concat(this.dataSum, this.dataC2);
    this.dataSum = _.concat(this.dataSum, this.dataC3);
    this.dataSum = _.concat(this.dataSum, this.dataLPG);
    this.dataSum = _.concat(this.dataSum, this.dataC3LPG);
    this.dataSum = _.concat(this.dataSum, this.dataNGL);

    return this.dataSum;
  }

}
