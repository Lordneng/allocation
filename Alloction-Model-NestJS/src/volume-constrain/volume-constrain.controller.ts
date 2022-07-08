import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VolumeConstrainService } from './volume-constrain.service';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('volume-constrain')
export class VolumeConstrainController {
  constructor(private service: VolumeConstrainService) { }

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version };
    return this.service.getList(params);
  }

  @Get('monthly-constrains')
  getContrin(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    //const params = { year: 2021, month: 10, version: 0 };
    return this.service.getListCstrains(params);
  }

  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: any) {
    if (req.user) {

      if (_.isArray(data.volumeConstrain)) {
        _.each(data.volumeConstrain, item => {
          item.createBy = (item.createBy ? item.createBy : req.user.fullName);
          item.createDate = (item.createDate ? item.createDate : new Date());
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      }

      if (_.isArray(data.volumeConstrainForm)) {
        _.each(data, item => {
          item.createBy = (item.createBy ? item.createBy : req.user.fullName);
          item.createDate = (item.createDate ? item.createDate : new Date());
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      }

      data.volumeConstrainVersion.createBy = (data.volumeConstrainVersion.createBy ? data.volumeConstrainVersion.createBy : req.user.fullName);
      data.volumeConstrainVersion.createDate = (data.volumeConstrainVersion.createDate ? data.volumeConstrainVersion.createDate : new Date());
      data.volumeConstrainVersion.updateDate = new Date();
      data.volumeConstrainVersion.updateBy = req.user.fullName;

    }

    return this.service.saveTransections(data.volumeConstrain, data.volumeConstrainVersion, data.volumeConstrainForm);
  }

  @Get('form')
  getForm(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    return this.service.getForm(params);
  }

  @Post('form')
  createForm(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, item => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createForm(data);
  }

  @Get('version')
  getVersion(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    return this.service.getVersion(params);
  }
  @Post('version')
  createVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, item => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createVersion(data);
  }

  @Get('version/month')
  getMonthMaxVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthMaxVersion(params)
  }
  @ApiBearerAuth()
  @Get('versionByYear')
  getVersionByYear(@Query('year') year) {
    const params = { year: year }
    return this.service.getVersionByYear(params)
  }

  @ApiBearerAuth()
  @Get('version/id')
  getVersionbyID(@Query('id') id) {
    return this.service.getVersionByIds(id)
  }
}
