import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepotManagementMeterService } from './depot-management.service';
import { DepotDto } from './dto/depotDto';

@UseGuards(JwtAuthGuard)
@Controller('depot-management')
export class DepotManagementMeterController {
  constructor(private service: DepotManagementMeterService) { }

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }
  @Get('history')
  getListHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    // // ('data get list', params)
    return this.service.getHistoryList(params);
  }

  @Post()
  create(@Request() req, @Body() body: DepotDto) {
    if (req.user) {
      if (_.isArray(body.data)) {
        _.each(body.data, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
      }

      if (_.isArray(body.form)) {
        _.each(body.form, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
      }

      if (_.isArray(body.version)) {
        _.each(body.version, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
      }
    }

    return this.service.saveTrans(body.data, body.form, body.version);
  }

  @Get('form')
  getFormHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getForm(params);
  }

  @Get('form/history')
  getForm(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getForm(params);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getVersion(params);
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
