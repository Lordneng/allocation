import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository, Transaction, TransactionRepository } from 'typeorm';
import { VolumeConstrainMeter, VolumeConstrainMeterForm, VolumeConstrainMeterFormHistory, VolumeConstrainMeterHistory, VolumeConstrainMeterVersion } from './entity';
import { TOKENS } from '../constants';
import moment from 'moment';
@Injectable()
export class VolumeConstrainMeterService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<VolumeConstrainMeter>,
    @Inject(TOKENS.ProjectRepositoryTokenHistory) private readonly dataModelHistory: Repository<VolumeConstrainMeterHistory>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<VolumeConstrainMeterVersion>,
    @Inject(TOKENS.ProjectRepositoryTokenForm) private readonly dataFormModel: Repository<VolumeConstrainMeterForm>,
    @Inject(TOKENS.ProjectRepositoryTokenFormHistory) private readonly dataFormModelHistory: Repository<VolumeConstrainMeterFormHistory>,
  ) {

  }

  async getList(params: any): Promise<any> {
    let listMonth: any = [];
    let dateStart = moment(params.year + '-' + _.padStart(params.month, 2, '0')  + '-01');
    dateStart = dateStart.add(1, 'M');
    let monthStart = dateStart.month() + 1;
    let yearStart = dateStart.year();
    for (let index = 1; index < 13; index++) {
      listMonth.push({ year: yearStart, month: monthStart });
      dateStart = dateStart.add(1, 'M');
      monthStart = dateStart.month() + 1;
      yearStart = dateStart.year();
    }

    const yearArray = _.uniqBy(listMonth, 'year');

    let dataList: any = []
    for (let index = 0; index < yearArray.length; index++) {
      const element = yearArray[index];
      const dataMonth = _.filter(listMonth, (item) => {
        return item.year === element.year
      })
      const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
      const data = await this.dataModel.find({ month: In(monthArray), year: element.year });
      dataList = _.concat(dataList, data)
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
    return await this.dataModelHistory.find({ version: params.version });
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
    // // ('params', params);
    return await this.dataFormModel.find({ order: { updateDate: 'DESC' } });
  }
  async getFormHistory(params: any): Promise<any> {
    // // ('params', params);
    return await this.dataFormModelHistory.find({ where: [{ version: params.version }], order: { updateDate: 'DESC' } });
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
    // // ('params', params);
    return await this.dataVersionModel.find({ order: { updateDate: 'DESC' } });
  }
  async createVersion(data: any) {
    data.createDate = new Date();
    data.updateDate = new Date();
    return await this.dataVersionModel.save(data, { chunk: 100 });
  }

}
// import { Injectable, Inject } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as mongoose from 'mongoose';
// import { VolumeConstrainMeter } from './models/volume-constrain-meter';
// import { VolumeConstrainMeterForm } from './models/volume-constrain-meter-form';
// import { VolumeConstrainMeterVersion } from './models/volume-constrain-meter-version';
// @Injectable()
// export class VolumeConstrainMeterService {

//   constructor(@InjectModel('VolumeConstrainMeter') private readonly dataModel: Model<VolumeConstrainMeter>,
//     @InjectModel('VolumeConstrainMeterHistory') private readonly dataHistoryModel: Model<VolumeConstrainMeter>,
//     @InjectModel('VolumeConstrainMeterVersion') private readonly dataVersionModel: Model<VolumeConstrainMeterVersion>,
//     @InjectModel('VolumeConstrainMeterForm') private readonly dataFormModel: Model<VolumeConstrainMeterForm>,
//     @InjectModel('VolumeConstrainMeterFormHistory') private readonly dataFormHistoryModel: Model<VolumeConstrainMeterForm>,) {

//   }

