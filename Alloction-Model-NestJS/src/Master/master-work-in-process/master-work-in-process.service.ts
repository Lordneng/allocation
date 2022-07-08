import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { TOKENS } from '../../constants';
import { MasterWorkInProcess } from './entity/master-work-in-process.entity';

@Injectable()
export class MasterWorkInProcessService {

  constructor(
    @Inject(TOKENS.ProjectRepositoryToken) private readonly dataModel: Repository<MasterWorkInProcess>
  ) { }

  async getList(params: any): Promise<any> {
    return await this.dataModel.find({ order: { rowOrder: 'ASC' } });
  }


  async create(data: MasterWorkInProcess) {
    return await this.dataModel.save(data);
  }

  async update(data: any) {
    return this.dataModel.save({...data,  id: data.id });
  }

  async delete(id: any) {
    return await this.dataModel.delete({ id: id });
  }

}