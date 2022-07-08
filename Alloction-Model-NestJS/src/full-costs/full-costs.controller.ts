import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { AbilityPentaneService } from '../ability-plan/ability-pentane/ability-pentane.service';
import { CostsService } from '../cost/costs.service';
import { FullCostManualsService } from '../full-cost-manuals/full-cost-manuals.service';
import { MasterSourceDemandDeliveryService } from '../Master/master-source-demand-delivery/master-source-demand-delivery.service';
import { ReferencePricesService } from '../reference-prices/reference-prices.service';
import { FullCostsService } from './full-costs.service';
import { FullCost } from './models/full-cost';

@Controller('full-costs')
export class FullCostsController {
  constructor(private service: FullCostsService,
    private serviceCosts: CostsService,
    private serviceReferencePrices: ReferencePricesService,
    private serviceMasterSourceDemandDelivery: MasterSourceDemandDeliveryService,
    private serviceFullCostManuals: FullCostManualsService,
    private serviceAbilityPentaneService: AbilityPentaneService
  ) { }

  const_70_8_percent: any = 70.8 / 100;
  const_2100: any = 2100;
  const_3_6: any = 3.6;
  const_462_267: any = 462.267;
  const_250: any = 250;
  const_730: any = 750;
  compute_GC: any = 485 + 495 + 720 + 490;
  const_485: any = 485;
  const_430: any = 430;

  cost_gsp_full_cost_ton: any = 'GSP Full Cost ($/Ton)';

  dataCosts: any = [];
  dataPrices: any = [];
  dataCostManuals: any = [];
  dataPriceManuals: any = [];
  dataPriceOlds: any = [];
  dataMaster: any = [];
  dataManual: any = [];

  dataMasterPentane: any = [];
  year: any;

  @Get('/:year/:version')
  get(@Param() params) {
    // // ('full-costs : data get list', params)
    if (params.isCastCost) {
      this.cost_gsp_full_cost_ton = 'GSP Cash Cost ($/Ton)'
    }
    this.year = params.year;
    return this.getFullCost(params.year, params.version);
  }

