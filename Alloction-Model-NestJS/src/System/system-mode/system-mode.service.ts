import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { SystemMode } from './entity';
import { TOKENS } from '../../constants';
import { Repository } from 'typeorm';

@Injectable()
export class SystemModeService {

  constructor(
    @Inject(TOKENS.ProjectSystemModeRepositoryToken) private readonly systemModeModel: Repository<SystemMode>) {
  }

  async getOne(): Promise<any> {
    const res = await this.systemModeModel.findOne({ isActiveMode: true });
    return res;
  }
}