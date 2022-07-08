import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { MasterTankCap } from './entity';
import { TOKENS } from '../../constants';
import console = require('console');
@Injectable()
export class MasterTankCapService {

  constructor(
    //@InjectModel('MasterCost') private readonly dataModel: Model<MasterCost>
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterTankCap>
  ) {

  }

  async getList(params: any): Promise<any> {
    // // ('params', params);
    return await this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }

  // async getOne(id: any): Promise<any> {
  //   return await this.dataModel.findOne({ "_id": id }).exec();
  // }
  @Transaction()
  async create(@TransactionRepository(MasterTankCap) manager: Repository<MasterTankCap>, data?: any) {
    return await manager.save(data);
  }

  // //ส่งข้อมูลเป็น array มาอย่างเดว

  async update(data: any) {
    //   const dataUpdate = await this.getOne(data._id);
    // ('params', data);
    //   dataUpdate.productCostName = data.productCostName;

    //   dataUpdate.productName = data.productName;

    //   dataUpdate.rowOrder = data.rowOrder;

    //   dataUpdate.unit = data.unit;

    //   dataUpdate.remark = data.remark;

    //   dataUpdate.activeStatus = data.activeStatus;

    //   dataUpdate.UpdateBy = data.UpdateBy;
    //   dataUpdate.updateDate = new Date();
    return this.dataModel.save({...data,  id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

}
