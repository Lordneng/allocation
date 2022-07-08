import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import * as _ from 'lodash';
import { VolumeConstrainMeterService } from './volume-constrain-meter.service';

@Controller('volume-constrain-meters')
export class VolumeConstrainMeterController {
  constructor(private service: VolumeConstrainMeterService) { }

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }
  // @Get('history')
  // getListHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
  //   const params = { year: year, month: month, version: version }
  //   // // ('data get list', params)
  //   return this.service.getListHistory(params);
  // }
  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get('form')
  getForm(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getForm(params);
  }
  // @Get('form/history')
  // getFormGistory(@Query('year') year, @Query('month') month, @Query('version') version) {
  //   const params = { year: year, month: month, version: version }
  //   // // ('data get form', params)
  //   return this.service.getFormHistory(params);
  // }
  @Post('form')
  createForm(@Body() data: any) {
    return this.service.createForm(data);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getVersion(params);
  }
  @Post('version')
  createVersion(@Body() data: any) {
    return this.service.createVersion(data);
  }
}
