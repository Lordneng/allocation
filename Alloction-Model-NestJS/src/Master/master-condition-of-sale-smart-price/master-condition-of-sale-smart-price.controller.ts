import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request, Query,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { MasterConditionOfSaleSmartPriceService } from './master-condition-of-sale-smart-price.service';
import { ApiParam } from '@nestjs/swagger';


// @UseGuards(JwtAuthGuard)
@Controller('master-condition-of-sale-smart-price')
export class MasterConditionOfSaleSmartPriceController {
  constructor(private service: MasterConditionOfSaleSmartPriceService) { }

  @Get()
  get(@Query('year') year) {
    const params = { year: year }
    return this.service.getList(params);
  }

  @Get('save-actual')
  saveActual(@Query('month') month, @Query('year') year) {
    return this.service.saveActual(month, year);
  }

}
