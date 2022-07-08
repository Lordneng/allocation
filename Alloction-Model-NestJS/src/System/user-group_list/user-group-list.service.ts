import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { UserGroupList } from './entity'
import { EntityManager, Repository, Transaction, TransactionRepository } from 'typeorm'
import { TOKENS } from '../../constants'
import { UserGroup } from '../user-group/entity';

@Injectable()
export class UserGroupListService {

  constructor(@Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<UserGroupList>,
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataGroupModel: Repository<UserGroup>) {

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

  async getByUserId(params: any): Promise<any> {

    const resUserGroupList = await this.dataModel.createQueryBuilder('userGroupList')
      .select([
        'userGroupList.id as "userGroupListId"',
        'userGroup.id as "userGroupId"',
        'userGroup.name as "userGroupName"'
      ])
      .leftJoin(UserGroup, 'userGroup', 'userGroup.id = userGroupList.user_group_id')
      .where('userGroupList.user_id = :userId', { userId: params?.user_id })
      .andWhere('userGroup.name = :userGroupName', { userGroupName: params?.userGroupName })
      .getRawOne();

    return resUserGroupList;
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
