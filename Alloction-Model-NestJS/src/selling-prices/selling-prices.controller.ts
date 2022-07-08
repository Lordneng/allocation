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
import { SellingPricesService } from './selling-prices.service';
import { forkJoin } from 'rxjs';
import { CostsService } from '../cost/costs.service';
import { MasterSourceDemandDeliveryService } from '../Master/master-source-demand-delivery/master-source-demand-delivery.service';
import { ReferencePricesService } from '../reference-prices/reference-prices.service';
import { Index } from 'typeorm';
import { SellingPrice } from './models/selling-price';
import { AbilityPentaneService } from '../ability-plan/ability-pentane/ability-pentane.service';


@Controller('selling-prices')
export class SellingPricesController {
  constructor(
    private service: SellingPricesService,
    private serviceCosts: CostsService,
    private serviceReferencePrices: ReferencePricesService,
    private serviceMasterSourceDemandDelivery: MasterSourceDemandDeliveryService,
    private serviceAbilityPentaneService: AbilityPentaneService
  ) { }

  CONST_1_014: any = 1.014;
  CONST_0_8: any = 0.8;
  CONST_TEAR1_0_71: any = 0.71;
  CONST_TEAR2_0_73: any = 0.73;
  COMPUTE_17MINUS10: any = (17 - 10);
  CONST_510: any = 510;
  CONST_550: any = 550;

  dataCosts: any = [];
  dataPrices: any = [];
  dataCostManuals: any = [];
  dataPriceManuals: any = [];
  dataPriceOlds: any = [];
  dataMaster: any = [];
  dataManual: any = [];

  dataMasterPentane: any = [];
  year: any;

