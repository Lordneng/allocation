import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import * as _ from 'lodash';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AbilityPlanRayongService } from './ability-plan-rayong.service';

@UseGuards(JwtAuthGuard)
@Controller('ability-plan-rayong')
export class AbilityPlanRayongController {
  constructor(private service: AbilityPlanRayongService) { }

  @ApiBearerAuth()
  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }

  @ApiBearerAuth()
  @Get('getListbyVersionId')
  getListbyVersionId(@Query('versionId') versionId) {
    const params = { versionId: versionId }
    return this.service.getListbyVersionId(params);
  }

  @ApiBearerAuth()
  @Post()
  save(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data.dataList, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.dataDaily, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.dataVersion, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })
    }

    return this.service.saveTrans(data.dataList, data.dataDaily, data.dataVersion);
  }

  @ApiBearerAuth()
  @Get('version')
  getVersion(@Query('year') year, @Query('month') month, @Query('isApply') isApply) {
    const params = { year: year, month: month, isApply: isApply }
    return this.service.getVersion(params)
  }

  @ApiBearerAuth()
  @Get('version/id')
  getVersionbyID(@Query('id') id) {
    return this.service.getVersionByID(id)
  }

  @ApiBearerAuth()
  @Post("version")
  saveVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.saveVersion(data);
  }

  @ApiBearerAuth()
  @Get('daily')
  getDaily(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getDaily(params);
  }

  @ApiBearerAuth()
  @Post('daily')
  saveDaily(@Request() req, @Body() data: any) {
    // if (req.user) {
    // _.each(data, (item) => {
    //   item.updateDate = new Date();
    //   item.updateBy = req.user.fullName;
    // })
    // }
    return this.service.saveDaily(data);
  }

  @ApiBearerAuth()
  @Get('ability')
  getAbility(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getAbility(params);
  }

  @ApiBearerAuth()
  @Get('versionByYear')
  getVersionByYear(@Query('year') year) {
    const params = { year: year }
    return this.service.getVersion(params)
  }

  @ApiBearerAuth()
  @Get('getMaster')
  getMaster() {
    return this.service.getMaster();
  }

  @Get('version-month')
  getMonthVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthVersion(params)
  }

}
