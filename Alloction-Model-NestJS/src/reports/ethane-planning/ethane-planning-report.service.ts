import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { EthanePlanningReportResponseDto } from './dto/ethanePlanningReportResponseDto';
import { monthlyReportDto } from './dto/monthlyReportDto';
import { EthanePlanningDto } from './dto/ethanePlanningDto';
import moment from 'moment';
import { AbilityPlanRayongService } from '../../ability-plan/ability-plan-rayong/ability-plan-rayong.service';
import { EthanePlanningDailyDto } from './dto/ethanePlanningDailyDto';
import { OptimizationsService } from '../../optimization/optimizations.service';

@Injectable()
export class EthanePlanningReportService {
  constructor(private readonly abilityRayongService: AbilityPlanRayongService,
    private readonly optimizationService: OptimizationsService
  ) 
  { }

  async getList(estimateVersionId: string, planVersionId: string, month: number, year: number): Promise<any> {
    let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');
    let report : EthanePlanningReportResponseDto = new EthanePlanningReportResponseDto(); 
    report.monthly = new monthlyReportDto();
 
    let optimizationPlan = await this.optimizationService.getVersionById(planVersionId);
    let optimizationEstimate = await this.optimizationService.getVersionById(estimateVersionId);


    let estimateVersion = await this.abilityRayongService.getVersionById({versionId: optimizationEstimate.abilityPlanRayongId});
    let planVersion = await this.abilityRayongService.getVersionById({versionId: optimizationPlan.abilityPlanRayongId});
    
    let estimateData = await this.getEthaneData(estimateVersion.year, estimateVersion.month, year, month, estimateVersion.version);
    let planData = await this.getEthaneData(planVersion.year, planVersion.month, year, month, planVersion.version);

    report.monthly.estimate = estimateData;
    report.monthly.plan = planData;
    report.monthly.month = await this.listData(dateStart, dateEnd);
    report.monthly.remark = estimateVersion.remark;
    report.daily = await this.listDailyData(dateStart, estimateVersion)

    return report;
  }

  async listData(dateStart, dateEnd): Promise<any> {
    let dataList: any = [];
    dateStart = moment(dateStart).add(1, 'M');
    
    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')){
      let dataLowCo2 = await this.abilityRayongService.listEthanePlanningDataByProductPlant(index, 'Low CO2');
      let dataHighCo2 = await this.abilityRayongService.listEthanePlanningDataByProductPlant(index, 'High CO2');

      if(dataLowCo2){
        dataList.push(dataLowCo2);
      } else {
        if (index === dateStart) {
          const lastDate = moment(index).add(-1, 'M');
          const endDate = moment(index).add(-12, 'M');
          dataLowCo2 = await this.abilityRayongService.getEthanePlanningLastMonth(lastDate, endDate, 'Low CO2')
        } else {
          let dataBefore = moment(index).add(-1, 'M');
          let dataBeforeYear = dataBefore.year();
          let dataBeforeMonth = dataBefore.month() + 1;

          dataLowCo2 = _.filter(dataList, (item) => { 
            return item.yearValue === dataBeforeYear && 
            item.monthValue === dataBeforeMonth &&
            item.productionPlant === 'Low CO2'
          });
        }
        dataLowCo2.forEach(item => { 
          let dataObj: any = _.cloneDeep(item);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        })
      }

      if(dataHighCo2){
        dataList.push(dataHighCo2);
      } else {
        if (index === dateStart) {
          const lastDate = moment(index).add(-1, 'M');
          const endDate = moment(index).add(-12, 'M');
          dataHighCo2 = await this.abilityRayongService.getEthanePlanningLastMonth(lastDate, endDate, 'High CO2')
        } else {
          let dataBefore = moment(index).add(-1, 'M');
          dataHighCo2 = _.filter(dataList, (item) => { 
            return item.yearValue === dataBefore.year() && 
            item.monthValue === dataBefore.month() + 1 &&
            item.productionPlant === 'High CO2'
          });
        }
        dataHighCo2.forEach(item => { 
          let dataObj: any = _.cloneDeep(item);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        })
      }
    }  

    dataList = dataList.map(data => {
      const dataReport = new EthanePlanningDto();
      Object.assign(dataReport, data);
        return dataReport;
    })

    return dataList;
  }

  async listDailyData(dateStart, estimateVersion): Promise<any> {
    let dataList: any = [];
    let dateEnd = moment(dateStart).add(3, 'M');
    
    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')){
      let dataIndexMonth = index.month() + 1;

      let data = await this.abilityRayongService.getEthanePlannigDaily(estimateVersion.year,
        estimateVersion.month, dataIndexMonth, estimateVersion.version
        );

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      }
    }  

    dataList = dataList.map(data => {
      const dataReport = new EthanePlanningDailyDto();
      Object.assign(dataReport, data);
        return dataReport;
    })

    return dataList;
  }


  async getEthaneData(year: Number, month: Number, yearValue: Number, monthValue: Number, version: Number): Promise<any> {
    let report : EthanePlanningDto[] = []; 

    const ethaneData = await this.abilityRayongService.getEthanePlanningData(year, month, yearValue, monthValue, version);

    report = ethaneData.map(data => {
      const dataReport = new EthanePlanningDto();
      Object.assign(dataReport, data);
        return dataReport;
    })

    return report;
  }
}