//   async getList(params: any): Promise<any> {
//     let listMonth: any = [];
//     let dateStart = moment(params.year + '-' + params.month + '-01');
//     dateStart = dateStart.add(1, 'M');
//     let monthStart = dateStart.month() + 1;
//     let yearStart = dateStart.year();
//     for (let index = 1; index < 13; index++) {
//       listMonth.push({ year: yearStart, month: monthStart });
//       dateStart = dateStart.add(1, 'M');
//       monthStart = dateStart.month() + 1;
//       yearStart = dateStart.year();
//     }

//     const yearArray = _.uniqBy(listMonth, 'year');

//     let dataList: any = []
//     for (let index = 0; index < yearArray.length; index++) {
//       const element = yearArray[index];
//       const dataMonth = _.filter(listMonth, (item) => {
//         return item.year === element.year
//       })
//       const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
//       const data = await this.dataModel.find({ month: { $in: monthArray }, year: element.year }).exec();
//       dataList = _.concat(dataList, data)
//     }
//     return dataList;
//   }
//   async getListHistory(params: any): Promise<any> {
//     // let listMonth: any = [];
//     // let dateStart = moment(params.year + '-' + params.month + '-01');
//     // dateStart = dateStart.add(1, 'M');
//     // let monthStart = dateStart.month() + 1;
//     // let yearStart = dateStart.year();
//     // for (let index = 1; index < 13; index++) {
//     //   listMonth.push({ year: yearStart, month: monthStart });
//     //   dateStart = dateStart.add(1, 'M');
//     //   monthStart = dateStart.month() + 1;
//     //   yearStart = dateStart.year();
//     // }

//     // const yearArray = _.uniqBy(listMonth, 'year');

//     // let dataList: any = []
//     // for (let index = 0; index < yearArray.length; index++) {
//     //   const element = yearArray[index];
//     //   const dataMonth = _.filter(listMonth, (item) => {
//     //     return item.year === element.year
//     //   })
//     //   const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
//     //   const data = await this.dataHistoryModel.find({ month: { $in: monthArray }, year: element.year, version: params.version }).exec();
//     //   dataList = _.concat(dataList, data)
//     // }
//     return await this.dataHistoryModel.find({ version: params.version }).exec();
//   }
//   async create(data: any) {

//     const yearArray = _.uniqBy(data, 'year');


//     for (let index = 0; index < yearArray.length; index++) {
//       const element = yearArray[index];
//       const dataMonth = _.filter(data, (item) => {
//         return item.year === element.year
//       })
//       const monthArray = _.map(_.uniqBy(dataMonth, 'month'), 'month');
//       await this.dataModel.deleteMany({ month: { $in: monthArray }, year: element.year })
//     }

//     _.each(data, (item) => {
//       item._id = mongoose.Types.ObjectId()
//       item.createDate = item.createDate ? item.createDate : new Date();
//       item.updateDate = new Date();
//     })
//     await this.dataHistoryModel.insertMany(data);
//     return await this.dataModel.insertMany(data);
//   }

//   async delete(id: any) {
//     return await this.dataModel.deleteOne({ _id: id });
//   }

//   async getForm(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataFormModel.find({}).sort({ updateDate: -1 }).exec();
//   }
//   async getFormHistory(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataFormHistoryModel.find({ version: params.version }).sort({ updateDate: -1 }).exec();
//   }
//   async createForm(data: any) {
//     await this.dataFormModel.deleteMany()
//     _.each(data, (item) => {
//       item._id = mongoose.Types.ObjectId()
//       item.createDate = new Date();
//       item.updateDate = new Date();
//     })
//     await this.dataFormHistoryModel.insertMany(data);
//     return await this.dataFormModel.insertMany(data);
//   }

//   async getVersion(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataVersionModel.find({}).sort({ updateDate: -1 }).exec();
//   }
//   async createVersion(data: any) {
//     data._id = mongoose.Types.ObjectId()
//     data.createDate = new Date();
//     data.updateDate = new Date();
//     const dataSave = new this.dataVersionModel(data);
//     return await dataSave.save();
//   }

// }
