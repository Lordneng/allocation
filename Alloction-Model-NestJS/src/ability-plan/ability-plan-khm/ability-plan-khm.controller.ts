import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AbilityPlanKhmService } from './ability-plan-khm.service';
import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { KhmSupplierRequest } from './dto/khmSupplierRequest';

@UseGuards(JwtAuthGuard)
@Controller('ability-plan-khm')
export class AbilityPlanKhmController {
  constructor(private service: AbilityPlanKhmService) { }

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
  @Post("supplier")
  getSuppiler(@Body() data: KhmSupplierRequest) {
    return this.service.getSupplierList(data);
  }

  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() data: any) {

    if (req.user) {
      _.each(data.data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })

      _.each(data.version, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }

    return this.service.saveTrans(data.data, data.version);
  }

  @ApiBearerAuth()
  @Put()
  update(@Request() req, @Body() data: any) {

    if (req.user) {
      _.each(data.data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })

      _.each(data.version, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.saveTrans(data.data, data.version);
  }

  @ApiBearerAuth()
  @Get('version-month')
  getMonthVersion(@Query('year') year,  @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthVersion(params)
  }

  @ApiBearerAuth()
  @Get('version/month')
  getMonthMaxVersion(@Query('year') year,  @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthMaxVersion(params)
  }

  @ApiBearerAuth()
  @Get('version')
  getMonth(@Query('year') year,  @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthMaxVersion(params)
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
  @Get('manual')
  getManual(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getManual(params)
  }

  @ApiBearerAuth()
  @Post("manual")
  saveManual(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.saveManual(data);
  }

  @ApiBearerAuth()
  @Get('ability-khm-monthly')
  getAbility(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getKhmList(params);
  }

  @Get('history')
  getHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getHistoryList(params);
  }


  @ApiBearerAuth()
  @Get('versionByYear')
  getVersionByYear(@Query('year') year) {
    const params = { year: year }
    return this.service.getVersionByYear(params)
  }
}