  @Get('/:year')
  get(@Param() params) {
    // return this.service.getList(params);
    this.year = params.year;
    return this.getSellingPrice(params.year);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get(':year')
  getVersion(@Param() params) {
    return this.service.getVersion(params);
  }
  @Put()
  createVersion(@Body() data: any) {
    return this.service.createVersion(data);
  }

  async getSellingPrice(year: any): Promise<SellingPrice[]> {
    let observable: any[] = [];
    // const params: any = { year: year };
    const params: any = { year: year, month: 10 };
    let resMax: any = await this.serviceMasterSourceDemandDelivery.getList({});
    this.dataMaster = resMax;
    params.version = 0
    // resMax = await this.serviceCosts.getList(params)
    resMax = await this.serviceCosts.getCostToCalMargin({ year: year, month: 10, version: -1 });
    this.dataCosts = resMax
    resMax = await this.serviceCosts.getManual({ year: year - 1, month: 10, version: -1 });
    this.dataCostManuals = resMax;
    params.version = 0
    // resMax = await this.serviceReferencePrices.getList(params)
    let month = 10;
    if (_.toInteger(year) === 2020) {
      month = 13;
    } else if (_.toInteger(year) === 2022) {
      month = 0;
    }
    resMax = await this.serviceReferencePrices.getReferencePriceToCalMargin({ year: year, month: month, version: -1 });
    this.dataPrices = resMax;
    if (this.dataPrices.length === 0) {
      // ('selling-prices para', { year: year, month: month, version: -1 });
      // ('selling-prices dataPrices', this.dataPrices);
    }

    resMax = await this.serviceReferencePrices.getManual({ year: year, month: month, version: -1 })
    this.dataPriceManuals = resMax;
    

    resMax = await this.serviceReferencePrices.getReferencePriceToCalMargin({ year: year - 1, month: month, version: 0 });
    this.dataPriceOlds = resMax;
    // // ('selling-prices dataPriceOlds', this.dataPriceOlds);
    // this.dataManual = await this.serviceS.getList(params); 
    // // ("serviceFullCostManuals :: ", this.dataManual);
    this.dataMasterPentane = await this.serviceAbilityPentaneService.getList({ year: year, month: 10 });


    this.setC2_GSPRY_GCOLE1_GSPRY();
    this.setC2_GSPRY_GCOLE2_GSPRY();
    this.setC2_GSPRY_PTTPEOLE3_GSPRY();
    this.setC2_GSPRY_PTTPEOLE3274TPerHr_GSPRY();
    this.setC2_GSPRY_PTTPEOLE3SPOTGSP5_GSPRY();
    this.setC2_GSPRY_PTTPEOLE3Hybrid_GSPRY();
    this.setC2_GSPRY_SCG_GSPRY();
    this.setC3_N_GC_N();
    this.setC3_N_HMC_N();
    this.setC3_N_PTTAC_N();
    this.setC3_N_PTTACSpot_N();
    this.setC3_GSPRY_Tier1_GSPRY();
    this.setC3_Import_Tier1_GSPRY();
    this.setC3_GSPRY_Tier2_GSPRY();
    this.setC3_Import_Tier2_GSPRY();
    this.setC3_GSPRY_Truck_GSPRY();
    this.setLPG_GSPRYImport_GC_GSPRY();
    this.setLPG_GSPRY_SCG240KT_GSPRY();
    this.setLPG_GSPRY_SCGTear1_GSPRY();
    this.setLPG_GSPRY_SCGTear2_GSPRY();
    this.setLPG_Import_SCGSwap_GSPRY();
    this.setLPG_GSPRY_ODORLESS_GSPRY();
    this.setLPG_Export_TBU_MT();
    this.setLPG_Import_PTTOR_MT();
    this.setLPG_Import_SGPUGP_MT();
    this.setLPG_GSPRYGSPKHM_PTTOR_MTBRPGSPKHM();
    this.setLPG_GSPRY_PTTOR_PTTTANK();
    this.setLPG_GSPRY_PTTOR_PTTTANK_TRUCK();
    this.setLPG_GSPRY_SGPUGP_MT();
    this.setLPG_GSPRY_BCPESSO_MTBRP();
    this.setLPG_FXValue_PTTTANK();
    this.setLPG_GSPRY_BiggasPapIRPCAtlas_MT();
    this.setLPG_GSPRY_BiggasPapIRPCAtlas_PTTTANK();
    this.setLPG_GSPRY_PAP_PTTTANK_TRUCK();
    this.setLPG_GSPRY_WP_MT();
    this.setLPG_GSPRY_WP_PTTTANK();
    this.setLPG_IRPCGC_PTTOR_IRPCPTTTANK();
    this.setLPG_IRPCGCSPRC_WP_IRPCPTTANKSPRC();
    this.setLPG_IRPCSPRC_Atlas_IRPCSPRC();
    this.setLPG_GC_PTTOR_MT();
    this.setLPG_GC_PTTOR_PTT_TANK_TRUCK();
    this.setLPG_GC_BCPESSO_MT();
    this.setLPG_GC_BSPESSOOrchid_PTTTANK();
    this.setLPG_GC_PAPIRPCAltas();
    this.setLPG_GCSPRC_PAPIRPCAltas_PTTTANKSPRC();
    this.setLPG_GC_PAP_TANK_TRUCK();
    this.setLPG_GC_WP_MT();
    this.setLPG_SPRC_SGC_MT();
    this.setLPG_SPRC_PTTOR_SPRC();
    this.setLPG_PTTEP_PTTOR_PTTEP();
    this.setNGL_GSPRY_GCSCG_GSPRY();
    this.setNGL_GSPRYGSPKHM_Export_MTPTT_TANKGSPKHM();
    this.setNGL_GSPKHM_IRPC_GSPKHM();
    this.setPentane_GSPRY_SCG_GSPRY();

    // // ('this.dataMaster', this.dataMaster);

    let sellingPrice: SellingPrice[] = [];
    _.each(this.dataMaster, (item) => {
      sellingPrice.push({
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
      });
    });

    return await sellingPrice;
  }

  getMaster1(product: any) {
    return _.filter(this.dataMaster, (item) => { return _.trim(item.product, '') === product });
  }
  getMaster2(product: any, demand: any) {
    return _.filter(this.dataMaster, (item) => { return _.trim(item.product, '') === product && item.demand === demand });
  }
  getMaster3(product: any, source: any, deliveryPoint: any) {
    return _.filter(this.dataMaster, (item) => { return _.trim(item.product, '') === product && item.source === source && item.deliveryPoint === deliveryPoint });
  }
  getMaster4(product: any, source: any, demand: any, deliveryPoint: any) {
    return _.filter(this.dataMaster, (item) => { return _.trim(item.product, '') === product && item.source === source && item.demand === demand && item.deliveryPoint === deliveryPoint });
  }

  getRefPrice(RefName: any, CurrentMonth: any) {
    return _.find(this.dataPrices, (item) => { return _.trim(item.referencePriceNameTo, '') === RefName });
  }

  getRefPriceOld(RefName: any, CurrentMonth: any) {
    return _.find(this.dataPriceOlds, (item) => { return _.trim(item.referencePriceNameTo, '') === RefName });
  }

  getC2OLE1() {
    const priceHDPE = this.getRefPrice('HDPE : CFR SEA', 0);
    const priceLLDPE = this.getRefPrice('LLDPE : CFR SEA', 0);
    const priceLDPE = this.getRefPrice('LDPE : CFR SEA', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      let total = 0.42 * (0.336 * (priceHDPE['M' + index] + 28)) + 0.42 * (0.314 * (priceLLDPE['M' + index] + 69)) + 0.16 * (0.344 * (priceLDPE['M' + index] + 17));
      if (total < 370) {
        data['M' + index] = 370;
      } else {
        data['M' + index] = _.round(total, 4);
      }
    }

    data.formula = "if 0.42*(0.336* HDPE : CFR SEA(เดือนปัจจุบัน) + 28)+0.42* (0.314* LLDPE : CFR SEA(เดือนปัจจุบัน) + 69 ) + 0.16* (0.344* LDPE : CFR SEA(เดือนปัจจุบัน) + 17 )  < 370 then 370"
    data.formula += "else rond(0.42*(0.336* HDPE : CFR SEA(เดือนปัจจุบัน) +28)+0.42*(0.314* LLDPE : CFR SEA(เดือนปัจจุบัน) +69 ) +0.16*(0.344* LDPE : CFR SEA(เดือนปัจจุบัน) +17) ,4) end if";

    return data;
  }

  getC2OLE2() {
    const datePriceHDPE = this.getRefPrice('HDPE : CFR SEA', 0);
    const dataPriceLLDPE = this.getRefPrice('LLDPE : CFR SEA', 0);
    const dataPriceLDPE = this.getRefPrice('LDPE : CFR SEA', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      let total = 0.42 * (0.336 * (datePriceHDPE['M' + index] + 28)) + 0.42 * (0.314 * (dataPriceLLDPE['M' + index] + 69)) + 0.16 * (0.344 * (dataPriceLDPE['M' + index] + 17));
      if (total < 370) {
        data['M' + index] = 370 * 1.049;
      } else {
        data['M' + index] = _.round((total * 1.049), 4);
      }
    }
    data.formula = "0.42 * (0.336 * (HDPE : CFR SEA(เดือนปัจจุบัน) + 28)) + 0.42 * (0.314 * (LLDPE : CFR SEA(เดือนปัจจุบัน) + 69)) + 0.16 * (0.344 * (LDPE : CFR SEA(เดือนปัจจุบัน) + 17)); * 1.049";
    return data;
  }

  getC3GC() {
    const datePriceHDPE = this.getRefPrice('HDPE : CFR SEA', 0);
    const dataRefPriceOld = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    data.M1 = datePriceHDPE.M1 + (this.CONST_0_8 + dataRefPriceOld.M12) + 27 - 15;
    for (let index = 2; index < 13; index++) {
      data['M' + index] = datePriceHDPE['M' + index] + (this.CONST_0_8 + dataRefPriceOld['M' + (index - 1)]) + 27 - 15;
    }
    data.formula = "HDPE : CFR SEA(เดือนปัจจุบัน) + ( const_0_8 *  Baltic Rate* (เดือนปัจจุบัน-1)) + 27- 15";
    return data;
  }

  getTier1() {
    const dataRefPriceOld = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    if (dataRefPriceOld) {
      data.M1 = (this.CONST_TEAR1_0_71 + dataRefPriceOld.M12);
      for (let index = 2; index < 13; index++) {
        data['M' + index] = (this.CONST_TEAR1_0_71 + dataRefPriceOld['M' + (index - 1)]);
      }
    }

    data.formula = "( " + this.CONST_TEAR1_0_71 + " *  Baltic Rate* (เดือนปัจจุบัน-1) )";
    return data;
  }

  getTier2() {
    const dataRefPriceOld = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    if (dataRefPriceOld) {
      data.M1 = (this.CONST_TEAR2_0_73 + dataRefPriceOld.M12);
      for (let index = 2; index < 13; index++) {
        data['M' + index] = (this.CONST_TEAR2_0_73 + dataRefPriceOld['M' + (index - 1)]);
      }
    }
    data.formula = "( " + this.CONST_TEAR2_0_73 + " *  Baltic Rate* (เดือนปัจจุบัน-1) )";
    return data;
  }

  get510_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (510 / dateRefPrice['M' + index]);
    }

