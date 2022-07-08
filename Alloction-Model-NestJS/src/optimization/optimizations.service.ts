import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getConnection, Repository } from 'typeorm'
import { TOKENS } from '../constants';
import moment from 'moment';
import {
  OptimizationC2,
  OptimizationC2Revision,
  OptimizationC3Lpg,
  OptimizationC3LpgRevision,
  OptimizationCo2,
  OptimizationCo2Revision,
  OptimizationNgl,
  OptimizationNglRevision,
  OptimizationPantane,
  OptimizationPantaneRevision,
  OptimizationVersion,
  OptimizationLrMonthly,
  OptimizationLrMonthlyRevision,
  OptimizationVolumn,
  OptimizationVolumnActual,
} from './entity';

@Injectable()
export class OptimizationsService {

  constructor(@Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataC2Model: Repository<OptimizationC2>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly dataC2RevisionModel: Repository<OptimizationC2Revision>,
    @Inject(TOKENS.ProjectRepositoryC3LpgToken) private readonly dataC3LpgModel: Repository<OptimizationC3Lpg>,
    @Inject(TOKENS.ProjectRepositoryC3LpgRevisionToken) private readonly dataC3LpgRevisionModel: Repository<OptimizationC3LpgRevision>,
    @Inject(TOKENS.ProjectRepositoryCo2Token) private readonly dataCo2Model: Repository<OptimizationCo2>,
    @Inject(TOKENS.ProjectRepositoryCo2RevisionToken) private readonly dataCo2RevisionModel: Repository<OptimizationCo2Revision>,
    @Inject(TOKENS.ProjectRepositoryNglToken) private readonly dataNglModel: Repository<OptimizationNgl>,
    @Inject(TOKENS.ProjectRepositoryNglRevisionToken) private readonly dataNglRevisionModel: Repository<OptimizationNglRevision>,
    @Inject(TOKENS.ProjectRepositoryPantaneToken) private readonly dataPantaneModel: Repository<OptimizationPantane>,
    @Inject(TOKENS.ProjectRepositoryPantaneRevisionToken) private readonly dataPantaneRevisionModel: Repository<OptimizationPantaneRevision>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<OptimizationVersion>,
    @Inject(TOKENS.ProjectRepositoryLrMonthlyToken) private readonly dataLrMonthlyModel: Repository<OptimizationLrMonthly>,
    @Inject(TOKENS.ProjectRepositoryVolumnToken) private readonly dataVolumnModel: Repository<OptimizationVolumn>,
    @Inject(TOKENS.ProjectRepositoryLrMonthlyRevisionToken) private readonly dataLrMonthlyRevisionModel: Repository<OptimizationLrMonthlyRevision>,
    @Inject(TOKENS.ProjectRepositoryOptimizationVolumnActualToken) private readonly dataActualModel: Repository<OptimizationVolumnActual>,
  ) {
  }

  async getList(params: any): Promise<any> {

    // let dateStart = moment(params.year + '-' + _.padStart(1, 2, '0') + '-01');
    // let dateEnd = moment(dateStart).add(11, 'M');

    // return await this.listData(dateStart, dateEnd);
    return await this.dataC2Model.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getC3LpgList(params: any): Promise<any> {
    return await this.dataC3LpgModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getCo2List(params: any): Promise<any> {
    return await this.dataCo2Model.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getNglList(params: any): Promise<any> {
    return await this.dataNglModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getPantaneList(params: any): Promise<any> {
    return await this.dataPantaneModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getLrMonthlyList(params: any): Promise<any> {
    return await this.dataLrMonthlyModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getVolumnList(params: any): Promise<any> {
    return await this.dataVolumnModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async listData(dateStart, dateEnd): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataC2Model.find({
        where: { monthValue: index.month() + 1, yearValue: index.year() },
        order: { version: 'DESC' }
      });

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      } else {
        if (index === dateStart) {
          const lastDate = moment(index).add(-1, 'M');
          const endDate = moment(index).add(-12, 'M');
          data = await this.getLastMonth(lastDate, endDate)
        } else {
          let dataBefore = moment(index).add(-1, 'M');
          data = _.filter(dataList, (item) => {
            return item.yearValue === dataBefore.year() && item.monthValue === dataBefore.month() + 1
          });
        }
        data.forEach(item => {
          let dataObj: any = _.cloneDeep(item);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        })
      }
    }

    return dataList;
  }

  async getLastMonth(lastMonth: any, endDate: any) {

    const data = await this.dataC2Model.find({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { version: 'DESC' }
    });

    if (data && data.length > 0) {
      return data;
    }

    if (lastMonth <= endDate) {
      return [];
    }

    lastMonth = moment(lastMonth).add(-1, 'M')

    return await this.getLastMonth(lastMonth, endDate)
  }

  async getCalList(params: any): Promise<any> {

    return await this.getCalRecursiveData(params);
  }

  async getDataCalList(params: any): Promise<any> {
    let dataResponse: any;

    dataResponse = await this.dataC2Model.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: _.toInteger(params.version)
      }],
      order: {
        rowOrder: "DESC"
      }
    });
    return dataResponse;
  }

