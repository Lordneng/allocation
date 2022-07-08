import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards, Request,
} from '@nestjs/common';
import { ReferencePricesService } from './reference-prices.service';

import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reference-prices')
export class ReferencePricesController {
  constructor(private service: ReferencePricesService) { }

  @Get()
  async get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }

  @Post()
  save(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data.referencePriceVersion, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      })

      _.each(data.referencePrice, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      });

      _.each(data.referencePriceManual, (item) => {
        item.createByUserId = req.user.userId;
        item.createBy = req.user.fullName;
        item.updateByUserId = req.user.userId;
        item.updateBy = req.user.fullName;
      });

      _.each(data.referencePriceVersion, (item) => {
        if(item?.isImportFile1){
          item.file1ModifiedDate = (item.filePath1 ? new Date() : null);
          item.file1Modifiedby = (item.filePath1 ? req.user.fullName : null);
        }
        if(item?.isImportFile2){
          item.file2ModifiedDate = (item.filePath2 ? new Date() : null);
          item.file2Modifiedby = (item.filePath2 ? req.user.fullName : null);
        }
        if(item?.isImportFile3){
          item.file3ModifiedDate = (item.filePath3 ? new Date() : null);
          item.file3Modifiedby = (item.filePath3 ? req.user.fullName : null);
        }
      });

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
