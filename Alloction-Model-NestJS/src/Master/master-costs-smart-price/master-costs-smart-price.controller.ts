import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards, Request, Delete, Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MasterCostsSmartPriceService } from './master-costs-smart-price.service';
import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';

// @UseGuards(JwtAuthGuard)
@Controller('master-product-costs-smart-price')
export class MasterCostsSmartPriceController {
  constructor(private service: MasterCostsSmartPriceService) { }

  @Get()
  get(@Query('year') year) {
    const params = { year: year }
    return this.service.getList(params);
  }

  @Get('save-actual')
  saveActual(@Query('year') year) {
    return this.service.saveActual(year);
  }

  @Get('get-forecast')
  getForecast(@Query('year') year) {
    return this.service.getForecast(year);
  }
}
