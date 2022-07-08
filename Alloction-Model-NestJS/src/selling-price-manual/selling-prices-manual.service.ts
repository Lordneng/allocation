import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import moment from 'moment';
import { getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm';
import { SellingPricesManual, SellingPricesManualVersion } from './entity';
import { TOKENS } from '../constants';
import console = require('console');
@Injectable()
export class SellingPricesManualService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<SellingPricesManual>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<SellingPricesManualVersion>,
  ) {

  }

  async getList(params: any): Promise<any> {

    params.year = moment().year();
    params.month = moment().month() + 1

    return await (await this.dataModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        // version: 1
      }],
      order: {
        rowOrder: "ASC"
      }
    }))
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id })
  }

  async create(data: any) {

    if (data.length > 0) {
      await this.dataModel.delete({ year: data[0].year, month: data[0].month, version: data[0].version })
      return await this.dataModel.save(data);
    }

  }

  async update(data: any) {
    // // ('params', data);
    // return this.dataModel.save({ ...data, id: data.id });
    if (data.length > 0) {
      await this.dataModel.delete({ year: data[0].year, month: data[0].month, version: data[0].version })
      return await this.dataModel.save(data);
    }
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getMaxVersion(params: any) {
    return await this.dataVersionModel.findOne({ where: [{ year: params.year }], order: { version: 'DESC' } });
  }

  async getVersion(params: any): Promise<any> {
    return await this.dataVersionModel.find({ where: [{ year: params.year }], order: { updateDate: 'DESC' } });
  }

  async createVersion(data: any) {
    await this.dataVersionModel.update({ year: data.year, isApply: true }, { isApply: false, updateBy: data.updateBy })
    return await this.dataVersionModel.save(data);
  }

}

// import { Injectable, Inject } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as _ from 'lodash';
// import { getuid } from 'process';
// import * as mongoose from 'mongoose';
// import { SellingPricesManual } from './models/selling-prices-manual';
// import { SellingPricesManualVersion } from './models/selling-prices-manual-version';

// @Injectable()
// export class SellingPricesManualService {

//   constructor(@InjectModel('SellingPricesManual') private readonly dataModel: Model<SellingPricesManual>,
//     @InjectModel('SellingPricesManualVersion') private readonly dataVersionModel: Model<SellingPricesManualVersion>) {

//   }

//   async getList(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataModel.find({ year: _.toInteger(params.year) }).sort({ rowOrder: 1 }).exec();
//   }
//   async getOne(id: any): Promise<any> {
//     return await this.dataModel.findOne({ "_id": id }).exec();
//   }

//   async create(data: any) {
//     _.each(data, (item) => {
//       item._id = mongoose.Types.ObjectId()
//       item.createDate = new Date();
//       item.updateDate = new Date();
//     })
//     return await this.dataModel.insertMany(data);
//   }

//   async update(data: any) {
//     data._id = mongoose.Types.ObjectId()
//     data.createDate = new Date();
//     data.updateDate = new Date();
//     const dataSave = new this.dataVersionModel(data);
//     return await dataSave.save();
//   }

//   async delete(id: any) {
//     return await this.dataModel.deleteOne({ _id: id });
//   }

// }