  async getDataList(params: any) {

    let dataResponse: any;
    //// ('params Ref', params);
    // let version = _.toNumber(params.version)
    // if (version === 0) {
    //   const dataVsersion: any = await this.getMaxVersion(params)
    //   version = dataVsersion ? dataVsersion.version : 0
    // }

    dataResponse = await this.dataC2Model.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: 0
      }],
      order: {
        rowOrder: "DESC"
      }
    });
    return dataResponse;

  }

  async getManualDataList(params: any) {
    let dataResponse: any;


    dataResponse = await this.dataC2RevisionModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: _.toInteger(params.version)
      }],
      order: {
        rowOrder: "DESC"
      }
    });

    return dataResponse;

  }

  async getRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;
    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {

      if (indexYear < year) {
        startMonth = 13;
      }
      for (let indexMonth = startMonth; indexMonth >= 0; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;
        let data = await this.getDataCalList(params);
        if (data.length > 0) {
          if (indexYear < year) {
            _.each(data, (item) => {
              for (let idx = 1; idx <= 11; idx++) {
                item['M' + idx] = item['M12'];
              }
            })
          }
          return data;
        }
      }

    }
    return [];
  }

  async getCalRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;

    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {
      if (indexYear < year) {
        startMonth = 13;
      }
      for (let indexMonth = startMonth; indexMonth >= 0; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;

        let data = await this.getDataList(params);
        if (data.length > 0) {

          return data;
        }
      }

    }
    return [];
  }

  async getOne(id: any): Promise<any> {
    return await this.dataC2Model.findOne({ "id": id })
  }

  async save(data: any) {
    await getConnection().transaction(async transactionalEntityManager => {

      const year = _.toNumber(data?.optimizationVersion?.year);
      const month = _.toNumber(data?.optimizationVersion?.month);
      const version = _.toNumber(data?.optimizationVersion?.version);
      const isWithOutDemandAI = _.toNumber(data?.optimizationVersion?.isWithOutDemandAI);


      // if (data.OptimizationVersion) {
      await transactionalEntityManager.delete(OptimizationVersion, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationC2, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationC2Revision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationC3Lpg, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationC3LpgRevision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      // await transactionalEntityManager.delete(OptimizationCo2, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      // await transactionalEntityManager.delete(OptimizationCo2Revision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationNgl, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationNglRevision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      // await transactionalEntityManager.delete(OptimizationPantane, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      // await transactionalEntityManager.delete(OptimizationPantaneRevision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationLrMonthly, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationLrMonthlyRevision, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      await transactionalEntityManager.delete(OptimizationVolumn, { year: year, month: month, version: version, isWithOutDemandAI: isWithOutDemandAI });
      // }

      // insert data c2
      const optimizationC2Save: OptimizationC2[] = [];
      for (const item of data.optimizationC2) {
        const dataSave = new OptimizationC2();
        Object.assign(dataSave, item);
        optimizationC2Save.push(dataSave);
      }

      const optimizationC2RevisionSave: OptimizationC2Revision[] = [];
      for (const item of data.optimizationC2Revision) {
        const dataSave = new OptimizationC2Revision();
        Object.assign(dataSave, item);
        optimizationC2RevisionSave.push(dataSave);
      }

      // insert data c3 lpg
      const OptimizationC3LpgSave: OptimizationC3Lpg[] = [];
      for (const item of data.optimizationC3Lpg) {
        const dataSave = new OptimizationC3Lpg();
        Object.assign(dataSave, item);
        OptimizationC3LpgSave.push(dataSave);
      }

      const OptimizationC3LpgRevisionSave: OptimizationC3LpgRevision[] = [];
      for (const item of data.optimizationC3LpgRevision) {
        const dataSave = new OptimizationC3LpgRevision();
        Object.assign(dataSave, item);
        OptimizationC3LpgRevisionSave.push(dataSave);
      }

      // insert data co2
      // const optimizationCo2Save: OptimizationCo2[] = [];
      // for (const item of data.optimizationCo2) {
      //   const dataSave = new OptimizationCo2();
      //   Object.assign(dataSave, item);
      //   optimizationCo2Save.push(dataSave);
      // }

      // const optimizationCo2RevisionSave: OptimizationCo2Revision[] = [];
      // for (const item of data.optimizationCo2Revision) {
      //   const dataSave = new OptimizationCo2Revision();
      //   Object.assign(dataSave, item);
      //   optimizationCo2RevisionSave.push(dataSave);
      // }

      // insert data ngl
      const optimizationNglSave: OptimizationNgl[] = [];
      for (const item of data.optimizationNgl) {
        const dataSave = new OptimizationNgl();
        Object.assign(dataSave, item);
        optimizationNglSave.push(dataSave);
      }

      const optimizationNglRevisionSave: OptimizationNglRevision[] = [];
      for (const item of data.optimizationNglRevision) {
        const dataSave = new OptimizationNglRevision();
        Object.assign(dataSave, item);
        optimizationNglRevisionSave.push(dataSave);
      }

      // insert data pantane
      // const optimizationPantaneSave: OptimizationPantane[] = [];
      // for (const item of data.optimizationPantane) {
      //   const dataSave = new OptimizationPantane();
      //   Object.assign(dataSave, item);
      //   optimizationPantaneSave.push(dataSave);
      // }

      // const optimizationPantaneRevisionSave: OptimizationPantaneRevision[] = [];
      // for (const item of data.optimizationPantaneRevision) {
      //   const dataSave = new OptimizationPantaneRevision();
      //   Object.assign(dataSave, item);
      //   optimizationPantaneRevisionSave.push(dataSave);
      // }

      // insert data lr-monthly
      const optimizationLrMonthlySave: OptimizationLrMonthly[] = [];
      for (const item of data.optimizationLrMonthly) {
        const dataSave = new OptimizationLrMonthly();
        Object.assign(dataSave, item);
        optimizationLrMonthlySave.push(dataSave);
      }

      const optimizationLrMonthlyRevisionSave: OptimizationLrMonthlyRevision[] = [];
      for (const item of data.optimizationLrMonthlyRevision) {
        const dataSave = new OptimizationLrMonthlyRevision();
        Object.assign(dataSave, item);
        optimizationLrMonthlyRevisionSave.push(dataSave);
      }

      const optimizationVolumn: OptimizationVolumn[] = [];
      for (const item of data.optimizationVolumn) {
        const dataSave = new OptimizationVolumn();
        Object.assign(dataSave, item);
        optimizationVolumn.push(dataSave);
      }
      //  volumn constrain version
      const optimizationVersionSave: OptimizationVersion[] = [];
      let optimizationVersionObj = new OptimizationVersion();
      Object.assign(optimizationVersionObj, data.optimizationVersion);
      optimizationVersionSave.push(optimizationVersionObj);


      await transactionalEntityManager.save(optimizationC2Save, { chunk: 100 }); (-1)
      await transactionalEntityManager.save(optimizationC2RevisionSave, { chunk: 100 }); (0)
      await transactionalEntityManager.save(OptimizationC3LpgSave, { chunk: 50 }); (1)
      await transactionalEntityManager.save(OptimizationC3LpgRevisionSave, { chunk: 100 });

      // await transactionalEntityManager.save(optimizationCo2Save, { chunk: 100 });
      // await transactionalEntityManager.save(optimizationCo2RevisionSave, { chunk: 100 });
      await transactionalEntityManager.save(optimizationNglSave, { chunk: 100 });
      await transactionalEntityManager.save(optimizationNglRevisionSave, { chunk: 100 });
      // await transactionalEntityManager.save(optimizationPantaneSave, { chunk: 100 });
      // (2)
      // await transactionalEntityManager.save(optimizationPantaneRevisionSave, { chunk: 100 });
      await transactionalEntityManager.save(optimizationLrMonthlySave, { chunk: 100 });
      await transactionalEntityManager.save(optimizationLrMonthlyRevisionSave, { chunk: 100 });
      await transactionalEntityManager.save(optimizationVersionSave, { chunk: 100 });
      (3)
      await transactionalEntityManager.save(optimizationVolumn, { chunk: 50 });

    });
  }

  async delete(id: any) {
    return await this.dataC2Model.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { year: params.year, isWithOutDemandAI: params.isWithOutDemandAI };
    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMonthVersion(params: any): Promise<any> {

    if (params.month != -1) {
      let dataWhere: any = { year: params.year, month: params.month };
      // ('dataWhere getMonthVersion', dataWhere);
      return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
    }
    else {
      let dataWhere: any = { year: params.year };
      // ('dataWhere getMonthVersion', dataWhere);
      return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'ASC', version: 'DESC' } });
    }

  }

  async getVersionById(id: string): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { id: id };

    return await this.dataVersionModel.findOne({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month, isWithOutDemandAI: params.isWithOutDemandAI }], order: { version: 'DESC' } });
  }

  async getIsApplyVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month, isApply: true, isWithOutDemandAI: params.isWithOutDemandAI }], order: { version: 'DESC' } });
  }

  async getManual(params: any): Promise<any> {
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataC2RevisionModel.find({ where: [{ year: params.year, month: params.month, version: params.version, isWithOutDemandAI: params.isWithOutDemandAI }] });
  }

  async getC3LpgManual(params: any): Promise<any> {
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataC3LpgRevisionModel.find({ where: [{ year: params.year, month: params.month, version: params.version, isWithOutDemandAI: params.isWithOutDemandAI }] });
  }

  async getCo2Manual(params: any): Promise<any> {
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataCo2RevisionModel.find({ where: [{ year: params.year, month: params.month, version: params.version, isWithOutDemandAI: params.isWithOutDemandAI }] });
  }

  async getNglManual(params: any): Promise<any> {
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataNglRevisionModel.find({ where: [{ year: params.year, month: params.month, version: params.version, isWithOutDemandAI: params.isWithOutDemandAI }] });
  }

  async getPantaneManual(params: any): Promise<any> {
    if (_.toInteger(params.version) === -1) {
      const dataVsersion: any = await this.getIsApplyVersion(params)
      params.version = dataVsersion ? dataVsersion.version : 0
    }
    return await this.dataPantaneRevisionModel.find({ where: [{ year: params.year, month: params.month, version: params.version, isWithOutDemandAI: params.isWithOutDemandAI }] });
  }

  async getCostToCalMargin(params: any): Promise<any> {

    let dataList = await this.getList(params);
    let dataListManual = await this.getManual(params);

    if (dataList.length === 0) {
      if (params.month > 0) {
        params.month = params.month - 1;
        // this.getCostToCalMargin(params);
      }
    }
    else {

      dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
      dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

      _.each(dataList, (item, index) => {
        item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
        for (let index = 1; index < 13; index++) {
          item['isManualM' + index] = false;
          item['isEditM' + index] = false;
        }
        const dataManual = _.filter(dataListManual, (itemManual) => {
          return itemManual.product === item.referencePriceNameTo;
        })
        _.each(dataManual, (dataManualMonth) => {
          item['M' + dataManualMonth.valueMonth] = dataManualMonth.value;
          item['isManualM' + dataManualMonth.valueMonth] = true;
        })
      });

    }

    return dataList;
  }

  async getCostToCalMarginByVersion(params: any): Promise<any> {

    let dataList = await this.getCalList(params);
    let dataListManual = await this.getManual(params);

    if (dataList.length === 0) {
      if (params.month > 0) {
        params.month = params.month - 1;
        // this.getCostToCalMargin(params);
      }
    }
    else {

      dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
      dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

      _.each(dataList, (item, index) => {
        item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
        item['isManual'] = false;
        item['isEdit'] = false;

        const dataManual = _.find(dataListManual, (itemManual) => {
          return itemManual.product === item.referencePriceNameTo &&
            itemManual.yearValue === item.yearValue &&
            itemManual.monthValue === item.monthValue;
        })

        if (dataManual) {
          item.value = dataManual.value;
          item['isManual'] = true;
        }

      });

    }

    return dataList;
  }

  async getNextYear(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

    let dataList = await this.listNextYearData(dateStart, dateEnd);
    let dataListManual = await this.getManual(params);

    dataList = _.orderBy(dataList, ['rowOrder'], ['asc']);
    dataListManual = _.orderBy(dataListManual, ['rowOrder'], ['asc']);

    _.each(dataList, (item, index) => {
      item.rowOrder = item.rowOrder ? item.rowOrder : (index + 1)
      item['isManual'] = false;
      item['isEdit'] = false;

      const dataManual = _.find(dataListManual, (itemManual) => {
        return itemManual.product === item.referencePriceNameTo &&
          itemManual.yearValue === item.yearValue &&
          itemManual.monthValue === item.monthValue;
      })

      if (dataManual) {
        item.value = dataManual.value;
        item['isManual'] = true;
      }
    });

    return dataList;
  }

  async listNextYearData(dateStart, dateEnd): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataC2Model.find({
        where: { monthValue: index.month() + 1, yearValue: index.year() },
        order: { version: 'DESC' }
      });

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      } else {
        if (index === dateStart) {
          const lastDate = moment(index).add(-1, 'M');
          const endDate = moment(index).add(-12, 'M');
          data = await this.getLastMonth(lastDate, endDate)
        } else {
          let dataBefore = moment(index).add(-1, 'M');
          data = _.filter(dataList, (item) => {
            return item.yearValue === dataBefore.year() && item.monthValue === dataBefore.month() + 1
          });
        }
        data.forEach(item => {
          let dataObj: any = _.cloneDeep(item);
          dataObj.yearValue = index.year();
          dataObj.monthValue = index.month() + 1;
          dataList.push(dataObj);
        })
      }
    }

    return dataList;
  }

  async getNextLastMonth(lastMonth: any, endDate: any) {
    const data = await this.dataC2Model.find({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { version: 'DESC' }
    });

    if (data && data.length > 0) {
      return data;
    }

    if (lastMonth <= endDate) {
      return [];
    }

    lastMonth = moment(lastMonth).add(-1, 'M')

    return await this.getLastMonth(lastMonth, endDate)
  }

  async getC2Revision(params: any) {
    return await this.dataC2RevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getC3LpgRevision(params: any) {
    return await this.dataC3LpgRevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getCo2Revision(params: any) {
    return await this.dataCo2RevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getNglRevision(params: any) {
    return await this.dataNglRevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getPantaneRevision(params: any) {
    return await this.dataPantaneRevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getLrMonthlyRevision(params: any) {
    return await this.dataLrMonthlyRevisionModel.find({
      month: _.toNumber(params?.month),
      year: _.toNumber(params?.year),
      version: _.toNumber(params?.version),
      isWithOutDemandAI: params.isWithOutDemandAI
    });
  }

  async getDataToModel(params: any) {
    // const produuct = await this.masterProductsService.getList();
  }

  async getDataTotalSupplyToC3LpgReport(year: number, month: number, version: number, source: string, delivery: string, isReverse): Promise<any> {

    let stored: string = ''

    if (isReverse) {
      stored = 'SP_OPTIMIZATION_C3_LPG_REVERSE_REPORT_SEL'
    } else {
      stored = 'SP_OPTIMIZATION_C3_LPG_SPILT_REPORT_SEL'
    }

    return await this.dataC3LpgModel.query(`exec ${stored} @0, @1, @2, @3, @4`, [source, delivery, year, month, version])
  }

  async getDataLRDomesticToLpgReport(year: number, month: number, version: number, product: string): Promise<OptimizationLrMonthly[]> {
    return await this.dataLrMonthlyModel.find({
      where: {
        year: year,
        month: month,
        version: version,
        productionGroup: 'dataListMTBRP',
        production: product
      }
    })
  }

  async getDataLrTotalSupplyToC3LpgReport(year: number, month: number, version: number): Promise<OptimizationLrMonthly[]> {
    return await this.dataLrMonthlyModel.find({
      where: {
        year: year,
        month: month,
        version: version,
        production: 'Import Cargo to MT Port'
      }
    })
  }

  async getPretoDemandDataToC3LpgReport(year: number, month: number, version: number, customerType: string, source: string, delivery: string): Promise<OptimizationC3Lpg[]> {
    return await this.dataC3LpgModel.find({
      where: {
        year: year,
        month: month,
        version: version,
        source: source,

      }
    })
  }

  async getDomesticDataToC3LpgReport(year: number, month: number, version: number): Promise<OptimizationC3Lpg[]> {
    return await this.dataC3LpgModel.find({
      where: {
        year: year,
        month: month,
        version: version,
        customerType: 'Domestic',
        productionGroup: 'dataListDemand'
      }
    })
  }

  async getEndDataToC3LpgReport(year: number, month: number, version: number, production: string): Promise<OptimizationC3Lpg[]> {
    return await this.dataC3LpgModel.find({
      where: {
        year: year,
        month: month,
        version: version,
        production: production
      }
    })
  }

  async getActual(params: any): Promise<any> {
    // // ('params', params);
    let dataWhere: any = { yearValue: params.year };
    return await this.dataActualModel.find({ where: [dataWhere], order: { yearValue: 'DESC', monthValue: 'DESC' } });
  }
}