    data.formula = "(510 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get550_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (550 / dateRefPrice['M' + index]);
    }

    data.formula = "(550 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get150_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (150 / dateRefPrice['M' + index]);
    }

    data.formula = "(150 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get250_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (250 / dateRefPrice['M' + index]);
    }

    data.formula = "(250 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get400_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (400 / dateRefPrice['M' + index]);
    }

    data.formula = "(400 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get500_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (500 / dateRefPrice['M' + index]);
    }

    data.formula = "(500 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get300_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (300 / dateRefPrice['M' + index]);
    }

    data.formula = "(300 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get100_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (100 / dateRefPrice['M' + index]);
    }

    data.formula = "(100 / FX(เดือนปัจจุบัน))";
    return data;
  }

  get620_Divide_FX() {
    const dateRefPrice = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (620 / dateRefPrice['M' + index]);
    }

    data.formula = "(620 / FX(เดือนปัจจุบัน))";
    return data;
  }

  getRefPrice_CPPlattsPlusFX() {
    const dateRefPrice1 = this.getRefPrice('CP Platts', 0);
    const dateRefPrice2 = this.getRefPrice('Freight (X)', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice1['M' + index] + dateRefPrice2['M' + index];
    }

    data.formula = "(CP Platts(เดือนปัจจุบัน) + Freight (X)(เดือนปัจจุบัน))";
    return data;
  }

  getDiscountFreightInsurance() {
    return 0.2 - 8 - 0.01;
  }


  setData1(product: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster1(product);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula
        }
      });
    }
  }

  setData2(product: any, demand: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster2(product, demand);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula
        }
      });
    }
  }

  setData3(product: any, source: any, deliveryPoint: any, data: any) {
    if (data) {
      const dataMaster = this.getMaster3(product, source, deliveryPoint);
      _.each(dataMaster, (item) => {
        for (let index = 1; index < 13; index++) {
          item["M" + index] = data["M" + index]
          item["formulaM" + index] = data.formula
        }
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

  setC2_GSPRY_GCOLE1_GSPRY() {
    const data = this.getC2OLE1();
    this.setData4('C2', 'GSP RY', 'C2 - OLE1', 'GSP RY', data);
  }

  setC2_GSPRY_GCOLE2_GSPRY() {
    const data = this.getC2OLE2();
    this.setData4('C2', 'GSP RY', 'C2 - OLE2', 'GSP RY', data);
  }

  setC2_GSPRY_PTTPEOLE3_GSPRY() {
    const data = this.getC2OLE1();
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (data['M' + index] * this.CONST_1_014) + 2.0224;
    }
    this.setData4('C2', 'GSP RY', 'C2 - OLE3', 'GSP RY', data);
  }

  setC2_GSPRY_PTTPEOLE3274TPerHr_GSPRY() {
    const data = this.getC2OLE1();
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (data['M' + index] * this.CONST_1_014) + 28;
    }
    this.setData4('C2', 'GSP RY', 'C2 - OLE3 (Vol >274T/Hr)', 'GSP RY', data);
  }

  setC2_GSPRY_PTTPEOLE3SPOTGSP5_GSPRY() {
    const data = this.getC2OLE2();
    this.setData4('C2', 'GSP RY', 'C2 - OLE3 (SPOT) GSP5', 'GSP RY', data);
  }

  setC2_GSPRY_PTTPEOLE3Hybrid_GSPRY() {
    const data = this.getC2OLE1();
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (data['M' + index] * this.CONST_1_014) + 100;
    }
    this.setData4('C2', 'GSP RY', 'C2 - OLE3 (Hybrid) supplement', 'GSP RY', data);
  }

  setC2_GSPRY_SCG_GSPRY() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPJ', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      const total = 0.86 * dateRefPrice['M' + index];
      if (total < 410) {
        data['M' + index] = 410;
      } else {
        data['M' + index] = _.round(dateRefPrice['M' + index], 4);
      }
    }
    data.formula = '0.86 * Naphtha :MOPJ(เดือนปัจจุบัน)';
    this.setData4('C2', 'GSP RY', 'C2 - SCG', 'GSP RY', data);
  }

  setC3_N_GC_N() {
    const dateRefPrice1 = this.getRefPrice('HDPE : CFR SEA', 0);
    const dateRefPrice2 = this.getRefPrice('Baltic Rate*', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice1['M' + index] + (this.CONST_0_8 * dateRefPrice2['M' + index]) + 27 - 15;
    }
    data.formula = 'HDPE : CFR SEA(เดือนปัจจุบัน) + (' + this.CONST_0_8 + ' * Baltic Rate*(เดือนปัจจุบัน)) + 27 - 15';
    this.setData2('C3', 'GC', data);
  }

  setC3_N_HMC_N() {
    const dateRefPrice1 = this.getRefPrice('C3 CP', 0);
    const dateRefPrice2 = this.getRefPrice('Baltic Rate*', 0);
    const data: any = {};
    if (dateRefPrice1 && dateRefPrice2) {
      for (let index = 1; index < 13; index++) {
        const total = dateRefPrice1['M' + index] + (this.CONST_0_8 * dateRefPrice2['M' + index]) + 17 + 7.0563;
        if (total < 330) {
          data['M' + index] = 330;
        } else {
          data['M' + index] = _.round(total, 4);
        }
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + (' + this.CONST_0_8 + ' * Baltic Rate*(เดือนปัจจุบัน)) + 17 + 7.0563';
      this.setData2('C3', 'HMC', data);
    }
  }

  setC3_N_PTTAC_N() {
    const dateRefPrice = this.getRefPrice('PP : CFR SEA', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = (dateRefPrice['M' + index] * 0.295) + 72;
    }
    data.formula = '(PP : CFR SEA(เดือนปัจจุบัน)  * 0.295) + 72';
    this.setData2('C3', 'PTTAC', data);
  }

  setC3_N_PTTACSpot_N() {
    const dateRefPrice = this.getRefPrice('C3 CP', 0);
    const dateRefPriceOld = this.getRefPriceOld('Baltic Rate*', -1);
    const data: any = {};
    if (dateRefPrice && dateRefPriceOld) {
      data.M1 = dateRefPrice.M1 + (this.CONST_0_8 * dateRefPriceOld.M12) + 20;
      for (let index = 2; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + (this.CONST_0_8 * dateRefPriceOld['M' + (index - 1)]) + 20;
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + (' + this.CONST_0_8 + ' * Baltic Rate*(เดือนปัจจุบัน - 1))  + 20';
      this.setData3('C3', 'GSP RY', 'PTTACSpot', data);
    }
  }

  setC3_GSPRY_Tier1_GSPRY() {
    const dateRefPrice = this.getRefPrice('C3 CP', 0);
    const dataTier1 = this.getTier1();
    const data: any = {};
    if (dateRefPrice && dataTier1) {
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + dataTier1['M' + index] + this.COMPUTE_17MINUS10;
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + ' + dataTier1.formula + ' + ' + this.COMPUTE_17MINUS10;
      this.setData4('C3', 'GSP RY', 'SCG Tier 1 : 0 - 48 KT', 'GSP RY', data);
      this.setData4('C3', 'GSP RY', 'Ssubstitued C3 - SCG', 'GSP RY', data);
    }
  }

  setC3_Import_Tier1_GSPRY() {
    const dateRefPrice = this.getRefPrice('C3 CP', 0);
    const dataTier1 = this.getTier1();
    const data: any = {};
    if (dateRefPrice && dataTier1) {
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + dataTier1['M' + index];
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + ' + dataTier1.formula;
      this.setData4('C3', 'Import', 'SCG Tier 1 : 0 - 48 KT', 'GSP RY', data);
      this.setData4('C3', 'Import', 'Ssubstitued C3 - SCG', 'GSP RY', data);
    }
  }

  setC3_GSPRY_Tier2_GSPRY() {
    const dateRefPrice = this.getRefPrice('C3 CP', 0);
    const dataTier2 = this.getTier2();
    if (dateRefPrice && dataTier2) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + dataTier2['M' + index] + this.COMPUTE_17MINUS10;
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + ' + dataTier2.formula + ' + ' + this.COMPUTE_17MINUS10;
      this.setData4('C3', 'GSP RY', 'SCG Tier 2 : 48.001 - 400 KT', 'GSP RY', data);
    }
  }

  setC3_Import_Tier2_GSPRY() {
    const dateRefPrice = this.getRefPrice('C3 CP', 0);
    const dataTier2 = this.getTier2();
    if (dateRefPrice && dataTier2) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + dataTier2['M' + index];
      }
      data.formula = 'C3 CP(เดือนปัจจุบัน) + ' + dataTier2.formula;
      this.setData4('C3', 'Import', 'SCG Tier 2 : 48.001 - 400 KT', 'GSP RY', data);
    }
  }

  setC3_GSPRY_Truck_GSPRY() {
    const dateRefPrice1 = this.getRefPrice('GSP Cost กบน.', 0);
    const dateRefPrice2 = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice1['M' + index] + (0.53 * 100 / dateRefPrice2['M' + index]);
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) +  (0.53 * 100 / FX(เดือนปัจจุบัน))';
    this.setData4('C3', 'GSP RY', 'C3 truck', 'GSP RY', data);
  }

  setLPG_GSPRYImport_GC_GSPRY() {
    const dateRefPrice = this.getRefPrice('LPG CP', 0);
    const dateRefPriceOld = this.getRefPriceOld('Baltic Rate*', -1);
    if (dateRefPrice && dateRefPriceOld) {
      const data: any = {};
      data.M1 = dateRefPrice.M1 + (this.CONST_0_8 * dateRefPriceOld.M12) + 20 - 13;
      for (let index = 2; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + (this.CONST_0_8 * dateRefPriceOld['M' + (index - 1)]) + 20 - 13;
      }
      data.formula = 'LPG CP(เดือนปัจจุบัน) + (' + this.CONST_0_8 + ' * Baltic Rate*(เดือนปัจจุบัน - 1)) + 20 - 13';
      this.setData4('LPG', 'GSP RY', 'GSP (LPG) to GC', 'GSP RY', data);
      this.setData4('LPG', 'Import', 'Import (LPG) to GC', 'GSP RY', data);
    }
  }

  setLPG_GSPRY_SCG240KT_GSPRY() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPJ', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - 80;
    }
    data.formula = 'Naphtha :MOPJ(เดือนปัจจุบัน) - 80';
    this.setData4('LPG', 'GSP RY', 'LPG : 48 - 240 KT', 'GSP RY', data);
  }

  setLPG_GSPRY_SCGTear1_GSPRY() {
    const dateRefPrice = this.getRefPrice('LPG CP', 0);
    const dataTier1 = this.getTier1();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] + dataTier1['M' + index] + this.COMPUTE_17MINUS10;
    }
    data.formula = 'LPG CP(เดือนปัจจุบัน) + ' + dataTier1.formula + ' + ' + this.COMPUTE_17MINUS10;
    this.setData4('LPG', 'GSP RY', 'Additional LPG Tier 1 : 1 - 384 KT', 'GSP RY', data);
  }

  setLPG_GSPRY_SCGTear2_GSPRY() {
    const dateRefPrice = this.getRefPrice('LPG CP', 0);
    const dataTier2 = this.getTier2();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] + dataTier2['M' + index] + this.COMPUTE_17MINUS10;
    }
    data.formula = 'LPG CP(เดือนปัจจุบัน) + ' + dataTier2.formula + ' + ' + this.COMPUTE_17MINUS10;
    this.setData4('LPG', 'GSP RY', 'Additional LPG Tier 2 : 384.001 - 720 KT', 'GSP RY', data);
  }

  setLPG_Import_SCGSwap_GSPRY() {
    const dateRefPrice1 = this.getRefPrice('LPG CP', 0);
    const dateRefPrice2 = this.getRefPrice('Freight (X)', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice1['M' + index] + (this.CONST_0_8 + dateRefPrice2['M' + index]) + this.COMPUTE_17MINUS10;
    }
    data.formula = 'LPG CP(เดือนปัจจุบัน) + (' + this.CONST_0_8 + '+ Freight (X)(เดือนปัจจุบัน)) + ' + this.COMPUTE_17MINUS10;
    this.setData4('LPG', 'Import', 'SWAP LPG : Max 400 KT', 'GSP RY', data);
  }

  setLPG_GSPRY_ODORLESS_GSPRY() {
    const dateRefPrice1 = this.getRefPrice('GSP Cost กบน.', 0);
    const dateRefPrice2 = this.getRefPrice('FX', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice1['M' + index] + (2500 / dateRefPrice2['M' + index]);
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) + (2500 / Freight (X)(เดือนปัจจุบัน))';
    this.setData4('LPG', 'GSP RY', 'PTTOR (LPG ไม่มีกลิ่น)', 'GSP RY', data);
  }

  setLPG_Export_TBU_MT() {
    const dateRefPrice = this.getRefPrice('LPG CP', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index];
    }
    data.formula = 'LPG CP(เดือนปัจจุบัน)';
    this.setData4('LPG', 'Export', 'TBU', 'MT', data);
  }

  setLPG_Import_PTTOR_MT() {
    const priceCP = this.getRefPrice_CPPlattsPlusFX();
    const get550 = this.get550_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = priceCP['M' + index] + get550['M' + Index];
    }
    data.formula = priceCP.formula + ' + ' + get550.formula;
    this.setData4('LPG', 'Import', 'PTTOR', 'MT', data);
  }

  setLPG_Import_SGPUGP_MT() {
    const priceCP = this.getRefPrice_CPPlattsPlusFX();
    const get510 = this.get510_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = priceCP['M' + index] + get510['M' + Index];
    }
    data.formula = priceCP.formula + ' + ' + get510.formula;
    this.setData4('LPG', 'Import', 'SGP', 'MT', data);
    this.setData4('LPG', 'Import', 'UGP', 'MT', data);
  }

  setLPG_GSPRYGSPKHM_PTTOR_MTBRPGSPKHM() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get550 = this.get550_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get550['M' + Index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get550.formula;
    this.setData4('LPG', 'GSP RY', 'PTTOR', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'PTTOR', 'BRP', data);
    this.setData4('LPG', 'GSP KHM', 'PTTOR', 'GSP KHM', data);
  }

  setLPG_GSPRY_PTTOR_PTTTANK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get550 = this.get550_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get550['M' + Index] - get150['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get550.formula + ' - ' + get150.formula;
    this.setData4('LPG', 'GSP RY', 'PTTOR', 'PTT TANK', data);
  }

  setLPG_GSPRY_PTTOR_PTTTANK_TRUCK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get550 = this.get550_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const get250 = this.get250_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get550['M' + Index] - get150['M' + index] + get250['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get550.formula + ' - ' + get150.formula + ' + ' + get250.formula;
    this.setData4('LPG', 'GSP RY', 'PTTOR', 'PTT TANK (Truck)', data);
  }

  setLPG_GSPRY_SGPUGP_MT() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get510 = this.get510_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get510['M' + Index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get510.formula;
    this.setData4('LPG', 'GSP RY', 'SGP', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'UGP', 'MT', data);
  }

  setLPG_GSPRY_BCPESSO_MTBRP() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] + get150['M' + Index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) + ' + get150.formula;
    this.setData4('LPG', 'GSP RY', 'BCP', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'ESSO', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'ESSO', 'BRP', data);
  }

  setLPG_FXValue_PTTTANK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน)';
    this.setData4('LPG', 'GSP RY', 'BCP', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'Chevron', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'ESSO', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'UNO', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'Orchid', 'PTT TANK', data);
  }

  setLPG_GSPRY_BiggasPapIRPCAtlas_MT() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get400 = this.get400_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get400['M' + index] + get150['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get400.formula + ' + ' + get150.formula;
    this.setData4('LPG', 'GSP RY', 'Big gas', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'PAP', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'IRPC', 'MT', data);
    this.setData4('LPG', 'GSP RY', 'Atlas', 'MT', data);
  }

  setLPG_GSPRY_BiggasPapIRPCAtlas_PTTTANK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get400 = this.get400_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get400['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get400.formula;
    this.setData4('LPG', 'GSP RY', 'Big gas', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'PAP', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'IRPC', 'PTT TANK', data);
    this.setData4('LPG', 'GSP RY', 'Atlas', 'PTT TANK', data);
  }

  setLPG_GSPRY_PAP_PTTTANK_TRUCK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get400 = this.get400_Divide_FX();
    const get250 = this.get250_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get400['M' + index] + get250['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get400.formula + ' + ' + get250.formula;
    this.setData4('LPG', 'GSP RY', 'PAP', 'PTT TANK (Truck)', data);
  }

  setLPG_GSPRY_WP_MT() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get620 = this.get620_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get620['M' + index] + get150['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get620.formula + ' + ' + get150.formula;
    this.setData4('LPG', 'GSP RY', 'WP', 'MT', data);
  }

  setLPG_GSPRY_WP_PTTTANK() {
    const dateRefPrice = this.getRefPrice('GSP Cost กบน.', 0);
    const get620 = this.get620_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dateRefPrice['M' + index] - get620['M' + index];
    }
    data.formula = 'GSP Cost กบน.(เดือนปัจจุบัน) - ' + get620.formula;
    this.setData4('LPG', 'GSP RY', 'WP', 'PTT TANK', data);
  }

  setLPG_IRPCGC_PTTOR_IRPCPTTTANK() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get550 = this.get550_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get550['M' + index] - get150['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get550.formula + ' - ' + get150.formula;
    this.setData4('LPG', 'IRPC', 'WP', 'IRPC', data);
    this.setData4('LPG', 'GC', 'WP', 'PTT TANK', data);
  }

  setLPG_IRPCGCSPRC_WP_IRPCPTTANKSPRC() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get620 = this.get620_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get620['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get620.formula;
    this.setData4('LPG', 'IRPC', 'WP', 'IRPC', data);
    this.setData4('LPG', 'GC', 'WP', 'PTT TANK', data);
    this.setData4('LPG', 'SPRC', 'WP', 'SPRC', data);
  }

  setLPG_IRPCSPRC_Atlas_IRPCSPRC() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get500 = this.get500_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get500['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get500.formula;
    this.setData4('LPG', 'IRPC', 'Atlas', 'IRPC', data);
    this.setData4('LPG', 'SPRC', 'WP', 'SPRC', data);
  }

  setLPG_GC_PTTOR_MT() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get550 = this.get550_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get550['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get550.formula;
    this.setData4('LPG', 'GC', 'PTTOR', 'MT', data);
  }

  setLPG_GC_PTTOR_PTT_TANK_TRUCK() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get550 = this.get550_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const get250 = this.get250_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get550['M' + index] - get150['M' + index] + get250['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get550.formula + ' - ' + get150.formula + ' + ' + get250.formula;
    this.setData4('LPG', 'GC', 'PTTOR', 'PTT TANK (Truck)', data);
  }

  setLPG_GC_BCPESSO_MT() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get150['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get150.formula;
    this.setData4('LPG', 'GC', 'BCP', 'MT', data);
    this.setData4('LPG', 'GC', 'ESSO', 'MT', data);
  }

  setLPG_GC_BSPESSOOrchid_PTTTANK() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index];
    }
    data.formula = dataCP.formula;
    this.setData4('LPG', 'GC', 'BCP', 'PTT TANK', data);
    this.setData4('LPG', 'GC', 'ESSO', 'PTT TANK', data);
    this.setData4('LPG', 'GC', 'Orchid', 'PTT TANK', data);
  }

  setLPG_GC_PAPIRPCAltas() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get400 = this.get400_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get400['M' + index] + get150['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get400.formula + ' + ' + get150.formula;
    this.setData4('LPG', 'GC', 'PAP', 'MT', data);
    this.setData4('LPG', 'GC', 'IRPC', 'MT', data);
    this.setData4('LPG', 'GC', 'Altas', 'MT', data);
  }

  setLPG_GCSPRC_PAPIRPCAltas_PTTTANKSPRC() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get400 = this.get400_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get400['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get400.formula;
    this.setData4('LPG', 'GC', 'PAP', 'PTTTANK', data);
    this.setData4('LPG', 'GC', 'IRPC', 'PTTTANK', data);
    this.setData4('LPG', 'GC', 'Altas', 'PTTTANK', data);
    this.setData4('LPG', 'SPRC', 'PAP', 'PTTTANK', data);
  }

  setLPG_GC_PAP_TANK_TRUCK() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get400 = this.get400_Divide_FX();
    const get250 = this.get250_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get400['M' + index] + get250['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get400.formula + ' + ' + get250.formula;
    this.setData4('LPG', 'GC', 'PAP', 'PTT TANK (Truck)', data);
  }

  setLPG_GC_WP_MT() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get620 = this.get620_Divide_FX();
    const get150 = this.get150_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get620['M' + index] + get150['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get620.formula + ' + ' + get150.formula;
    this.setData4('LPG', 'GC', 'WP', 'MT', data);
  }

  setLPG_SPRC_SGC_MT() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get510 = this.get510_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get510['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get510.formula;
    this.setData4('LPG', 'SPRC', 'SGP', 'MT', data);
  }

  setLPG_SPRC_PTTOR_SPRC() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get550 = this.get550_Divide_FX();
    const get300 = this.get300_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] - get550['M' + index] - get300['M' + index];
    }
    data.formula = dataCP.formula + ' - ' + get550.formula + ' - ' + get300.formula;
    this.setData4('LPG', 'SPRC', 'PTTOR', 'SPRC', data);
  }

  setLPG_PTTEP_PTTOR_PTTEP() {
    const dataCP = this.getRefPrice_CPPlattsPlusFX();
    const get100 = this.get100_Divide_FX();
    const data: any = {};
    for (let index = 1; index < 13; index++) {
      data['M' + index] = dataCP['M' + index] + get100['M' + index];
    }
    data.formula = dataCP.formula + ' + ' + get100.formula;
    this.setData4('LPG', 'PTTEP (LKB)', 'PTTOR', 'PTTEP/LKB (Truck)', data);
  }

  setNGL_GSPRY_GCSCG_GSPRY() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPJ', 0);
    if (dateRefPrice) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] - 12.5;
      }
      data.formula = 'Naphtha :MOPJ(เดือนปัจจุบัน) - 12.5';
      this.setData4('NGL', 'GSP RY', 'GC', 'GSP RY', data);
    }
  }

  setNGL_GSPRYGSPKHM_Export_MTPTT_TANKGSPKHM() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPS', 0);
    if (dateRefPrice) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] + (this.getDiscountFreightInsurance() / 158.987 / 0.648 * 1000)
      }
      data.formula = 'Naphtha :MOPJ(เดือนปัจจุบัน) + ' + this.getDiscountFreightInsurance() + ' / 158.987 / 0.648 * 1000';
      this.setData4('NGL', 'GSP RY', 'Export', 'MT/PTT TANK', data);
      this.setData4('NGL', 'GSP KHM', 'Export', 'GSP KHM', data);
    }
  }

  setNGL_GSPKHM_IRPC_GSPKHM() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPJ', 0);
    if (dateRefPrice) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] - 10 - 22.5;
      }
      data.formula = 'Naphtha :MOPJ(เดือนปัจจุบัน) - 10 - 22.5';
      this.setData4('NGL', 'GSP KHM', 'IRPC', 'GSP KHM', data);
    }
  }

  setPentane_GSPRY_SCG_GSPRY() {
    const dateRefPrice = this.getRefPrice('Naphtha :MOPJ', 0);
    if (dateRefPrice) {
      const data: any = {};
      for (let index = 1; index < 13; index++) {
        data['M' + index] = dateRefPrice['M' + index] - 100;
      }
      data.formula = 'Naphtha :MOPJ(เดือนปัจจุบัน) - 100';
      this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier1 - ROC', 'GSP RY', data);
      this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier2 - ROC', 'GSP RY', data);
      this.setDataPentane('Pentane', 'GSP RY', 'Pentane Tier3 - ROC', 'GSP RY', data);
    }
  }

}
