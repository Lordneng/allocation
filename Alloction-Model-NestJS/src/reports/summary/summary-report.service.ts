import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import moment from 'moment';
import { ReferencePrice, ReferencePriceVersion } from '../../reference-prices/entity';
import { ReferencePricesService } from '../../reference-prices/reference-prices.service';
import { CalMarginService } from '../../cal-margin/cal-margin.service';
import { CalMarginVersion } from '../../cal-margin/entity/cal-margin-version.entity';
import { OptimizationVersion, OptimizationVolumn } from '../../optimization/entity';
import { OptimizationsService } from '../../optimization/optimizations.service';
import { SummaryReportResponseDto } from './dto/summaryReportResponseDto';
import { CalmarginReportDto } from '../../cal-margin/dto/CalmarginReportDto';
import { SummaryDataDto } from './dto/summaryDataDto';
import { CalmarginContractDto } from '../../cal-margin/dto/calmarginContractDto';


@Injectable()
export class SummaryReportService {
  constructor(
    private readonly optimizationService: OptimizationsService,
    private readonly calMarginService: CalMarginService,
    private readonly referencePriceService: ReferencePricesService
  ) 
  { }

  async getList(optimizationVersionId: string): Promise<SummaryReportResponseDto> {  
    let report : SummaryReportResponseDto = new SummaryReportResponseDto(); 
    report.volumeKT = [];
    report.revenue = [];
    report.margin = [];
 
    const optimizationVersion : OptimizationVersion = await this.optimizationService.getVersionById(optimizationVersionId);
    
    if(optimizationVersion){      
      let dateStart = moment(optimizationVersion.year + '-' + _.padStart(optimizationVersion.month, 2, '0') + '-01');
      let dateEnd = moment(dateStart).add(11, 'M');
      const paramVolumnKT = { 
        year: optimizationVersion.year, 
        month: optimizationVersion.month, 
        version: optimizationVersion.version, 
        isWithOutDemandAI: optimizationVersion.isWithOutDemandAI 
      };

      report.year = optimizationVersion.year;
      report.month = optimizationVersion.month;

      const resultVersion = await Promise.all([
        this.calMarginService.getVersionById({versionId: optimizationVersion.calMarginId }),
        this.optimizationService.getVolumnList(paramVolumnKT)
      ])

      const calmarginVersion : CalMarginVersion = resultVersion[0]; 
      const volumnKT: OptimizationVolumn[] = resultVersion[1] ;

      const referencePriceVersion : ReferencePriceVersion = await this.referencePriceService.getVersionById(calmarginVersion.referencePriceVersionId);
      const params = { year: referencePriceVersion.year, month: referencePriceVersion.month, version: referencePriceVersion.version };
      const referencePrices : ReferencePrice[] = await this.referencePriceService.getList(params);
      const fx : ReferencePrice[] = _.filter(referencePrices, ['referencePriceNameTo', 'FX']);
      const calmarginReports : CalmarginReportDto[] = await this.calMarginService.getByVersionToReport(optimizationVersion.calMarginId);
      
      const contracts : CalmarginContractDto[] = await this.calMarginService.listContract(dateStart);

      if (contracts && contracts.length > 0) {
        let contractList = _.uniqBy(_.cloneDeep(contracts), v => [v.productName, v.customerName, v.customerPlantName, v.sourceId, v.deliveryId, v.demandName, v.conditionsOfSaleId].join());
        contractList = _.orderBy(contracts, ['productName', 'customerPlantName'], ['asc', 'asc']);
        for (const contract of contractList) {
          for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {

            const yearValue = index.year();
            const monthValue = index.month() + 1;
  
            const calmargin : CalmarginReportDto = _.find(calmarginReports, (report: CalmarginReportDto) => {
              return report.yearValue == yearValue && report.monthValue == monthValue &&
              report.productName == contract.productName && 
              report.sourceName == contract.sourceName && 
              report.deliveryName == contract.deliveryName &&
              report.demandName == contract.demandName &&
              report.contractId == contract.contractId;
            })
  
            const volumnKTMonths : OptimizationVolumn[] = _.filter(volumnKT, (volume: OptimizationVolumn) => {
              return volume.yearValue == _.toNumber(yearValue) && volume.monthValue == _.toNumber(monthValue);
            })
  
            const fxData : ReferencePrice = _.find(fx, (ref: ReferencePrice) => {
              return ref.yearValue == _.toNumber(yearValue) && ref.monthValue == _.toNumber(monthValue);
            })
  
            const result = await Promise.all([
              this.getVolumnKT(calmargin, volumnKTMonths),
              this.getRevenue(calmargin, volumnKTMonths, fxData),
              this.getMargin(calmargin, volumnKTMonths, fxData),
            ])
            
            report.volumeKT.push(result[0]);
            report.revenue.push(result[1]);
            report.margin.push(result[2]);
          }
        }
      }
    }

    return report;
  }

