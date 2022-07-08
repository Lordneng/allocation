import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import * as _ from 'lodash';
import { MarginPerUnitsService } from './margin-per-units.service';

@Controller('margin-per-units')
export class MarginPerUnitsController {
  constructor(private service: MarginPerUnitsService) { }

  @Get('/:year/:version')
  get(@Param() params) {
    return this.service.getList(params);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get(':year')
  getVersion(@Param() params) {
    return this.service.getVersion(params);
  }
  @Put()
  createVersion(@Body() data: any) {
    return this.service.createVersion(data);
  }
}
