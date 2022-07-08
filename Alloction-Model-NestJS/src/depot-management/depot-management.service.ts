import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getConnection, In, Repository } from 'typeorm';
import { DepotManagementMeter, DepotManagementMeterForm, DepotManagementMeterFormHistory, DepotManagementMeterHistory, DepotManagementMeterVersion } from './entity';
import { TOKENS } from '../constants';
import moment from 'moment';
import console from 'console';

@Injectable()
export class DepotManagementMeterService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<DepotManagementMeter>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly dataModelHistory: Repository<DepotManagementMeterHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<DepotManagementMeterVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataFormModel: Repository<DepotManagementMeterForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly dataFormModelHistory: Repository<DepotManagementMeterFormHistory>,
  ) {

  }

  async getList(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(1, 'y');

    return await this.listData(dateStart, dateEnd, params);
  }

  async getListToModel(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let dateEnd = moment(dateStart).add(13, 'M');
    let data = await this.listData(dateStart, dateEnd, params.version);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.unitCode === 'Depot-Day') {
          element.min = element.min * element.dayValue;
          element.max = element.max * element.dayValue;
        }
      }
    }
    return data;
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

  async saveTrans(data: DepotManagementMeter[], form: DepotManagementMeterForm[], version: DepotManagementMeterVersion[]) {

    await getConnection().transaction(async manager => {
      const yearArray = _.uniqBy(data, 'yearValue');
      const historyData = data.map(data => {
        const history = new DepotManagementMeter();
        Object.assign(history, data);
        return history;
      })

      const historyFormData = form.map(form => {
        const historyForm = new DepotManagementMeterFormHistory();
        Object.assign(historyForm, form);
        return historyForm;
      })

      const dataSave = data.map(data => {
        const dpo = new DepotManagementMeter();
        Object.assign(dpo, data);
        return dpo;
      })

      const dataFormSave = form.map(form => {
        const dpo = new DepotManagementMeterForm();
        Object.assign(dpo, form);
        return dpo;
      })

      const dataVersion = version.map(data => {
        const version = new DepotManagementMeterVersion();
        Object.assign(version, data);
        return version;
      })

      for (let index = 0; index < yearArray.length; index++) {
        const element = yearArray[index];
        const dataMonth = _.filter(dataSave, (item) => {
          return item.yearValue === element.yearValue
        })
        const monthArray = _.map(_.uniqBy(dataMonth, 'monthValue'), 'monthValue');
        await manager.delete(DepotManagementMeter, { monthValue: In(monthArray), yearValue: element.yearValue })
      }

      if (historyData && historyData.length > 0) {
        await manager.delete(DepotManagementMeterHistory, {
          month: _.toInteger(historyData[0].month),
          year: _.toInteger(historyData[0].year),
          version: _.toInteger(historyData[0].version)
        })
      }

      if (dataFormSave && dataFormSave.length > 0) {
        await manager.delete(DepotManagementMeterForm, {
          month: _.toInteger(historyData[0].month),
          year: _.toInteger(historyData[0].year),
          version: _.toInteger(historyData[0].version)
        })
      }

      await manager.save(DepotManagementMeterFormHistory, historyFormData, { chunk: 100 });
      await manager.save(DepotManagementMeterForm, dataFormSave, { chunk: 100 });

      await manager.save(DepotManagementMeterHistory, historyData, { chunk: 100 });
      await manager.save(DepotManagementMeter, dataSave, { chunk: 100 });

      await manager.update(DepotManagementMeterVersion,
        { year: _.toInteger(dataVersion[0].year), month: _.toInteger(dataVersion[0].month) },
        { updateBy: dataVersion[0].updateBy, updateByUserId: dataVersion[0].updateByUserId })

      await manager.save(dataVersion);
    });
  }

  async getHistoryList(params: any): Promise<any> {
    let version = _.toNumber(params.version)
    if (version < 0) {

      // ("ดึงย้อนหลัง");
      return await this.getRecursiveData(params);
    } else {
      // ("ดึงปกติ");
      return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
    }

  }
  async getHistoryData(params: any): Promise<any> {
    return await this.dataModelHistory.find({ version: params.version, month: params.month, year: params.year });
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
                    item.dayValue = addData.daysInMonth();
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
  async create(data: any) {

    const yearArray = _.uniqBy(data, 'year');


    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, (item) => {
        return item.year === element.year
      })
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      await this.dataModel.delete({ month: In(monthArray), year: element.year })
    }

    _.each(data, (item) => {
      item.createDate = item.createDate ? item.createDate : new Date();
      item.updateDate = new Date();
    })
    this.dataModelHistory.save(data, { chunk: 100 });
    return await this.dataModel.save(data, { chunk: 100 });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getForm(params: any): Promise<any> {
    return await this.dataFormModel.find({
      where: [{ year: params.year, month: params.month, version: params.version }],
      order: { updateDate: 'DESC' }
    });
  }

  async getFormHistory(params: any): Promise<any> {
    return await this.dataFormModelHistory.find({
      where: [{ year: params.year, month: params.month, version: params.version }],
      order: { updateDate: 'DESC' }
    });
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };

    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
  }

  async createForm(data: any) {
    await this.dataFormModel.delete({})
    _.each(data, (item) => {
      item.createDate = new Date();
      item.updateDate = new Date();
    })
    this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 100 });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };
    // ('getVersion', dataWhere)
    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
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