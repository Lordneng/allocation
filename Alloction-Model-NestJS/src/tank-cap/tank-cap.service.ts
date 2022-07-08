import * as _ from 'lodash';
import {
  TankCapForm,
  TankCap,
  TankCapVersion,
  TankCapHistory,
  TankCapFormHistory,
} from './entity';
import { TOKENS } from '../constants';
import { Inject, Injectable } from '@nestjs/common';
import {
  getConnection,
  In,
  MoreThan,
  Repository,
  Transaction,
  TransactionRepository,
} from 'typeorm';
import moment from 'moment';

@Injectable()
export class TankCapService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModel: Repository<TankCap>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory)
    private readonly dataModelHistory: Repository<TankCapHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenForm)
    private readonly dataFormModel: Repository<TankCapForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory)
    private readonly dataFormModelHistory: Repository<TankCapFormHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion)
    private readonly dataVersionModel: Repository<TankCapVersion>,
  ) { }

  async getList(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    let dateEnd = moment(dateStart).add(13, 'M');

    return await this.listData(dateStart, dateEnd, params.version);
  }

  async getListToCalMargin(params: any): Promise<any> {
    let dateStart = moment(params.year + '-01-01');
    let dateEnd = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    dateEnd = moment(dateEnd).add(1, 'y');

    return await this.listData(dateStart, dateEnd, params.version);
  }

  async getListAbility(params: any): Promise<any> {
    let dateStart = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    dateStart = dateStart.add(1, 'M'); //เดือนถัดไป
    let dateEnd = moment(dateStart).add(11, 'M'); //เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd, params.version);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.isCalculate === true) {
          element.value = (element.value * 24 * element.dayValue) / 1000;
        }
      }
    }
    return data;
  }
  async getListToModel(params: any): Promise<any> {
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0') + '-01');
    dateStart = moment(dateStart).add(1, 'M');
    let dateEnd = moment(dateStart).add(13, 'M');

    return await this.listData(dateStart, dateEnd, params.version);
  }
  async listData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (
      let index = dateStart;
      index < dateEnd;
      index = moment(index).add(1, 'M')
    ) {
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), year: params.year, month: params.month, version: params.version },
        order: { version: 'DESC' },
      });

      if (data && data.length > 0) {
        data.forEach((item) => {
          dataList.push(item);
        });
      } else {
        let dataVersion = await this.dataModel.findOne({ where: { monthValue: index.month() + 1, yearValue: index.year() }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })

        if (dataVersion) {
          data = await this.dataModel.find({ where: { monthValue: index.month() + 1, yearValue: index.year(), month: dataVersion.month, year: dataVersion.year, version: dataVersion.version }, order: { year: 'DESC', month: 'DESC', version: 'DESC' } })
        }
        else {
          data = await this.getLastMonth(moment(index).add(-1, 'M'), 1)
        }

        if (data && data.length > 0) {
          data.forEach((item) => {
            let dataObj: any = _.cloneDeep(item);
            dataObj.yearValue = index.year();
            dataObj.monthValue = index.month() + 1;
            dataList.push(dataObj);
          });
        }
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
    return await this.dataModelHistory.find({
      version: params.version,
      month: params.month,
      year: params.year,
    });
  }

  async getForm(params: any): Promise<any> {
    return await await this.dataFormModel.find({
      where: [
        {
          year: _.toInteger(params.year),
          month: _.toInteger(params.month),
          version: _.toInteger(params.version),
        },
      ],
      order: {
        rowOrder: 'ASC',
      },
    });
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ id: id });
  }

  @Transaction()
  async create(@TransactionRepository(TankCap) manager: Repository<TankCap>, data?: any) {
    return await manager.save(data);
  }

  async saveTransections(legalData?: TankCap[], legalFormData?: TankCapHistory[], legalVersionData?: TankCapVersion[]) {

    await getConnection().transaction(async transactionalEntityManager => {

      // Tank Cap //
      const yearArray = _.uniqBy(legalData, 'year');
      let dataForCheckVersion: any = [];

      for (let index = 0; index < yearArray.length; index++) {
        const element = yearArray[index];
        const dataMonth = _.filter(legalData, (item) => {
          return item.year === element.year
        })
        const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
        dataForCheckVersion = await transactionalEntityManager.findOne(TankCap, { month: In(monthArray), year: element.year, version: MoreThan(element.version) });
        if (!dataForCheckVersion) {
          await transactionalEntityManager.delete(TankCap, { month: In(monthArray), year: element.year });
        }
      }

      let TankCapArr;
      let TankCapHistoryArr;

      const TankCapSave: TankCap[] = [];
      const TankCapHistorySave: TankCapHistory[] = [];

      for (const item of legalData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        TankCapArr = new TankCap();
        Object.assign(TankCapArr, item);
        TankCapSave.push(TankCapArr);

        TankCapHistoryArr = new TankCapHistory();
        Object.assign(TankCapHistoryArr, item);
        TankCapHistorySave.push(TankCapHistoryArr);
      }

      await transactionalEntityManager.delete(TankCapHistory, { month: legalData[0].month, year: legalData[0].year, version: legalData[0].version });

      // lr by legal form //
      let TankCapFormArr;
      let TankCapFormHistoryArr;

      const TankCapFormSave: TankCapForm[] = [];
      const TankCapFormHistorySave: TankCapFormHistory[] = [];

      for (const item of legalFormData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        TankCapFormArr = new TankCapForm();
        Object.assign(TankCapFormArr, item);
        TankCapFormSave.push(TankCapFormArr);

        TankCapFormHistoryArr = new TankCapFormHistory();
        Object.assign(TankCapFormHistoryArr, item);
        TankCapFormHistorySave.push(TankCapFormHistoryArr);
      }

      await transactionalEntityManager.delete(TankCapForm, { year: legalFormData[0].year });
      await transactionalEntityManager.delete(TankCapFormHistory, { month: legalFormData[0].month, year: legalFormData[0].year, version: legalFormData[0].version });

      // Tank Cap version //
      let TankCapVersionArr;
      const TankCapVersionSave: TankCapVersion[] = [];

      for (const item of legalVersionData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        TankCapVersionArr = new TankCapVersion();
        Object.assign(TankCapVersionArr, item);
        TankCapVersionSave.push(TankCapVersionArr);

      }

      await transactionalEntityManager.save(TankCapSave);
      await transactionalEntityManager.save(TankCapHistorySave);
      await transactionalEntityManager.save(TankCapFormSave);
      await transactionalEntityManager.save(TankCapFormHistorySave);
      await transactionalEntityManager.save(TankCapVersionSave);
    });
  }

  async save(data: any) {
    // await getConnection().transaction(async (transactionalEntityManager) => {

    //   let dataSave = await transactionalEntityManager.findOne(TankCap, { id: data.id });

    //   if (dataSave) {
    //     dataSave.rowOrder = dataSave.rowOrder;
    //     dataSave.product = data.productCode;
    //     dataSave.productionPlant = data.productionPlant;
    //     dataSave.unit = data.unit;
    //     dataSave.activeStatus = data.activeStatus;
    //     dataSave.remark = data.remark;
    //     dataSave.createBy = data.createBy;
    //     dataSave.updateBy = data.updateBy;
    //   } else {
    //     dataSave = new TankCap();
    //     Object.assign(dataSave, data);
    //   }

    const yearArray = _.uniqBy(data, 'yearValue');

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, (item) => {
        return item.yearValue === element.yearValue;
      });
      const monthArray = _.map(
        _.uniqBy(dataMonth, 'monthValue'),
        'monthValue',
      );
      await this.dataModel.delete({
        monthValue: In(monthArray),
        yearValue: element.yearValue,
      });
    }
    if (data && data.length > 0) {
      await this.dataModelHistory.delete({
        month: _.toInteger(data[0].month),
        year: _.toInteger(data[0].year),
        version: data[0].version,
      });
    }

    this.dataModelHistory.save(data, { chunk: 100 });
    return await this.dataModel.save(data, { chunk: 100 });

    //   await transactionalEntityManager.save(dataSave);

    // });
  }

  async SaveForm(data: any) {
    await this.dataFormModel.delete({});
    this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 100 });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = {
      year: params.year,
      month: _.toInteger(params.month),
    };

    // if (params.isApply && params.isApply === true) {
    //   dataWhere.isApply = true;
    // }

    return await this.dataVersionModel.find({
      where: [dataWhere],
      order: { month: 'DESC', version: 'DESC' },
    });
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = {
      year: params.year,
      month: params.month,
      isApply: true,
    };

    return await this.dataVersionModel.find({
      where: [dataWhere],
      order: { version: 'DESC' },
    });
  }

  async saveVersion(data: any) {
    await this.dataVersionModel.update(
      { year: data[0].year, month: data[0].month, isApply: true },
      { isApply: false, updateBy: data[0].updateBy },
    );

    return await this.dataVersionModel.save(data);
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ year: params.year }],
      order: { version: 'DESC' },
    });
  }

  async getMaxYear() {
    return await this.dataModel.findOne({
      where: [{}],
      order: { yearValue: 'DESC' },
    });
  }

  async getMaxMonthByYear(year: any) {
    return await this.dataModel.findOne({
      where: [{ yearValue: year }],
      order: { monthValue: 'DESC' },
    });
  }
  async getVersionByYear(params: any): Promise<any> {
    return await this.dataVersionModel.find({ where: [params], order: { month: 'DESC', version: 'DESC' } });
  }
  async getVersionById(params: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: params.versionId }]
    });
  }

  async getVersionById2(id: any) {
    return await this.dataVersionModel.findOne({
      where: [{ id: id }]
    });
  }
}
