import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import moment from 'moment';
import { AbilityRefineryService } from '../../ability-plan/ability-refinery/ability-refinery.service';
import { AbilityPlanRayongService } from '../../ability-plan/ability-plan-rayong/ability-plan-rayong.service';
import { OptimizationsService } from '../../optimization/optimizations.service';
import { LpgRollingReportResponseDto } from './dto/lpgRollingResponseDto';
import { AbilityPentaneService } from '../../ability-plan/ability-pentane/ability-pentane.service';
import { AbilityPlanKhmService } from '../../ability-plan/ability-plan-khm/ability-plan-khm.service';
import { OptimizationLrMonthly, OptimizationVersion } from '../../optimization/entity';
import { AbilityPlanRayong, AbilityPlanRayongVersion } from '../../ability-plan/ability-plan-rayong/entity';
import { AbilityPentaneVersion } from '../../ability-plan/ability-pentane/entity';
import { AbilityPlanKhm, AbilityPlanKhmVersion } from '../../ability-plan/ability-plan-khm/entity';
import { AbilityRefinery, AbilityRefineryVersion } from '../../ability-plan/ability-refinery/entity';
import { KhmSupplierRequest } from '../../ability-plan/ability-plan-khm/dto/khmSupplierRequest';
import { TotalSupplyDto } from './dto/totalSupplyDto';
import { MergeAlloDto } from './dto/mergeAlloDto';

@Injectable()
export class LpgRollingReportService {
  constructor(
    private readonly abilityRayongService: AbilityPlanRayongService,
    private readonly abilityRefineryService: AbilityRefineryService,
    private readonly abilityKhmService: AbilityPlanKhmService,
    private readonly abilityPentaneService: AbilityPentaneService,

    private readonly optimizationService: OptimizationsService
  ) 
  { }

  async getList(optimizationVersionId: string): Promise<any> {
    let dateStart : any = null;
    let dateEnd : any = null;
    let report : LpgRollingReportResponseDto = new LpgRollingReportResponseDto(); 
    let totalSupplies : TotalSupplyDto[] = [];
    let domesticDemand: MergeAlloDto[] = [];
    let optimizationPlan : OptimizationVersion = await this.optimizationService.getVersionById(optimizationVersionId);
    report.totalSupply = [];
    report.domesticDemand = [];
    if(optimizationPlan){
      let rayongVersion : AbilityPlanRayongVersion ;
      let khmVersion : AbilityPlanKhmVersion;
      let refineryVersion : AbilityRefineryVersion;

      let resultAllVersion = await Promise.all([
        this.abilityRayongService.getVersionById({versionId: optimizationPlan.abilityPlanRayongId}),
        this.abilityKhmService.getVersionById({versionId: optimizationPlan.abilityPlanKhmId}),
        this.abilityRefineryService.getVersionById({versionId: optimizationPlan.abilityRefineryId})

      ])

      rayongVersion = resultAllVersion[0];
      khmVersion = resultAllVersion[1];
      refineryVersion = resultAllVersion[2];

      let rayongParams = {
        year: rayongVersion.year,
        month: rayongVersion.month, 
        version: rayongVersion.version,
        products: ['LPG'],
        plants: ['GSP1','GSP2', 'GSP3','GSP5', 'GSP6']
      }

      let khmParams = new KhmSupplierRequest();
      khmParams.year = _.toNumber(khmVersion.year);
      khmParams.month = _.toNumber(khmVersion.month);
      khmParams.version = _.toNumber(khmVersion.version);
      khmParams.supplier = ['LPG'];

      let refineryParams = {
        year: refineryVersion.year,
        month: refineryVersion.month, 
        version: refineryVersion.version,
      }

      let abilityRayong: AbilityPlanRayong[] = await this.abilityRayongService.getListByProductAndPlant(rayongParams);
      let abllityKhm: AbilityPlanKhm[] = await this.abilityKhmService.getSupplierList(khmParams);
      let abilityRefinery: AbilityRefinery[] = await this.abilityRefineryService.getList(refineryParams);
      const dataC3ImportSplitToScg = await this.optimizationService.getDataTotalSupplyToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'C3 Import Split Cargo',
        'SCG',
        false
      );

      const dataC3ImportReverseToScg = await this.optimizationService.getDataTotalSupplyToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'C3 Import Reversed Pipeline',
        'SCG',
        true
      );