  getVolumnKT(calmargin: CalmarginReportDto, volumns : OptimizationVolumn[]): Promise<SummaryDataDto> {
    return new Promise((resolve, rejects) => {
      const data = new SummaryDataDto();
      const volume : OptimizationVolumn = _.find(volumns, (volume: OptimizationVolumn) => {
        return volume.contractConditionOfSaleId == calmargin.contractConditionOfSaleId && 
        volume.yearValue == calmargin.yearValue &&
        volume.monthValue == calmargin.monthValue
      })

      data.conditionsOfSaleId = calmargin.conditionsOfSaleId;
      data.conditionsOfSaleName = calmargin.conditionsOfSaleName;
      data.contractConditionOfSaleId = calmargin.contractConditionOfSaleId;
      data.contractId = calmargin.contractId;
      data.contractNumber = calmargin.contractNumber;
      data.contractTypeId = calmargin.contractTypeId;
      data.contractTypeName = calmargin.contractTypeName;
      data.customerId = calmargin.customerId;
      data.customerName = calmargin.customerName;
      data.customerPlantId = calmargin.customerPlantId;
      data.customerPlantName = calmargin.customerName;
      data.deliveryId = calmargin.deliveryId;
      data.deliveryName = calmargin.deliveryName;
      data.demandName = calmargin.demandName;
      data.monthValue = calmargin.monthValue;
      data.productGradCode = calmargin.productGradCode;
      data.productGradId = calmargin.productGradId;
      data.productGradeName = calmargin.productGradeName;
      data.productId = calmargin.productId;
      data.productName = calmargin.productName;
      data.sourceId = calmargin.sourceId;
      data.sourceName = calmargin.sourceName;
      data.supplierId = calmargin.supplierId;
      data.supplierName = calmargin.supplierName;
      data.transportationTypeCode = calmargin.transportationTypeCode;
      data.transportationTypeName = calmargin.transportationTypeName;
      data.unitId = calmargin.unitId;
      data.unitName = calmargin.unitName;
      data.yearValue = calmargin.yearValue;

      if(volume){
        data.value = _.toNumber(volume.value);
      } else {
        data.value = 0;
      }

      resolve(data)
    })
  }

