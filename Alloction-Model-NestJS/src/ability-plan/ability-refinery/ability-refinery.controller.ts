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
import { AbilityRefineryService } from './ability-refinery.service';
import * as _ from 'lodash';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefinerySupplierRequest } from './dto/refinerySupplierRequest';
  
@UseGuards(JwtAuthGuard)
@Controller('ability-refinery')
export class AbilityRefineryController {
    constructor(private service: AbilityRefineryService) { }
  
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
  getSuppiler(@Body() data: RefinerySupplierRequest) {
  
    return this.service.getSuppilerList(data);
  }

  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() data: any) {

    if (req.user) {
      _.each(data.data, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.version, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
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
  @ApiQuery({ name: 'year', type: Number })
  @ApiQuery({ name: 'isApply', type: Boolean })
  @Get('version')
  getVersion(@Query('year') year,  @Query('isApply') isApply) {
    const params = { year: year, isApply: isApply }
    return this.service.getVersion(params)
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
  @Post("form")
  saveForm(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }

    return this.service.SaveForm(data);
  }

  @ApiBearerAuth()
  @Get('ability-refinery-monthly')
  getAbility(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getRefineryList(params);
  }

  @ApiBearerAuth()
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
  