      const dataC3ImportReverseToGC = await this.optimizationService.getDataTotalSupplyToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'C3 Import Reversed Pipeline',
        'GC',
        true
      );

      const dataImportCargoToMT = await this.optimizationService.getDataLrTotalSupplyToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version)
      );

      const dataPretoM7 = await this.optimizationService.getPretoDemandDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'Petro M.7',
        'GSP RY',
        'GSP RY'
      );

      const dataPretoNonM7 = await this.optimizationService.getPretoDemandDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'Petro Non M.7',
        'GSP RY',
        'GSP RY'
      );

      const dataDomestic = await this.optimizationService.getDomesticDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version)
      );

      const dataImportTBU = await this.optimizationService.getDataLRDomesticToLpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        '- ดึง Import ขาย Re-Export to TBU (Vessel)'
      );

      const dataImportOR = await this.optimizationService.getDataLRDomesticToLpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        '- ดึง Import ขาย Re-Export to OR (Truck)'
      );


      const dataC3LpgCloing = await this.optimizationService.getEndDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'C3/LPG End Inventory'
      );

      const dataC3Cloing = await this.optimizationService.getEndDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'C3 End Inventory'
      );

      const dataLpgCloing = await this.optimizationService.getEndDataToC3LpgReport(
        optimizationPlan.year,
        optimizationPlan.month,
        _.toNumber(optimizationPlan.version),
        'LPG End Inventory'
      );



      const resultMapAll = await Promise.all([
        this.getRayongData(abilityRayong),
        this.getKhmData(abllityKhm),
        this.getRefineryData(abilityRefinery),
        this.getImportMapping(dataC3ImportSplitToScg, 'C3 Import Cargo Split to SCG'),
        this.getImportMapping(dataC3ImportReverseToScg, 'C3 Import reversed pipeline to SCG'),
        this.getImportMapping(dataC3ImportReverseToGC, 'C3 Import reversed pipeline to GC'),
        this.getImportMapping(dataImportCargoToMT, 'Import Cargo to MT'),
        this.getImportMapping(dataPretoM7, 'Matra7 Feedstock  (GC, SCG)'),
        this.getImportMapping(dataPretoNonM7, 'Non-Matra7 Feedstock (HMC,PTTAC)'),
        this.getImportMappingCalculate(dataC3LpgCloing, 'C3/LPG Closing Inventory (KT)'),
        this.getImportMappingCalculate(dataC3Cloing, 'C3 Closing Inventory (KT)'),
        this.getImportMappingCalculate(dataLpgCloing, 'LPG Closing Inventory (KT)'),
      ]);

      const resultAllDomestic = await Promise.all([
        this.getImportMappingMergeAllo(dataDomestic),
        this.getImportMappingMergeAlloForSourceAndDelivery(dataImportTBU, 'Import','TBU','MT'),
        this.getImportMappingMergeAlloForSourceAndDelivery(dataImportOR, 'Import','PTTOR','BRP'),
      ])
      

      totalSupplies = totalSupplies.concat(
        resultMapAll[0], 
        resultMapAll[1],
        resultMapAll[2],
        resultMapAll[3],
        resultMapAll[4],
        resultMapAll[5],
        resultMapAll[6],
        resultMapAll[7],
        resultMapAll[8],
        resultMapAll[9],
        resultMapAll[10],
        resultMapAll[11],
      );

      domesticDemand = domesticDemand.concat(resultAllDomestic[0], resultAllDomestic[1], resultAllDomestic[2])
      report.totalSupply = totalSupplies;
      report.domesticDemand = domesticDemand;
      report.rayongRemark = rayongVersion.remark;
      report.khmRemark = khmVersion.remark;

    }

    return report;
  }

  getKhmData(abilityKhms : AbilityPlanKhm[]): Promise<TotalSupplyDto[]> {
    return new Promise((resolve, rejects) => {
      const list: TotalSupplyDto[] = [];       

      for(const khm of abilityKhms){
        const data = new TotalSupplyDto();

        data.monthValue = khm.monthValue;
        data.product = khm.product;
        data.productId = khm.productId;
        data.productionPlant = "GSP4";        
        data.value = khm.value;
        data.yearValue= khm.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getRayongData(abilityPlanRayongs : AbilityPlanRayong[]): Promise<TotalSupplyDto[]> {
    return new Promise((resolve, rejects) => {
      const list: TotalSupplyDto[] = [];       

      for(const abilityRayong of abilityPlanRayongs){
        const data = new TotalSupplyDto();

        data.monthValue = abilityRayong.monthValue;
        data.product = abilityRayong.product;
        data.productId = abilityRayong.productId;
        data.productionPlant = abilityRayong.productionPlant;
        data.productionPlantId = abilityRayong.productionPlantId;
        data.value = abilityRayong.value;
        data.yearValue= abilityRayong.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getRefineryData(abilityRefineries : AbilityRefinery[]): Promise<TotalSupplyDto[]> {
    return new Promise((resolve, rejects) => {
      const list: TotalSupplyDto[] = [];       

      for(const abilityRayong of abilityRefineries){
        const data = new TotalSupplyDto();

        data.monthValue = abilityRayong.monthValue;
        data.product = abilityRayong.product;
        data.productId = abilityRayong.productId;
        data.productionPlant = abilityRayong.supplier;
        data.productionPlantId = abilityRayong.supplierId;
        data.value = abilityRayong.value;
        data.yearValue= abilityRayong.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getImportMapping(lpgs: any[], product) : Promise<TotalSupplyDto[]>{
    return new Promise((resolve, rejects) => {
      const list: TotalSupplyDto[] = [];       

      for(const lpg of lpgs){
        const data = new TotalSupplyDto();

        data.monthValue = lpg.monthValue;
        data.product = product;
        data.value = lpg.value;
        data.yearValue= lpg.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getImportMappingCalculate(lpgs: any[], product) : Promise<TotalSupplyDto[]>{
    return new Promise((resolve, rejects) => {
      const list: TotalSupplyDto[] = [];       

      for(const lpg of lpgs){
        const data = new TotalSupplyDto();

        data.monthValue = lpg.monthValue;
        data.product = product;
        data.value = lpg.value / 1000;
        data.yearValue= lpg.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getImportMappingMergeAllo(lpgs: any[]) : Promise<MergeAlloDto[]>{
    return new Promise((resolve, rejects) => {
      const list: MergeAlloDto[] = [];       

      for(const lpg of lpgs){
        const data = new MergeAlloDto();

        data.monthValue = lpg.monthValue;
        data.source = lpg.source;
        data.deliveryPoint = lpg.deliveryPoint;
        data.demand = lpg.demand;
        data.value = lpg.value;
        data.yearValue= lpg.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }

  getImportMappingMergeAlloForSourceAndDelivery(lpgs: any[], source: string, demand: string, delivery) : Promise<MergeAlloDto[]>{
    return new Promise((resolve, rejects) => {
      const list: MergeAlloDto[] = [];       

      for(const lpg of lpgs){
        const data = new MergeAlloDto();

        data.monthValue = lpg.monthValue;
        data.source = source;
        data.deliveryPoint = delivery;
        data.demand = demand;
        data.value = lpg.value;
        data.yearValue= lpg.yearValue;
        list.push(data);
      }

      resolve(list)
    })
  }
  
}