import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { UserGroupList } from './entity'
import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm'
import { TOKENS } from '../../constants'

@Injectable()
export class MasterUserGroupListService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<UserGroupList>) {

  }

  async getList(params: any): Promise<any> {
    return await (await this.dataModel.find({
      // where: [{
      //   user_id: params.user_id
      // }],
      order: {
        rowOrder: "ASC"
      }
    }))
  }

  @Transaction()
  async create(@TransactionRepository(UserGroupList) manager: Repository<UserGroupList>, data?: any) {
    await this.delete(data[0].user_id);
    return await manager.save(data);
  }

  async update(data: any) {
    return this.dataModel.save({ ...data, id: data.id });
  }

  async delete(user_id: any) {
    return await this.dataModel.delete({ user_id: user_id });
  }

}