  getRevenue(calmargin: CalmarginReportDto, volumns : OptimizationVolumn[], fx : ReferencePrice): Promise<SummaryDataDto> {
    return new Promise((resolve, rejects) => {
      const data = new SummaryDataDto();
      const volume : OptimizationVolumn = _.find(volumns, (volume: OptimizationVolumn) => {
        return volume.contractConditionOfSaleId == calmargin.contractConditionOfSaleId && 
        volume.yearValue == calmargin.yearValue &&
        volume.monthValue == calmargin.monthValue
      })

      let volumeValue = 0;
      let fxValue = 0

      data.conditionsOfSaleId = calmargin.conditionsOfSaleId;
      data.conditionsOfSaleName = calmargin.conditionsOfSaleName;
      data.contractConditionOfSaleId = calmargin.contractConditionOfSaleId;
      data.contractId = calmargin.contractId;
      data.contractNumber = calmargin.contractNumber;
      data.contractTypeId = calmargin.contractTypeId;
      data.contractTypeName = calmargin.contractTypeName;
      data.customerId = calmargin.customerId;
      data.customerName = calmargin.customerName;
      data.customerPlantId = calmargin.customerPlantId;
      data.customerPlantName = calmargin.customerName;
      data.deliveryId = calmargin.deliveryId;
      data.deliveryName = calmargin.deliveryName;
      data.demandName = calmargin.demandName;
      data.monthValue = calmargin.monthValue;
      data.productGradCode = calmargin.productGradCode;
      data.productGradId = calmargin.productGradId;
      data.productGradeName = calmargin.productGradeName;
      data.productId = calmargin.productId;
      data.productName = calmargin.productName;
      data.sourceId = calmargin.sourceId;
      data.sourceName = calmargin.sourceName;
      data.supplierId = calmargin.supplierId;
      data.supplierName = calmargin.supplierName;
      data.transportationTypeCode = calmargin.transportationTypeCode;
      data.transportationTypeName = calmargin.transportationTypeName;
      data.unitId = calmargin.unitId;
      data.unitName = calmargin.unitName;
      data.yearValue = calmargin.yearValue;


      if(volume){
        volumeValue = _.toNumber(volume.value);
      } 

      if(fx){
        fxValue = _.toNumber(fx.value);
      } 

      data.value = (calmargin.sellingPriceValue * volumeValue * fxValue) / 1000;

      resolve(data)
    })
  }

  getMargin(calmargin: CalmarginReportDto, volumns : OptimizationVolumn[], fx : ReferencePrice): Promise<SummaryDataDto> {
    return new Promise((resolve, rejects) => {
      const data = new SummaryDataDto();
      const volume : OptimizationVolumn = _.find(volumns, (volume: OptimizationVolumn) => {
        return volume.contractConditionOfSaleId == calmargin.contractConditionOfSaleId && 
        volume.yearValue == calmargin.yearValue &&
        volume.monthValue == calmargin.monthValue
      })

      let volumeValue = 0;
      let fxValue = 0

      data.conditionsOfSaleId = calmargin.conditionsOfSaleId;
      data.conditionsOfSaleName = calmargin.conditionsOfSaleName;
      data.contractConditionOfSaleId = calmargin.contractConditionOfSaleId;
      data.contractId = calmargin.contractId;
      data.contractNumber = calmargin.contractNumber;
      data.contractTypeId = calmargin.contractTypeId;
      data.contractTypeName = calmargin.contractTypeName;
      data.customerId = calmargin.customerId;
      data.customerName = calmargin.customerName;
      data.customerPlantId = calmargin.customerPlantId;
      data.customerPlantName = calmargin.customerName;
      data.deliveryId = calmargin.deliveryId;
      data.deliveryName = calmargin.deliveryName;
      data.demandName = calmargin.demandName;
      data.monthValue = calmargin.monthValue;
      data.productGradCode = calmargin.productGradCode;
      data.productGradId = calmargin.productGradId;
      data.productGradeName = calmargin.productGradeName;
      data.productId = calmargin.productId;
      data.productName = calmargin.productName;
      data.sourceId = calmargin.sourceId;
      data.sourceName = calmargin.sourceName;
      data.supplierId = calmargin.supplierId;
      data.supplierName = calmargin.supplierName;
      data.transportationTypeCode = calmargin.transportationTypeCode;
      data.transportationTypeName = calmargin.transportationTypeName;
      data.unitId = calmargin.unitId;
      data.unitName = calmargin.unitName;
      data.yearValue = calmargin.yearValue;


      if(volume){
        volumeValue = _.toNumber(volume.value);
      } 

      if(fx){
        fxValue = _.toNumber(fx.value);
      } 

      data.value = (calmargin.marginPerUnitValue * calmargin.sellingPriceValue * volumeValue * fxValue) / 1000;

      resolve(data)
    })
  }
}