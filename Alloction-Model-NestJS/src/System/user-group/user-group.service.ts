import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { UserGroup } from './entity'
import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm'
import { TOKENS } from '../../constants'

@Injectable()
export class UserGroupService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<UserGroup>) {

  }

  async getList(params: any): Promise<any> {
    return await this.dataModel.find({ order: { rowOrder: 'ASC' } });;
  }

  @Transaction()
  async create(@TransactionRepository(UserGroup) manager: Repository<UserGroup>, data?: any) {
    return await manager.save(data);
  }

  async update(data: any) {
    return this.dataModel.save({...data,  id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

}
