import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { EntityManager, In, LessThan, MoreThan, Repository, Transaction, TransactionRepository, getConnection } from 'typeorm';
import { TOKENS } from '../constants';
import moment from 'moment';
import {
  VolumeConstrain,
  VolumeConstrainForm,
  VolumeConstrainVersion,
} from './entity';
@Injectable()
export class VolumeConstrainService {
  constructor(
    @Inject(TOKENS.ProjectRepositoryToken)
    private readonly dataModel: Repository<VolumeConstrain>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion)
    private readonly dataVersionModel: Repository<VolumeConstrainVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenForm)
    private readonly dataFormModel: Repository<VolumeConstrainForm>,
  ) { }

  async getList(params: any): Promise<any> {
    let listMonth: any = [];
    let dateStart = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    // dateStart = dateStart.add(1, 'M'); //เดือนถัดไป
    let dateEnd = moment(dateStart).add(12, 'M'); //เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd, params);
    return data;
  }

  async getListCstrains(params: any): Promise<any> {
    let dateStart = moment(
      params.year + '-' + _.padStart(params.month, 2, '0') + '-01',
    );
    dateStart = dateStart.add(1, 'M'); //เดือนถัดไป
    let dateEnd = moment(dateStart).add(12, 'M'); //เดือนปัจจุบันในปีถัดไป

    let data = await this.listData(dateStart, dateEnd, params);
    if (data && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let objDate = moment(element.yearValue + '-' + _.padStart(element.monthValue, 2, '0') + '-01');
        if (element.isCalculate === true) {
          element.min = (element.min * 24 * objDate.daysInMonth()) / 1000;
          element.max = (element.max * 24 * objDate.daysInMonth()) / 1000;
        }
        if (element.isNullMin === true) {
          element.min = null;
        }
        if (element.isNullMax === true) {
          element.max = null;
        }
      }
    }
    return data;
  }
  async listData(dateStart, dateEnd, params): Promise<any> {
    let dataList: any = [];

    for (
      let index = dateStart;
      index <= dateEnd;
      index = moment(index).add(1, 'M')
    ) {
      let data = await this.dataModel.find({
        where: { monthValue: index.month() + 1, yearValue: index.year(), version: params.version, year: params.year, month: params.month },
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
          data = await this.getForm(params);
          
        }



        if (data && data.length > 0) {
          data.forEach((item) => {
            let dataObj: any = _.cloneDeep(item);
            dataObj.yearValue = index.year();
            dataObj.monthValue = index.month() + 1;
            dataObj.dayValue = dataObj.dayValue ? dataObj.dayValue : index.daysInMonth()
            dataList.push(dataObj);
          });
        }
      }
    }

    return dataList;
  }

  async getListHistory(params: any): Promise<any> {
    // let listMonth: any = [];
    // let dateStart = moment(params.year + '-' + params.month + '-01');
    // dateStart = dateStart.add(1, 'M');
    // let monthStart = dateStart.month() + 1;
    // let yearStart = dateStart.year();
    // for (let index = 1; index < 13; index++) {
    //   listMonth.push({ year: yearStart, month: monthStart });
    //   dateStart = dateStart.add(1, 'M');
    //   monthStart = dateStart.month() + 1;
    //   yearStart = dateStart.year();
    // }

    // const yearArray = _.uniqBy(listMonth, 'year');

    // let dataList: any = []
    // for (let index = 0; index < yearArray.length; index++) {
    //   const element = yearArray[index];
    //   const dataMonth = _.filter(listMonth, (item) => {
    //     return item.year === element.year
    //   })
    //   const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
    //   const data = await this.dataHistoryModel.find({ month: { $in: monthArray }, year: element.year, version: params.version }).exec();
    //   dataList = _.concat(dataList, data)
    // }
    // return await this.dataModelHistory.find({ version: params.version });
  }
  async create(data: any) {
    const yearArray = _.uniqBy(data, 'year');

    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(data, item => {
        return item.year === element.year;
      });
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      await this.dataModel.delete({
        month: In(monthArray),
        year: element.year,
      });
    }

    // this.dataModelHistory.save(data, { chunk: 100 });
    return await this.dataModel.save(data, { chunk: 50 });
  }

  async saveTransections(volumeConstrainData?: VolumeConstrain[], volumeConstrainVersionData?: VolumeConstrainVersion, volumeConstrainFormData?: VolumeConstrainForm[]) {

    await getConnection().transaction(async transactionalEntityManager => {

      // volumn constrain
      const yearArray = _.uniqBy(volumeConstrainData, 'year');
      let dataForCheckVersion: any = [];

      for (let index = 0; index < yearArray.length; index++) {
        const element = yearArray[index];
        const dataMonth = _.filter(volumeConstrainData, (item) => {
          return item.year === element.year
        })
        const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
        dataForCheckVersion = await transactionalEntityManager.findOne(VolumeConstrain, { month: In(monthArray), year: element.year, version: element.version });
        if (dataForCheckVersion) {
          await transactionalEntityManager.delete(VolumeConstrain, { month: In(monthArray), year: element.year, version: element.version });
        }
      }

      let volumeConstrainArr;
      const volumeConstrainSave: VolumeConstrain[] = [];

      for (const item of volumeConstrainData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        volumeConstrainArr = new VolumeConstrain();
        Object.assign(volumeConstrainArr, item);
        volumeConstrainSave.push(volumeConstrainArr);

      }

      //  volumn constrain version
      let volumeConstrainVersionArr;
      const volumeConstrainVersionSave: VolumeConstrainVersion[] = [];

      volumeConstrainVersionData.createDate = volumeConstrainVersionData.createDate ? volumeConstrainVersionData.createDate : new Date();
      volumeConstrainVersionData.updateDate = new Date();

      volumeConstrainVersionArr = new VolumeConstrainVersion();
      Object.assign(volumeConstrainVersionArr, volumeConstrainVersionData);
      volumeConstrainVersionSave.push(volumeConstrainVersionArr);

      //  volumn constrain form
      let volumeConstrainFormArr;
      const volumeConstrainFormSave: VolumeConstrainForm[] = [];

      for (const item of volumeConstrainFormData) {
        item.createDate = item.createDate ? item.createDate : new Date();
        item.updateDate = new Date();

        volumeConstrainFormArr = new VolumeConstrainForm();
        Object.assign(volumeConstrainFormArr, item);
        volumeConstrainFormSave.push(volumeConstrainFormArr);
      }
      if (volumeConstrainFormData.length > 0) {
        await transactionalEntityManager.delete(VolumeConstrainForm, { year: volumeConstrainFormData[0].year });
      }


      await transactionalEntityManager.save(volumeConstrainSave, { chunk: 50 });
      await transactionalEntityManager.save(volumeConstrainVersionSave, { chunk: 50 });
      await transactionalEntityManager.save(volumeConstrainFormSave, { chunk: 50 });

    });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getForm(params: any): Promise<any> {
    return await this.dataFormModel.find({ where: [{ year: params.year }], order: { updateDate: 'DESC' }, });
  }

  // async getFormHistory(params: any): Promise<any> {
  //   return await this.dataFormModelHistory.find({
  //     where: [{ version: params.version }],
  //     order: { updateDate: 'DESC' },
  //   });
  // }

  async createForm(data: any) {
    await this.dataFormModel.delete({});
    // this.dataFormModelHistory.save(data, { chunk: 100 });
    return await this.dataFormModel.save(data, { chunk: 50 });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };
    return await this.dataVersionModel.find({ where: [dataWhere], order: { updateDate: 'DESC' } });
  }
  async createVersion(data: any) {
    this.dataVersionModel.delete({});
    return await this.dataVersionModel.save(data, { chunk: 50 });
  }

  async getMonthMaxVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year, month: params.month };

    return await this.dataVersionModel.find({ where: [dataWhere], order: { version: 'DESC' } });
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
