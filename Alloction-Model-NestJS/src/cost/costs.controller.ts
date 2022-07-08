import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  UseGuards, Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CostsService } from './costs.service'

import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@Controller('costs')
export class CostsController {
  constructor(private service: CostsService) { }

  @Get()
  async get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params)
  }

  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data.cost, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })
      _.each(data.costManual, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })
      _.each(data.costVersion, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.save(data);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('isApply') isApply) {
    const params = { year: year, isApply: isApply }
    return this.service.getVersion(params)
  }

  @Get('version-month')
  getMonthVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthVersion(params)
  }

  @Get('manual')
  getManual(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getManual(params)
  }

  @Get('actual')
  getActual(@Query('year') year) {
    const params = { year: year }
    return this.service.getActual(params)
  }

}