  @Post()
  create(@Body() data: any) {
    // const datas: any = [{ "product": "Crude Dubai", "unit": "$/BBL", "M1": "54.772", "M2": "60.855", "M3": "64.41434783", "M4": "62.89428571", "M5": "65.3", "M6": "65.3", "M7": "65.5", "M8": "65.3", "M9": "64.9", "M10": "64.7", "M11": "65.1", "M12": "65.6" }, { "product": "Naphtha :MOPJ", "unit": "$/Ton", "M1": "513.28125", "M2": "564.6315789", "M3": "593.3967391", "M4": "571.1071429", "M5": "594.9", "M6": "593.1", "M7": "593.1", "M8": "592.2", "M9": "589.5", "M10": "587.7", "M11": "592.2", "M12": "597.6" }, { "product": "Naphtha :MOPS", "unit": "$/Ton", "M1": "539.0694479", "M2": "597.4398495", "M3": "628.0988566", "M4": "602.7530024", "M5": "581.4", "M6": "579.6", "M7": "579.6", "M8": "578.7", "M9": "576", "M10": "574.2", "M11": "578.7", "M12": "584.1" }, { "product": "Naphtha :MOPS", "unit": "$/BBL", "M1": "55.584", "M2": "61.60263158", "M3": "64.76391304", "M4": "62.15047619", "M5": "64.6", "M6": "64.4", "M7": "64.4", "M8": "64.3", "M9": "64", "M10": "63.8", "M11": "64.3", "M12": "64.9" }, { "product": "CP Platts", "unit": "$/Ton", "M1": "570.65", "M2": "569.9342105", "M3": "544.173913", "M4": "473.2619048", "M5": "485", "M6": "487.5", "M7": "487.5", "M8": "495", "M9": "510", "M10": "520", "M11": "525", "M12": "530" }, { "product": "LPG CP ", "unit": "$/Ton", "M1": "540", "M2": "595", "M3": "610", "M4": "545", "M5": "485", "M6": "487.5", "M7": "487.5", "M8": "495", "M9": "510", "M10": "520", "M11": "525", "M12": "530" }, { "product": "C3 CP ", "unit": "$/Ton", "M1": "550", "M2": "605", "M3": "625", "M4": "560", "M5": "495", "M6": "495", "M7": "495", "M8": "500", "M9": "510", "M10": "520", "M11": "525", "M12": "530" }, { "product": "C4 CP", "unit": "$/Ton", "M1": "530", "M2": "585", "M3": "595", "M4": "530", "M5": "475", "M6": "480", "M7": "480", "M8": "490", "M9": "510", "M10": "520", "M11": "525", "M12": "530" }, { "product": "HDPE : CFR SEA", "unit": "$/Ton", "M1": "1061.25", "M2": "1088.75", "M3": "1285.625", "M4": "1283", "M5": "1155", "M6": "1130", "M7": "1108", "M8": "1093", "M9": "1078", "M10": "1073", "M11": "1097", "M12": "1080" }, { "product": "LDPE : CFR SEA", "unit": "$/Ton", "M1": "1443.75", "M2": "1475", "M3": "1680", "M4": "1690", "M5": "1545", "M6": "1523", "M7": "1507", "M8": "1487", "M9": "1464", "M10": "1443", "M11": "1472", "M12": "1461" }, { "product": "LLDPE : CFR SEA", "unit": "$/Ton", "M1": "1060", "M2": "1096.25", "M3": "1281.25", "M4": "1274", "M5": "1150", "M6": "1127", "M7": "1116", "M8": "1106", "M9": "1095", "M10": "1085", "M11": "1123", "M12": "1111" }, { "product": "PP : CFR SEA", "unit": "$/Ton", "M1": "1235", "M2": "1339.6875", "M3": "1520", "M4": "1427.5", "M5": "1310", "M6": "1280", "M7": "1268", "M8": "1235", "M9": "1205", "M10": "1232", "M11": "1236", "M12": "1198" }, { "product": "Propylene", "unit": "$/Ton", "M1": "913.125", "M2": "938.75", "M3": "1107.5", "M4": "1041.5", "M5": "1014.97", "M6": "1009.8", "M7": "973.17", "M8": "949", "M9": "930.2", "M10": "919.8", "M11": "903.37", "M12": "880.22" }, { "product": "Baltic Rate*", "unit": "$/Ton", "M1": "92.3214", "M2": "38.73133333", "M3": "35.27326087", "M4": "51.3714", "M5": "54.45880702", "M6": "58.3487218", "M7": "66.12855138", "M8": "70.01846617", "M9": "73.90838095", "M10": "81.68821053", "M11": "89.4680401", "M12": "101.1377845" }, { "product": "Freight (X)", "unit": "$/Ton", "M1": "96.52072", "M2": "59.15249286", "M3": "29.75892667", "M4": "39.27025333", "M5": "43.56704561", "M6": "46.67897744", "M7": "52.9028411", "M8": "56.01477293", "M9": "59.12670476", "M10": "65.35056842", "M11": "71.57443208", "M12": "80.91022757" }, { "product": "GSP Cost กบน.", "unit": "$/Ton", "M1": "431.3640521", "M2": "432.9056119", "M3": "429.2633084", "M4": "417.377316", "M5": "425.9942464", "M6": "428.0255183", "M7": "427.2078956", "M8": "427.9953125", "M9": "427.9953125", "M10": "431.0141958", "M11": "434.1310635", "M12": "434.1310635" }, { "product": "FX", "unit": "B/$", "M1": "30.19494516", "M2": "30.17265714", "M3": "30.46522258", "M4": "31.32924", "M5": "31.49948647", "M6": "31.35", "M7": "31.41", "M8": "31.41", "M9": "31.41", "M10": "31.19", "M11": "31.19", "M12": "31.19" }];
    // _.each(datas, (item, index) => {
    //   item.version = 1;
    //   item.productVersion = item.product
    //   item.rowOrder = index + 1
    // })
    // // ('data Create', data)
    return this.service.create(data);
  }

