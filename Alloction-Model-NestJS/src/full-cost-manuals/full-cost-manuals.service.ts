import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import moment from 'moment';
import { Repository } from 'typeorm'
import { TOKENS } from '../constants';
import { FullCostManual, FullCostManualVersion } from './entity';

@Injectable()
export class FullCostManualsService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryTokenManual) private readonly dataModel: Repository<FullCostManual>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<FullCostManualVersion>
  ) { }

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
    // data._id = mongoose.Types.ObjectId()
    // data.createDate = new Date();
    // data.updateDate = new Date();
    // const dataSave = new this.dataVersionModel(data);
    // return await dataSave.save();

    if (data.length > 0) {
      await this.dataModel.delete({ year: data[0].year, month: data[0].month, version: data[0].version })
      return await this.dataModel.save(data);
    }

  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    let dataWhere: any = { year: params.year };
    if (params.isApply === true) {
      dataWhere.isApply = true;
    }
    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async createVersion(data: any) {
    await this.dataVersionModel.update({ year: data.year, isApply: true }, { isApply: false, updateBy: data.updateBy })
    return await this.dataVersionModel.save(data);
  }

}
