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
import { CalMarginService } from './cal-margin.service';
import * as _ from 'lodash';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CalmarginRequestDto } from './dto/calmarginRequestDto';
import { CalmarginSaveDto } from './dto/calmarginSaveDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cal-margin')
export class CalMarginController {
  constructor(private service: CalMarginService) { }

  @Get()
  @ApiResponse({ status: 200, type: [CalmarginRequestDto] })
  get(@Query('year') year: number,
    @Query('month') month: number,
    @Query('version') version: number,
    @Query('costProductTypeId') costProductTypeId: string,
    @Query('costVersionId') costVersionId: string,
    @Query('referencePriceVersionId') referencePriceVersionId: string) {

    if (year && month && costProductTypeId && costVersionId && referencePriceVersionId) {
      return this.service.get(month, year, costProductTypeId, costVersionId, referencePriceVersionId)
    }

    return this.service.getByVersion(month, year, version);
  }

  @Get('version')
  @ApiBearerAuth()
  getVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getVersion(params)
  }

  @Get('full-cost/manual')
  @ApiBearerAuth()
  getFullCostVersion(@Query('year') year: number, @Query('month') month: number, @Query('version') version: number) {
    const params = { year: year, month: month, version: version }
    return this.service.getFullCostVersion(params)
  }

  @Get('selling-price/manual')
  @ApiBearerAuth()
  getSellingPriceVersion(@Query('year') year: number, @Query('month') month: number, @Query('version') version: number) {
    const params = { year: year, month: month, version: version }
    return this.service.getSellingPriceVersion(params)
  }

  @Post()
  @ApiBearerAuth()
  save(@Request() req, @Body() data: CalmarginSaveDto) {

    if (req.user) {
      _.each(data.fullCostManuals, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.sellingPricesManuals, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      data.createByUserId = req.user.userId;
      data.createBy = req.user.fullName;
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }

    return this.service.save(data);
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