  @Get(':year')
  getVersion(@Param() params) {
    // // ('data get list', params)
    return this.service.getVersion(params);
  }
  @Put()
  createVersion(@Body() data: any) {
    // data = []
    // data.year = 2021
    // data.action = 'Insert'
    // data.remark = ''
    // data.version = 1
    // data.filePath = ''
    // data.rowOrder = 1
    // // ('data Create', data)
    return this.service.createVersion(data);
  }

  async getFullCost(year: any, version: any): Promise<FullCost[]> {

    let observable: any[] = [];
    this.dataMaster = [];
    const params: any = { year: year, month: 10, version: version };

    let resMax: any = await this.serviceMasterSourceDemandDelivery.getList({});
    this.dataMaster = resMax;
    params.version = 0
    // resMax = await this.serviceCosts.getList(params)
    resMax = await this.serviceCosts.getCostToCalMargin({ year: year, month: 10, version: -1 });
    this.dataCosts = resMax
    resMax = await this.serviceCosts.getManual({ year: year - 1, month: 10, version: -1 });
    this.dataCostManuals = resMax;
    params.version = 0
    let month = 10;
    if (_.toInteger(year) === 2020) {
      month = 13;
    } else if (_.toInteger(year) === 2022) {
      month = 0;
    }
    // resMax = await this.serviceReferencePrices.getList(params)
    resMax = await this.serviceReferencePrices.getReferencePriceToCalMargin({ year: year, month: month, version: -1 });
    this.dataPrices = resMax;
    // // ('full-cost dataPrices', this.dataPrices);
    resMax = await this.serviceReferencePrices.getManual({ year: year - 1, month: month, version: -1 })
    this.dataPriceManuals = resMax;
    
    resMax = await this.serviceReferencePrices.getList({ year: year - 1, month: month, version: 0 });
    this.dataPriceOlds = resMax;
    // // ('full-cost dataPriceOlds', this.dataPriceOlds);

    this.dataManual = await this.serviceFullCostManuals.getList(params);
    // // ("serviceFullCostManuals :: ", this.dataManual);
    this.dataMasterPentane = await this.serviceAbilityPentaneService.getList({ year: year, month: 10 });

    this.setC2_N_N_N();
    this.setC3_GSPRY_N_GSPRY();
    this.setC3_Import_N_GSPRY();
    this.setLPG_GSPRY_N_GSPRY();
    this.setLPG_Import_SWAP_GSPRY();
    this.setLPG_GSPRY_ODORLESS_GSPRY();
    this.setLPG_Export_N_MT();
    this.setLPG_Import_N_GSPRYorMT();
    this.setLPG_GSPRY_N_MTorBRP('MT');
    this.setLPG_GSPRY_N_MTorBRP('BRP');
    this.setLPG_GSPRY_N_PTTTANK();
    this.setLPG_GSPRY_N_PTTTANK_TRUCK();
    this.setLPG_IRPC_N_IRPC();
    this.setLPG_GC_N_MT();
    this.setLPG_GC_N_PTTTANK();
    this.setLPT_GC_N_PTTTANK_TRUCK();
    this.setLPG_SPRC_N_MT();
    this.setLPG_SPRC_N_SPRC();
    this.setLPG_PTTEPLKB_PTTEPLKB_TRUCK();
    this.setLPG_GSPKHM_GSPKHM();
    this.setNGL_N_N_N();
    this.setPentane_N_N_N();
    let fullCost: FullCost[] = []
    _.each(this.dataMaster, (item) => {
      const dataPush: any = {
        id: item.id,
        year: year,
        productValue: item.product,
        product: item.product,
        unit: item.unit,
        source: item.source,
        demand: item.demand,
        deliveryPoint: item.deliveryPoint,
        M1: item.M1,
        M2: item.M2,
        M3: item.M3,
        M4: item.M4,
        M5: item.M5,
        M6: item.M6,
        M7: item.M7,
        M8: item.M8,
        M9: item.M9,
        M10: item.M10,
        M11: item.M11,
        M12: item.M12,
        calculateM1: item.M1,
        calculateM2: item.M2,
        calculateM3: item.M3,
        calculateM4: item.M4,
        calculateM5: item.M5,
        calculateM6: item.M6,
        calculateM7: item.M7,
        calculateM8: item.M8,
        calculateM9: item.M9,
        calculateM10: item.M10,
        calculateM11: item.M11,
        calculateM12: item.M12,
        formulaM1: item.formulaM1,
        formulaM2: item.formulaM2,
        formulaM3: item.formulaM3,
        formulaM4: item.formulaM4,
        formulaM5: item.formulaM5,
        formulaM6: item.formulaM6,
        formulaM7: item.formulaM7,
        formulaM8: item.formulaM8,
        formulaM9: item.formulaM9,
        formulaM10: item.formulaM10,
        formulaM11: item.formulaM11,
        formulaM12: item.formulaM12,
        version: item.version,
        filePath: item.filePath,
        rowOrder: item.rowOrder,
        createBy: item.createBy,
        createDate: item.createDate,
        updateBy: item.updateBy,
        updateDate: item.updateDate,
        costVersion: this.dataCosts && this.dataCosts.length > 0 ? this.dataCosts[0].version : 0,
        priceVersion: this.dataPrices && this.dataPrices.length > 0 ? this.dataPrices[0].version : 0,
        priceOldVersion: this.dataPriceOlds && this.dataPriceOlds.length > 0 ? this.dataPriceOlds[0].version : 0
      };
      if (this.dataManual && this.dataManual.length > 0) {
        const dataM = _.filter(this.dataManual, (itemManual) => {
          return itemManual.product === item.product &&
            itemManual.source === item.source &&
            itemManual.demand === item.demand &&
            itemManual.deliveryPoint === item.deliveryPoint
        })

        if (dataM) {
          _.each(dataM, (itemManual) => {
            if (itemManual.updateDate > dataPush.updateDate || _.toLower(dataPush.source) === 'import') {
              dataPush['calculateM' + itemManual.valueMonth] = itemManual.value
              dataPush['M' + itemManual.valueMonth] = itemManual.value
              dataPush['isManualM' + itemManual.valueMonth] = true;
            }

          })
        }
      }
      fullCost.push(dataPush);
    })
    return await fullCost;
    //   }, error => {

    //     // // ('data error 2')
    //   });
    // }, error => {

    //   // // ('data error 1', error)
    // });
  }

