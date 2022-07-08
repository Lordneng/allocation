import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { MenuLevel1, MenuLevel2, MenuLevel3 } from './entity';
import { TOKENS } from '../../constants';
import { Repository } from 'typeorm';

@Injectable()
export class MenusService {

  constructor(
    @Inject(TOKENS.ProjectMenuLevel1RepositoryToken) private readonly menuLevel1Model: Repository<MenuLevel1>,
    @Inject(TOKENS.ProjectMenuLevel2RepositoryToken) private readonly menuLevel2Model: Repository<MenuLevel2>,
    @Inject(TOKENS.ProjectMenuLevel3RepositoryToken) private readonly menuLevel3Model: Repository<MenuLevel3>) {

  }

  async getList(): Promise<any> {
    let menus : any= {};

    menus.level1 = await this.menuLevel1Model.find({ order: { rowOrder: 'ASC' } });
    menus.level2 = await this.menuLevel2Model.find({ order: { rowOrder: 'ASC' } });
    menus.level3 = await this.menuLevel3Model.find({ order: { rowOrder: 'ASC' } });

    return menus;
  }



}