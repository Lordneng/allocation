import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards, Request, Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MasterCostsService } from './master-costs.service';
import * as _ from 'lodash';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { MasterCost } from './models/master-cost';

@UseGuards(JwtAuthGuard)
@Controller('master-product-costs')
export class MasterCostsController {
  constructor(private service: MasterCostsService) { }

  @Get()
  @ApiBearerAuth()
  get(@Param() params) {
    // // ('data get list', params)
    return this.service.getList(params);
  }

  @Get('cost-parameters')
  @ApiBearerAuth()
  getParameter() {
    // // ('data get list', params)
    return this.service.getParameter();
  }

  // @Get(':id')
  // getByid(@Param('id') params) {
  //   // // ('data get One', params)
  //   return this.service.getOne(params);
  // }

  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.createBy = req.user.fullName;
          item.updateBy = req.user.fullName;
        })
      } else {
        data.createBy = req.user.fullName;
        data.updateBy = req.user.fullName;
      }

    }
    return this.service.create(data);
  }

  @Put()
  @ApiBearerAuth()
  update(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, (item) => {
          item.updateBy = req.user.fullName;
        })
      } else {
        data.updateBy = req.user.fullName;
      }

    }

    return this.service.create(data);
    // this.Costervice.updateCost(Cost);
  }

  @Delete(':id')
  @ApiBearerAuth()
  delete(@Param('id') id) {
    // // ('data Deelte', id)
    return this.service.delete(id);

  }
}
