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
import { LRByLegalService } from './lr-by-legal.service';

@UseGuards(JwtAuthGuard)
@Controller('lr-by-legal')
export class LRByLegalController {
  constructor(private service: LRByLegalService) { }

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }

  @Get('history')
  getListHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    // // ('data get list', params)
    return this.service.getListHistory(params);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data.legalData)) {
        _.each(data.legalData, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.legalData.createBy = req.user.fullName;
        data.legalData.updateDate = new Date();
        data.legalData.updateBy = req.user.fullName;
      }

      if (_.isArray(data.legalFormData)) {
        _.each(data.legalFormData, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.legalFormData.createBy = req.user.fullName;
        data.legalFormData.updateDate = new Date();
        data.legalFormData.updateBy = req.user.fullName;
      }

      if (_.isArray(data.legalVersionData)) {
        _.each(data.legalVersionData, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.legalVersionData.createBy = req.user.fullName;
        data.legalVersionData.updateDate = new Date();
        data.legalVersionData.updateBy = req.user.fullName;
      }

    }
    // return this.service.create(data);
    return this.service.saveTransections(data.legalData, data.legalFormData, data.legalVersionData);
  }

  @Get('form')
  getForm(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getForm(params);
  }

  @Get('form/history')
  getFormGistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    // // ('data get form', params)
    return this.service.getFormHistory(params);
  }

  @Post('form')
  createForm(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createForm(data);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month }
    return this.service.getVersion(params);
  }
  @Post('version')
  createVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createVersion(data);
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
