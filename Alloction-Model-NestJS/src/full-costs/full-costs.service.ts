import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { FullCost, FullCostVersion } from './entity'
import { FullCostManual } from '../full-cost-manuals/entity/full-cost-manual.entity'
import { Repository } from 'typeorm'
import { TOKENS } from '../constants';

@Injectable()
export class FullCostsService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<FullCost>,
    @Inject(TOKENS.ProjectRepositoryTokenVersion) private readonly dataVersionModel: Repository<FullCostVersion>) {
  }

  async getList(params: any): Promise<any> {
    // // ('FullCost : params', params);
    // const version = _.toNumber(params.version)
    // return await this.dataModel.find({ year: _.toInteger(params.year), version: version }).sort({ rowOrder: 1 }).exec();
    return await (await this.dataModel.find({
      where: [{
        year: _.toInteger(params.year),
        month: _.toInteger(params.month),
        version: 0
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
    // _.each(data, (item) => {
    //   item._id = mongoose.Types.ObjectId()
    //   item.createDate = new Date();
    //   item.updateDate = new Date();
    //   const dataSave = new this.dataModel(item);
    //   dataSave.save();
    // });

    // return true;

    if (data.length > 0) {
      await this.dataModel.delete({ year: data[0].year, month: data[0].month })
    }
    return await this.dataModel.save(data);

  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getVersion(params: any): Promise<any> {
    // ('params', params);
    let dataWhere: any = { year: params.year };
    if (params.isApply === true) {
      dataWhere.isApply = true;
    }
    return await this.dataVersionModel.find({ where: [dataWhere], order: { month: 'DESC', version: 'DESC' } });
  }

  async createVersion(data: any) {
    await this.dataVersionModel.update({ year: data[0].year, isApply: true }, { isApply: false, updateBy: data[0].updateBy })
    return await this.dataVersionModel.save(data);
  }
}
