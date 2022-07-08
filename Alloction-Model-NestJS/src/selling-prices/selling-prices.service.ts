import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getuid } from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm';
import { SellingPrice, SellingPriceVersion } from './entity';
import { TOKENS } from '../constants';
import console = require('console');
@Injectable()
export class SellingPricesService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<SellingPrice>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<SellingPriceVersion>,
  ) {

  }

  async getList(params: any): Promise<any> {
    return await this.dataModel.find();
  }

  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ "id": id })
  }

  @Transaction()
  async create(@TransactionRepository(SellingPrice) manager: Repository<SellingPrice>, data?: any) {
    return await manager.save(data);
  }

  async update(data: any) {
    // // ('params', data);
    return this.dataModel.save({ ...data, id: data.id });
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

  @Transaction()
  async createVersion(@TransactionRepository(SellingPriceVersion) manager: Repository<SellingPriceVersion>, data?: any) {
    return await manager.save(data);
  }

}

// import { Injectable, Inject } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as _ from 'lodash';

// import * as mongoose from 'mongoose';
// import { SellingPrice } from './models/selling-price';
// import { SellingPriceVersion } from './models/selling-price-version';
// @Injectable()
// export class SellingPricesService {

//   constructor(@InjectModel('SellingPrice') private readonly dataModel: Model<SellingPrice>,
//     @InjectModel('SellingPriceVersion') private readonly dataVersionModel: Model<SellingPriceVersion>) {

//   }

//   async getList(params: any): Promise<any> {
//     // // ('params', params);
//     const version = _.toNumber(params.version)
//     return await this.dataModel.find({ year: _.toInteger(params.year), version: version  }).sort({ rowOrder: 1 }).exec();
//   }
//   async getOne(id: any): Promise<any> {
//     return await this.dataModel.findOne({ "_id": id }).exec();
//   }

//   async create(data: any) {
//     _.each(data, (item) => {
//       item._id = mongoose.Types.ObjectId()
//       item.createDate = new Date();
//       item.updateDate = new Date();
//       const dataSave = new this.dataModel(item);
//       dataSave.save();
//     });

//     return true;
//   }

//   async delete(id: any) {
//     return await this.dataModel.deleteOne({ _id: id });
//   }
  
//   async getVersion(params: any): Promise<any> {
//     // // ('params', params);
//     return await this.dataVersionModel.find({ year: params.year }).sort({ updateDate: -1 }).exec();
//   }
//   async createVersion(data: any) {
//     data._id = mongoose.Types.ObjectId()
//     data.createDate = new Date();
//     data.updateDate = new Date();
//     const dataSave = new this.dataVersionModel(data);
//     return await dataSave.save();
//   }
// }
