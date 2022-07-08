import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { getConnection, Repository, Transaction, TransactionRepository } from 'typeorm';
import { MasterDepot } from './entity';
import { TOKENS } from '../../constants';
import moment from 'moment';
@Injectable()
export class MasterDepotService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterDepot>
  ) {

  }

  async getList(): Promise<any> {
    return await this.dataModel.find({order: { rowOrder: 'ASC' } });
  }

  async getActive(status: any): Promise<any> {
    return await this.dataModel.find({where: { activeStatus: status }, order: { rowOrder: 'ASC' } });
  }

  async getOne(id: any): Promise<MasterDepot> {
    return await this.dataModel.findOne({ id: id });
  }

  @Transaction()
  async create(@TransactionRepository(MasterDepot) manager: Repository<MasterDepot>, data?: any) {
    return await manager.save(data);
  }

  async update(data: any) {
    return this.dataModel.save({ ...data, id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }
  
  async save(depot?: any) {

    await getConnection().transaction(async transactionalEntityManager => {

      let depotSave = await transactionalEntityManager.findOne(MasterDepot, { id: depot.id });
  
      if (depot) {
        depotSave.rowOrder = depot.rowOrder;
        depotSave.code = depot.productCode;
        depotSave.name = depot.productName;
        depotSave.activeStatus = depot.activeStatus;
        depotSave.remark = depot.remark;
        depotSave.createBy = depot.createBy;
        depotSave.updateBy = depot.updateBy;
      } else {
        depotSave = new MasterDepot();
        Object.assign(depotSave, depot);
      }

      await transactionalEntityManager.save(depotSave);

    });
  }

}
