import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { MasterSupplier } from './entity'
import { Repository, Transaction, TransactionRepository } from 'typeorm'
import { TOKENS } from '../../constants'

@Injectable()
export class MasterSupplierService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterSupplier>) {

  }

  async getList(params: any): Promise<any> {
    return await this.dataModel.find({ where: { activeStatus: '1' }, order: { rowOrder: 'ASC' } });;
  }

  @Transaction()
  async create(@TransactionRepository(MasterSupplier) manager: Repository<MasterSupplier>, data?: any) {
    return await manager.save(data);
  }

  async update(data: any) {
    return this.dataModel.save({...data,  id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

}
