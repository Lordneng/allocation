
import * as _ from 'lodash';
import { M7DemandPlan, M7DemandPlanVersion, M7DemandValue, M7DemandValueManual } from './entity';
import { TOKENS } from '../constants';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { In, Repository, getConnection } from 'typeorm';
import moment from 'moment';
@Injectable()
export class M7DemandPlanService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<M7DemandPlan>,
    @Inject(TOKENS.ProjectRepositoryTokenManual) private readonly dataManualModel: Repository<M7DemandValueManual>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataValueModel: Repository<M7DemandValue>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<M7DemandPlanVersion>
  ) {

  }

  async getList(params: any): Promise<any> {
    let year = params.year;
    let month = params.month;
    let version = params.version;

    return await this.listData(year, month, version);
  }

  async getManualList(params: any): Promise<any> {
    let year = params.year;
    let month = params.month;
    let version = params.version;

    return await this.listManualData(year, month, version);
  }

  async getValueList(params: any): Promise<any> {
    let year = params.year;
    let month = params.month;
    let version = params.version;

    return await this.listValueData(year, month, version);
  }

  async listData(year, month, version): Promise<any> {
    let dataList: any = [];
    
    let data = await this.dataModel.find({
      where: { month: month, year: year, version: version }
    });

    if(data && data.length > 0){
      data.forEach(item => { dataList.push(item); })
    }  

    return dataList;
  }

  async listManualData(year, month, version): Promise<any> {
    let dataList: any = [];
    
    let data = await this.dataManualModel.find({
      where: { month: month, year: year, version: version }
    });

    if(data && data.length > 0){
      data.forEach(item => { dataList.push(item); })
    }  

    return dataList;
  }

  async listValueData(year, month, version): Promise<any> {
    let dataList: any = [];
    
    let data = await this.dataValueModel.find({
      where: { month: month, year: year, version: version }
    });

    if(data && data.length > 0){
      data.forEach(item => { dataList.push(item); })
    }  

    return dataList;
  }

  async getLastMonth (lastMonth: any, endDate: any) {

    const data = await this.dataModel.find({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { version: 'DESC' }
    });

    if(data && data.length > 0){
      return data;
    }

    if (lastMonth <= endDate){
      return [];
    }

    lastMonth = moment(lastMonth).add(-1, 'M')

    return await this.getLastMonth(lastMonth, endDate)
  }


  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month }], order: { version: 'DESC' } });
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id })
  }


  async saveTrans(data?: any, manuals?: any, values?: any, version?: any  ){
    await getConnection().transaction(async transactionalEntityManager => {
 
        const yearArray = _.uniqBy(data, 'yearValue');
        const manualYearArray = _.uniqBy(manuals, 'yearValue');
        const demandValueYearArray = _.uniqBy(values, 'yearValue');

        const dataVersion = new M7DemandPlanVersion();
        Object.assign(dataVersion, version);

        const saveDatas = data.map(data => {
        const m7demand = new M7DemandPlan();
        Object.assign(m7demand, data);
        return m7demand;
        });

        for (let index = 0; index < yearArray.length; index++) {
            const element = yearArray[index];
            const demandPlanMonth = _.filter(saveDatas, (item) => {
            return item.yearValue === element.yearValue
            });

            const demandPlanMonthArray = _.map(_.uniqBy(demandPlanMonth, 'monthValue'), 'monthValue');

            await transactionalEntityManager.delete(M7DemandPlan, { 
                monthValue: In(demandPlanMonthArray), 
                yearValue: element.yearValue,
                version: dataVersion.version
            })

        }

        const demanValueDatas = values.map(data => {
            const demandValue = new M7DemandValue();
            Object.assign(demandValue, data);
            return demandValue;
        });

        for (let index = 0; index < demandValueYearArray.length; index++) {
            const element = demandValueYearArray[index];
            const demandPlanValueMonth = _.filter(demanValueDatas, (item) => {
                return item.yearValue === element.yearValue
            });
            const demandPlanValueMonthArray = _.map(_.uniqBy(demandPlanValueMonth, 'monthValue'), 'monthValue');
    
            await transactionalEntityManager.delete(M7DemandValue, { 
                monthValue: In(demandPlanValueMonthArray), 
                yearValue: element.yearValue, 
                version: dataVersion.version
            })
        }

        const manualDatas = manuals.map(data => {
            const manual = new M7DemandValueManual();
            Object.assign(manual, data);
            return manual;
        });

        for (let index = 0; index < manualYearArray.length; index++) {
            const element = manualYearArray[index];
            const demandManualMonth = _.filter(manualDatas, (item) => {
                return item.yearValue === element.yearValue
            })
            const demandManualMonthArray = _.map(_.uniqBy(demandManualMonth, 'monthValue'), 'monthValue');

            await transactionalEntityManager.delete(M7DemandValueManual, { monthValue: In(demandManualMonthArray), yearValue: element.yearValue, 
                version: dataVersion.version
            })
        }

        await transactionalEntityManager.save(saveDatas, { chunk: 100 });

        await transactionalEntityManager.save(demanValueDatas, { chunk: 100 });

        await transactionalEntityManager.save(manualDatas, { chunk: 100 });

        await transactionalEntityManager.update(M7DemandPlanVersion,
        { year: _.toInteger(dataVersion.year), month: _.toInteger(dataVersion.month) }, 
        { updateBy: dataVersion.updateBy })

        await transactionalEntityManager.save(dataVersion);
    });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  checkDemandPlanEmpty(demandPlants: any) {
    const brpPttepValueEmpty = _.find(demandPlants, (item) => {
      return !item.brpPttepValue
    });

    if (brpPttepValueEmpty) {
      throw new HttpException('คก.บป. + ปตท.สผ. ห้ามว่าง', HttpStatus.NOT_FOUND);
    }

    const ptttankValueEmpty = _.find(demandPlants, (item) => {
        return !item.ptttankValue
    });

    if (ptttankValueEmpty) {
        throw new HttpException('PTT Tank ห้ามว่าง', HttpStatus.NOT_FOUND);
    }

    const mtPtttankRefineryValueEmpty = _.find(demandPlants, (item) => {
        return !item.mtPtttankRefineryValue
    });

    if (mtPtttankRefineryValueEmpty) {
        throw new HttpException('คก.ขบ. + GSP#4 + PTT Tank + Refinery ห้ามว่าง', HttpStatus.NOT_FOUND);
    }

    const propaneValueEmpty = _.find(demandPlants, (item) => {
        return !item.propaneValue
    });

    if (propaneValueEmpty) {
        throw new HttpException('propane ห้ามว่าง', HttpStatus.NOT_FOUND);
    }

    const importForExportValueEmpty = _.find(demandPlants, (item) => {
        return !item.importForExportValue
    });

    if (importForExportValueEmpty) {
        throw new HttpException('Import For Export ห้ามว่าง', HttpStatus.NOT_FOUND);
    }

    const spotOdorlessLpgValueEmpty = _.find(demandPlants, (item) => {
        return !item.spotOdorlessLpgValue
    });

    if (spotOdorlessLpgValueEmpty) {
        throw new HttpException('Aerosol PTTOR(Spot Odorless LPG) ห้ามว่าง', HttpStatus.NOT_FOUND);
    }
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year };

    if (params.isApply && params.isApply === true) {
      dataWhere.isApply = true;
    }

    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMonthVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };
    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async getVersionIsApply(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year,isApply:true }], order: { version: 'DESC' } });
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month, isApply: true };

    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async getMaxYear() {
    return await this.dataModel.findOne({ where: [{}], order: { yearValue: 'DESC' } });
  }

  async getMaxMonthByYear(year: any) {
    return await this.dataModel.findOne({ where: [{ yearValue: year }], order: { monthValue: 'DESC' } });
  }
}
