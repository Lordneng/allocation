import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { Permission } from './entity';
import { TOKENS } from '../../constants';
import { Repository, Transaction } from 'typeorm';
@Injectable()
export class PermissionsService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<Permission>) {
  }

  async getList(params: any): Promise<any> {
    return this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }
  async getByUserGroup(id: any): Promise<any> {
    
    let permissions : any = {};

    const sqlMenuLevel1 = `exec SP_PERMISSION_MENU_LEVEL_1 @0`
    const sqlMenuLevel2 = `exec SP_PERMISSION_MENU_LEVEL_2 @0`
    const sqlMenuLevel3 = `exec SP_PERMISSION_MENU_LEVEL_3 @0`

    permissions.menuLvel1 = await this.dataModel.query(sqlMenuLevel1, [id])
    permissions.menuLvel2 = await this.dataModel.query(sqlMenuLevel2, [id])
    permissions.menuLvel3 = await this.dataModel.query(sqlMenuLevel3, [id])

    return permissions;
  }

  async save(data?: any) {
    await this.delete(data[0].userGroupId);
    return await this.dataModel.save(data, { chunk: 10 });
  }

  async delete(userGroupId: any) {
    return await this.dataModel.delete({ userGroupId: userGroupId });
  }

}