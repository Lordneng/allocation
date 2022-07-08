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
import { MasterReferenceSmartPricesService } from './master-reference-smart-prices.service';
import { ApiParam } from '@nestjs/swagger';


// @UseGuards(JwtAuthGuard)
@Controller('master-reference-smart-prices')
export class MasterReferenceSmartPricesController {
  constructor(private service: MasterReferenceSmartPricesService) { }

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
  // @Post()
  // create(@Request() req, @Body() data: any) {
  //   if (req.user) {
  //     if (_.isArray(data)) {
  //       _.each(data, (item) => {
  //         item.createBy = req.user.fullName;
  //         item.updateBy = req.user.fullName;
  //       })
  //     } else {
  //       data.createBy = req.user.fullName;
  //       data.updateBy = req.user.fullName;
  //     }

  //   }
  //   return this.service.create(data);
  // }


  // @Put()
  // update(@Request() req, @Body() data: any) {
  //   if (req.user) {
  //     if (_.isArray(data)) {
  //       _.each(data, (item) => {
  //         item.createBy = req.user.fullName;
  //         item.updateBy = req.user.fullName;
  //       })
  //     } else {
  //       data.createBy = req.user.fullName;
  //       data.updateBy = req.user.fullName;
  //     }

  //   }
  //   return this.service.update(data);
  // }

  // @Delete(':id')
  // delete(@Param('id') id) {
  //   // // ('data Deelte', id)
  //   return this.service.delete(id);

  // }
}