  getMaster1(product: any) {
    return _.filter(this.dataMaster, (item) => { return item.product === product });
  }
  getMaster3(product: any, source: any, deliveryPoint: any) {
    return _.filter(this.dataMaster, (item) => { return item.product === product && item.source === source && item.deliveryPoint === deliveryPoint });
  }
  getMaster4(product: any, source: any, demand: any, deliveryPoint: any) {
    return _.filter(this.dataMaster, (item) => { return item.product === product && item.source === source && item.demand === demand && item.deliveryPoint === deliveryPoint });
  }
  getCost(costName: any, costItem: any) {
    return _.find(this.dataCosts, (item) => { return item.cost === costName && item.product === costItem });
  }
  getRefPrice(RefName: any, CurrentMonth: any) {
    return _.find(this.dataPrices, (item) => { return item.referencePriceNameTo === RefName });
  }
  getRefPriceOld(RefName: any, CurrentMonth: any) {
    return _.find(this.dataPriceOlds, (item) => { return item.referencePriceNameTo === RefName });
  }
  getRefPrice_CPPlattsPlusFreight(RefPriceName1: any, RefPriceName2: any) {
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = RefPriceName1['M' + index] + RefPriceName2['M' + index];
    }
    return data;
  }

  setData3(product: any, source: any, deliveryPoint: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster3(product, source, deliveryPoint);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula
        }
        item.updateBy = data.updateBy
        item.updateDate = data.updateDate
      });
    }

  }

  setData1(product: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster1(product);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula
        }
        item.updateBy = data.updateBy
        item.updateDate = data.updateDate
      });
    }
  }

  setData4(product: any, source: any, demand: any, deliveryPoint: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster4(product, source, demand, deliveryPoint);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula

        }

        item.updateBy = data.updateBy
        item.updateDate = data.updateDate
      });
    }
  }

  setDataPentane(product: any, source: any, demand: any, deliveryPoint: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster4(product, source, demand, deliveryPoint);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          if (this.dataMasterPentane.length) {
            const tmpFindData = _.find(_.cloneDeep(this.dataMasterPentane), { tierName: demand, monthValue: index, yearValue: _.toNumber(this.year) });
            if (tmpFindData) {
              item["M" + index] = data["M" + index];
            }
            else {
              item["M" + index] = 0;
            }
          }
          else if (demand == 'Pentane Tier2 - ROC') {
            item["M" + index] = data["M" + index];
          }
          else {
            item["M" + index] = 0;
          }
          item["formulaM" + index] = data.formula;
        }
      });
    }
  }

  setC2_N_N_N() {
    const datCost = this.getCost('ต้นทุน Ethane', this.cost_gsp_full_cost_ton);
    if (datCost) {
      datCost.formula = 'ต้นทุน Ethane(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('C2', 'GSP RY', 'GSP RY', datCost);
  }

  setC3_GSPRY_N_GSPRY() {
    const datCost = this.getCost('ต้นทุน Propane', this.cost_gsp_full_cost_ton);
    if (datCost) {
      datCost.formula = 'ต้นทุน Propane(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('C3', 'GSP RY', 'GSP RY', datCost);
  }

  setC3_Import_N_GSPRY() {
    const dataRefPrice = this.getRefPrice('CP Platts', 0);
    const dataRefPriceold = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    data.M1 = dataRefPrice.M1 + (this.const_70_8_percent * (dataRefPriceold ? dataRefPriceold.M12 : 0))
    for (let index = 2; index < 13; index++) {
      data['M' + index] = dataRefPrice['M' + index] + (this.const_70_8_percent * dataRefPrice['M' + (index - 1)])
    }
    data.formula = 'CP Platts + (' + this.const_70_8_percent + ' * Baltic Rate(เดือนปัจจุบัน - 1))'
    this.setData3('C3', 'Import', 'GSP RY', data);
  }

  setLPG_GSPRY_N_GSPRY() {
    const datCost = this.getCost('ต้นทุน LPG - Feedstock', this.cost_gsp_full_cost_ton);
    if (datCost) {
      datCost.formula = 'ต้นทุน LPG - Feedstock(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('LPG', 'GSP RY', 'GSP RY', datCost);
  }

  setLPG_Import_SWAP_GSPRY() {
    const dataRefPrice = this.getRefPrice('LPG CP', 0);
    const dataRefPriceold = this.getRefPriceOld('Freight (X)', -1);
    const data: any = {};
    data.M1 = dataRefPrice.M1 + (this.const_70_8_percent * (dataRefPriceold ? dataRefPriceold.M12 : 0)) + this.const_3_6;
    for (let index = 2; index < 13; index++) {
      data['M' + index] = dataRefPrice['M' + index] + (this.const_70_8_percent * dataRefPrice['M' + (index - 1)]) + this.const_3_6;
    }
    data.formula = 'LPG CP + (' + this.const_70_8_percent + ' * Freight (X)(เดือนปัจจุบัน - 1))'
    this.setData4('LPG', 'Import', 'SWAP LPG : Max 400 KT', 'GSP RY', data);
  }

  setLPG_GSPRY_ODORLESS_GSPRY() {
    const datCost = this.getCost('ต้นทุน LPG - Feedstock', this.cost_gsp_full_cost_ton);
    const dataRefPrice = this.getRefPrice('FX', 0);
    if (datCost && dataRefPrice) {
      datCost.M1 = datCost.M1 + (this.const_2100 / dataRefPrice.M1);
      for (let index = 2; index < 13; index++) {
        datCost['M' + index] = dataRefPrice['M' + index] + (this.const_2100 / dataRefPrice['M' + (index - 1)]);
      }
      datCost.formula = 'ต้นทุน LPG - Feedstock(' + this.cost_gsp_full_cost_ton + ') + ' + this.const_2100 + ' / FX'
      this.setData4('LPG', 'GSP RY', 'PTTOR (LPG ไม่มีกลิ่น)', 'GSP RY', datCost);
    }
  }

  setLPG_Export_N_MT() {
    const datCost = this.getCost('ต้นทุน LPG - Domestic (MT & BRP)', this.cost_gsp_full_cost_ton);
    if (datCost) {
      datCost.formula = 'ต้นทุน LPG - Domestic (MT & BRP)(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('LPG', 'Export', 'MT', datCost);
  }

  setLPG_Import_N_GSPRYorMT() {
    const dataRefPrice = this.getRefPrice('CP Platts', 0);
    const dataRefPriceold = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    data.M1 = dataRefPrice.M1 + (this.const_70_8_percent * (dataRefPriceold ? dataRefPriceold.M12 : 0));
    for (let index = 2; index < 13; index++) {
      data['M' + index] = dataRefPrice['M' + index] + (this.const_70_8_percent * dataRefPrice['M' + (index - 1)]);
    }
    data.formula = 'CP Platts + (' + this.const_70_8_percent + ' * Baltic Rate(เดือนปัจจุบัน - 1))'
    this.setData3('LPG', 'Import', 'MT', data);
    this.setData3('LPG', 'Import', 'GSP RY', data);
  }

  setLPG_GSPRY_N_MTorBRP(destination: any) {
    // destination = MT || BRP
    const datCost = this.getCost('ต้นทุน LPG - Domestic (MT & BRP)', this.cost_gsp_full_cost_ton);
    if (datCost) {
      datCost.formula = 'ต้นทุน LPG - Domestic (MT & BRP)(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('LPG', 'GSP RY', destination, datCost);
  }

  setLPG_GSPRY_N_PTTTANK() {
    const datCost = this.getCost('ต้นทุน LPG - Domistic ผ่าน PTT Tank (ยังไม่รวมค่า Tariff ของ PTT Tank)', this.cost_gsp_full_cost_ton);
    const dataRefPrice = this.getRefPrice('FX', 0);
    if (datCost && dataRefPrice) {
      datCost.M1 = datCost.M1 + (this.const_462_267 / dataRefPrice.M1);
      for (let index = 2; index < 13; index++) {
        datCost['M' + index] = datCost['M' + index] + (this.const_462_267 / dataRefPrice['M' + (index)]);
      }
      datCost.formula = 'ต้นทุน LPG - Domistic ผ่าน PTT Tank (ยังไม่รวมค่า Tariff ของ PTT Tank)(' + this.cost_gsp_full_cost_ton + ') + (' + this.const_462_267 + ' / FX)'
      this.setData3('LPG', 'GSP RY', 'PTT TANK', datCost);
    }
  }

  setLPG_GSPRY_N_PTTTANK_TRUCK() {
    const datCost = this.getCost('ต้นทุน LPG - Domistic ผ่าน PTT Tank (ยังไม่รวมค่า Tariff ของ PTT Tank)', this.cost_gsp_full_cost_ton);
    const dataRefPrice = this.getRefPrice('FX', 0);
    if (datCost && dataRefPrice) {
      datCost.M1 = datCost.M1 + (this.const_250 / dataRefPrice.M1);
      for (let index = 2; index < 13; index++) {
        datCost['M' + index] = datCost['M' + index] + (this.const_462_267 / dataRefPrice['M' + (index)]);
      }
      datCost.formula = 'ต้นทุน LPG - Domistic ผ่าน PTT Tank (ยังไม่รวมค่า Tariff ของ PTT Tank)(' + this.cost_gsp_full_cost_ton + ') + (' + this.const_250 + ' / FX)'
      this.setData3('LPG', 'GSP RY', 'PTT TANK (Truck)', datCost);
    }
  }

  setLPG_IRPC_N_IRPC() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = data['M' + index] - (this.const_730 / dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) - (' + this.const_730 + ' / FX)'
    this.setData3('LPG', 'IRPC', 'IRPC', data);
  }

  setLPG_GC_N_MT() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = data['M' + index] - (this.compute_GC / dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) - (' + this.compute_GC + ' / FX)'
    this.setData3('LPG', 'GC', 'MT', data);
  }

  setLPG_GC_N_PTTTANK() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (data['M' + index] - (this.compute_GC / dataRefPrice['M' + index])) + (this.const_462_267 + dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) - (' + this.compute_GC + ' / FX) + ' + this.const_462_267 + ' + FX'
    this.setData3('LPG', 'GC', 'PTT TANK', data);
  }

  setLPT_GC_N_PTTTANK_TRUCK() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (data['M' + index] - (this.compute_GC / dataRefPrice['M' + index])) + (this.const_250 + dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) - (' + this.compute_GC + ' / FX) + ' + this.const_250 + ' + FX'
    this.setData3('LPG', 'GC', 'PTT TANK (Truck)', data);
  }

  setLPG_SPRC_N_MT() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = data['M' + index] - dataRefPrice['M' + index] - (this.const_485 / dataRefPrice['M' + index])
        + (this.const_430 / dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) + FX - (' + this.const_485 + ' / FX) + (' + this.const_430 + ' / FX)'
    this.setData3('LPG', 'SPRC', 'MT', data);
  }

  setLPG_SPRC_N_SPRC() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    const dataRefPrice = this.getRefPrice('FX', 0);
    for (let index = 1; index < 13; index++) {
      data['M' + index] = data['M' + index] - dataRefPrice['M' + index] - (this.const_485 / dataRefPrice['M' + index]);
    }
    data.formula = 'CP Platts + Freight (X) - FX - (' + this.const_485 + ' / FX)'
    this.setData3('LPG', 'SPRC', 'SPRC', data);
  }

  setLPG_PTTEPLKB_PTTEPLKB_TRUCK() {
    const dataRefPriceCP = this.getRefPrice('CP Platts', 0);
    const dataRefPriceFreight = this.getRefPrice('Freight (X)', -1);
    const data = this.getRefPrice_CPPlattsPlusFreight(dataRefPriceCP, dataRefPriceFreight);
    data.formula = 'CP Platts + Freight (X)'
    this.setData3('LPG', 'PTTEP (LKB)', 'PTTEP/LKB (Truck)', data);
  }

  setLPG_GSPKHM_GSPKHM() {
    const datCost = this.getCost('ต้นทุน LPG - Domestic (MT & BRP)', this.cost_gsp_full_cost_ton);
    if(datCost) {
      datCost.formula = 'ต้นทุน LPG - Domestic (MT & BRP)(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData3('LPG', 'GSP KHM', 'GSP KHM', datCost);
  }

  setNGL_N_N_N() {
    const datCost = this.getCost('ต้นทุน NGL', this.cost_gsp_full_cost_ton);
    if(datCost) {
      datCost.formula = 'ต้นทุน NGL(' + this.cost_gsp_full_cost_ton + ')'
    }
    this.setData1('NGL', datCost);
  }

  setPentane_N_N_N() {
    const datCost = this.getCost('ต้นทุน NGL', this.cost_gsp_full_cost_ton);
    if(datCost) {
      datCost.formula = 'ต้นทุน NGL(' + this.cost_gsp_full_cost_ton + ')';
    }
    // this.setData1('Pentane', datCost);
    this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier1 - ROC', 'GSP RY', datCost);
    this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier2 - ROC', 'GSP RY', datCost);
    this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier3 - ROC', 'GSP RY', datCost);
  }


}
