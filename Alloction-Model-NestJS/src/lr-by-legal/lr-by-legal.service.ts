import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, LessThan, MoreThan, Repository, Transaction, TransactionRepository, getConnection } from 'typeorm';
import { LRByLegal, LRByLegalForm, LRByLegalFormHistory, LRByLegalHistory, LRByLegalVersion } from './entity';
import { TOKENS } from '../constants';
import moment from 'moment';
@Injectable()
export class LRByLegalService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<LRByLegal>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly dataModelHistory: Repository<LRByLegalHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<LRByLegalVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataFormModel: Repository<LRByLegalForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly dataFormModelHistory: Repository<LRByLegalFormHistory>,
  ) {

  }

  async getList(params: any): Promise<any> {

    // let dateStart = moment(params.year + '-' + params.month + '-01');
    // let dateEnd = moment(params.year + '-12-31');

    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

    return await this.listData(dateStart, dateEnd, params);

  }
  async getListToModel(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let dateEnd = moment(dateStart).add(13, 'M');

    return await this.listData(dateStart, dateEnd, params);
  }
  async listData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), year: params.year, month: params.month, version: params.version },
        order: { version: 'DESC' }
      });

      if (data && data.length > 0) {
        data.forEach(item => { dataList.push(item); })
      } else {
        let dataVersion = await this.dataModel.findOne({ where: { monthValue: index.month() + 1, yearValue: index.year() }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })

        if (dataVersion) {
          data = await this.dataModel.find({ where: { monthValue: index.month() + 1, yearValue: index.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })
        }
        else {
          data = await this.getLastMonth(moment(index).add(-1, 'M'), 1)
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


  async getLastMonth(lastMonth: any, index: any) {

    const dataVersion = await this.dataModel.findOne({
      where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year() },
      order: { year: 'DESC', month: 'DESC', version: 'DESC' }
    });
    if (dataVersion) {
      const data = await this.dataModel.find({
        where: { monthValue: lastMonth.month() + 1, yearValue: lastMonth.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version },
      });
      if (data && data.length > 0) {
        return data;
      }
    }

    if (index === 12) {
      return [];
    }

    index = index + 1;

    return this.getLastMonth(moment(lastMonth).add(-1, 'M'), index)
  }


  async getListHistory(params: any): Promise<any> {
    // return await this.dataModelHistory.find({ year: _.toInteger(params.year), month: _.toInteger(params.month), version: params.version });
    // ("params >> ", params);
    let version = _.toNumber(params.version)
    if (version < 0) {
      // ("ดึงย้อนหลัง");
      return await this.getRecursiveData(params);
    } else {
      // ("ดึงปกติ");
      return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
    }

  }

  async getRecursiveData(params: any) {
    let year = params.year;
    let month = params.month;
    let yearEnd = year - 2;
    let startMonth = month;
    for (let indexYear = year; indexYear >= yearEnd; indexYear--) {
      if (indexYear < year) {
        startMonth = 12;
      }
      for (let indexMonth = startMonth; indexMonth >= 0; indexMonth--) {
        params.year = indexYear;
        params.month = indexMonth;
        const dataVsersion: any = await this.getMaxVersion(params);
        if (dataVsersion) {
          params.version = dataVsersion.version;
          let data = await this.getHistoryData(params);

          if (data.length > 0) {
            let dateStart = moment(year + '-' + _.padStart(month, 2, '0') + '-01');
            let dateEnd = moment(dateStart).add(1, 'y');
            let dataArrayOld = [];
            for (let index = dateStart; index <= dateEnd; index = moment(index).add(1, 'M')) {
              const dataArray = _.filter(data, (item) => {
                return item.yearValue === index.year() && item.monthValue === index.month() + 1;
              })
              if (dataArray.length <= 0 && dataArrayOld.length > 0) {
                for (let addData = index; addData <= dateEnd; addData = moment(addData).add(1, 'M')) {
                  let dataAdd = _.cloneDeep(dataArrayOld);
                  _.each(dataAdd, (item) => {
                    item.monthValue = addData.month() + 1;
                    item.yearValue = addData.year();
                    // item.dayValue = addData.daysInMonth();
                  });
                  data = _.concat(data, dataAdd)
                  // ("ดึงย้อนหลัง data", addData);
                  // ("ดึงย้อนหลัง dateEnd", dateEnd);
                }
                return data;
              } else {
                dataArrayOld = _.cloneDeep(dataArray);
              }
            }
          }
        }

      }

    }
    return [];
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year, month: params.month }], order: { version: 'DESC' } });
  }

  async getHistoryData(params: any): Promise<any> {
    return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
  }

  async create(data: any) {

    const yearArray = _.uniqBy(data, 'year');
    let dataForCheckVersion: any = [];

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, (item) => {
        return item.year === element.year
      })
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      dataForCheckVersion = await this.dataModel.findOne({ month: In(monthArray), year: element.year, version: MoreThan(element.version) });
      if (!dataForCheckVersion) {
        await this.dataModel.delete({ month: In(monthArray), year: element.year });
      }
    }

    _.each(data, (item) => {
      item.createDate = item.createDate ? item.createDate : new Date();
      item.updateDate = new Date();
    })

    if (!dataForCheckVersion) {
      this.dataModelHistory.delete({ month: data[0].month, year: data[0].year, version: data[0].version })
      this.dataModelHistory.save(data, { chunk: 100 });
      return await this.dataModel.save(data, { chunk: 100 });
    }
    else {
      this.dataModelHistory.delete({ month: data[0].month, year: data[0].year, version: data[0].version })
      return await this.dataModelHistory.save(data, { chunk: 100 });
    }
  }


  async saveTransections(legalData?: LRByLegal[], legalFormData?: LRByLegalHistory[], legalVersionData?: LRByLegalVersion[]) {

    await getConnection().transaction(async transactionalEntityManager => {

      // lr by legal //
      const yearArray = _.uniqBy(legalData, 'year');
      let dataForCheckVersion: any = [];

      for (let index = 0; index < yearArray.length; index++) {
        const element = yearArray[index];
        const dataMonth = _.filter(legalData, (item) => {
          return item.year === element.year
        })
        const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
        dataForCheckVersion = await transactionalEntityManager.findOne(LRByLegal, { month: In(monthArray), year: element.year, version: MoreThan(element.version) });
        if (!dataForCheckVersion) {
          await transactionalEntityManager.delete(LRByLegal, { month: In(monthArray), year: element.year });
        }
      }

      let LRByLegalArr;
      let LRByLegalHistoryArr;

      const LRByLegalSave: LRByLegal[] = [];
      const LRByLegalHistorySave: LRByLegalHistory[] = [];

      for (const item of legalData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        LRByLegalArr = new LRByLegal();
        Object.assign(LRByLegalArr, item);
        LRByLegalSave.push(LRByLegalArr);

        LRByLegalHistoryArr = new LRByLegalHistory();
        Object.assign(LRByLegalHistoryArr, item);
        LRByLegalHistorySave.push(LRByLegalHistoryArr);
      }

      await transactionalEntityManager.delete(LRByLegalHistory, { month: legalData[0].month, year: legalData[0].year, version: legalData[0].version });

      // lr by legal form //
      let LRByLegalFormArr;
      let LRByLegalFormHistoryArr;

      const LRByLegalFormSave: LRByLegalForm[] = [];
      const LRByLegalFormHistorySave: LRByLegalFormHistory[] = [];

      for (const item of legalFormData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        LRByLegalFormArr = new LRByLegalForm();
        Object.assign(LRByLegalFormArr, item);
        LRByLegalFormSave.push(LRByLegalFormArr);

        LRByLegalFormHistoryArr = new LRByLegalFormHistory();
        Object.assign(LRByLegalFormHistoryArr, item);
        LRByLegalFormHistorySave.push(LRByLegalFormHistoryArr);
      }

      await transactionalEntityManager.delete(LRByLegalForm, { year: legalFormData[0].year });
      await transactionalEntityManager.delete(LRByLegalFormHistory, { month: legalFormData[0].month, year: legalFormData[0].year, version: legalFormData[0].version });

      // lr by legal version //
      let LRByLegalVersionArr;
      const LRByLegalVersionSave: LRByLegalVersion[] = [];

      for (const item of legalVersionData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        LRByLegalVersionArr = new LRByLegalVersion();
        Object.assign(LRByLegalVersionArr, item);
        LRByLegalVersionSave.push(LRByLegalVersionArr);

      }

      await transactionalEntityManager.save(LRByLegalSave);
      await transactionalEntityManager.save(LRByLegalHistorySave);
      await transactionalEntityManager.save(LRByLegalFormSave);
      await transactionalEntityManager.save(LRByLegalFormHistorySave);
      await transactionalEntityManager.save(LRByLegalVersionSave);
    });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getForm(params: any): Promise<any> {
    // // ('params', params);
    let dateStart = moment(params.year + '-01-01');
    let dateEnd = moment(params.year + '-12-31');

    let objYear: any = { yearStart: params.year, yearStop: (params.year - 3) };
    // return await this.listFormData(dateStart, dateEnd);
    return await this.listFormData(objYear);
  }

  async listFormData(data: any): Promise<any> {

    let dataList: any = [];
    for (let index = data.yearStart; index > data.yearStop; index--) {
      dataList = await this.dataFormModel.find({ where: [{ year: index }], order: { updateDate: 'DESC' } });
      if (dataList.length > 0) {
        return dataList;
      }
    }
    return dataList;
  }


  async getFormHistory(params: any): Promise<any> {
    // // ('params', params);
    return this.getForm(params);
    // return await this.dataFormModelHistory.find({ where: [{ year: _.toInteger(params.year), month: _.toInteger(params.month), version: params.version }], order: { updateDate: 'DESC' } });
  }
  async createForm(data: any) {
    await this.dataFormModel.delete({})
    _.each(data, (item) => {
      item.createDate = new Date();
      item.updateDate = new Date();
    })
    this.dataFormModelHistory.delete({ month: data[0].month, year: data[0].year, version: data[0].version })
    this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 100 });
  }

  async getVersion(params: any): Promise<any> {
    // // ('params', params);
    return await this.dataVersionModel.find({where: params, order: { updateDate: 'DESC' } });
  }
  async createVersion(data: any) {
    data.createDate = new Date();
    data.updateDate = new Date();
    return await this.dataVersionModel.save(data, { chunk: 100 });
  }

  async getVersionByYear(params: any): Promise<any> {
    return await this.dataVersionModel.find({ where: [params], order: { month: 'DESC', version: 'DESC' } });
  }

  async getVersionById(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: params.versionId }]
    });
  }

  async getVersionByIds(id: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: id }]
    });
  }
}