import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { User } from './entity';
import { TOKENS } from '../../constants';
import { getConnection, Repository, Transaction, TransactionRepository } from 'typeorm';
import { userCreateDto } from './dto/userCreateDto';
import { userUpdateDto } from './dto/userUpdateDto';
import { UserGroupList } from '../user-group_list/entity';
@Injectable()
export class UsersService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<User>) {

  }

  async getList(params: any): Promise<any> {
    // // ('params', params);
    return this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }
  async getOne(id: any): Promise<any> {
    return await this.dataModel.findOne({ id: id });
  }


  async create(data: userCreateDto) {
    
    await getConnection().transaction(async transactionalEntityManager => {

      const user = new User();
      Object.assign(user, data)      
      
      await transactionalEntityManager.save(user);


      const userGroups : UserGroupList[] = []

      for(const userGroupData of data.userGroupDropdown){
        const userGroup = new UserGroupList();

        userGroup.user_id = user.id.toString();
        userGroup.user_group_id = userGroupData;
        userGroup.activeStatus = "1"
        userGroup.createByUserId = data.createByUserId;
        userGroup.createBy = data.createBy;
        userGroup.updateByUserId = data.updateByUserId;
        userGroup.updateBy = data.updateBy;

        userGroups.push(userGroup);
      }

      await transactionalEntityManager.save(userGroups);
   })
  }

  async update(data: userUpdateDto) {
     
    await getConnection().transaction(async transactionalEntityManager => {

      const user = await transactionalEntityManager.findOne(User, {where: { userName: data.userName}})

      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.isVendor = data.isVendor;
      user.unitCode = data.unitCode;
      user.unitName = data.unitName;
      user.birthDay = data.birthDay;
      user.email = data.email;
      user.emailSupvisor = data.emailSupvisor;
      user.phoneNumber = data.phoneNumber;
      user.positionCode = data.positionCode;
      user.positionName = data.positionName;
      user.activeStatus = data.activeStatus;
      user.createBy = data.createBy;
      user.createByUserId = data.createByUserId;
      user.updateBy = data.updateBy;
      user.updateByUserId = data.updateByUserId;
      
      await transactionalEntityManager.save(user);
      
      const userGroupRemove = await transactionalEntityManager.find(UserGroupList, {where: { user_id: user.id.toString() }});
      
      await transactionalEntityManager.delete(UserGroupList, userGroupRemove);

      const userGroups : UserGroupList[] = [];

      for(const userGroupData of data.userGroupDropdown){
        const userGroup = new UserGroupList();

        userGroup.user_id = user.id.toString();
        userGroup.user_group_id = userGroupData;
        userGroup.activeStatus = "1"
        userGroup.createByUserId = data.createByUserId;
        userGroup.createBy = data.createBy;
        userGroup.updateByUserId = data.updateByUserId;
        userGroup.updateBy = data.updateBy;

        userGroups.push(userGroup);
      }

      await transactionalEntityManager.save(userGroups);
   })
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

  async getOneByUsername(username: string): Promise<User | undefined> {
    // (user: User) => user.userName === username
    return await this.dataModel.findOne({ "userName": username });
  }

}
