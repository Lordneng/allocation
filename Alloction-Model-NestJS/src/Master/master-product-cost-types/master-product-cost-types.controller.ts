import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { MasterCostProductsTypesService } from './master-product-cost-types.service';
import { ApiBearerAuth } from '@nestjs/swagger';

//@UseGuards(JwtAuthGuard)
@Controller('master-product-cost-types')
export class MasterCostProductsTypesController {
  constructor(private service: MasterCostProductsTypesService) { }

  @Get()
  @ApiBearerAuth()
  get(@Param() params) {
    // // ('data get list', params)
    return this.service.getList(params);
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
          item.createBy = req.user.fullName;
          item.updateBy = req.user.fullName;
        })
      } else {
        data.createBy = req.user.fullName;
        data.updateBy = req.user.fullName;
      }

    }
    return this.service.update(data);
  }

  // @Delete(':id')
  // delete(@Param('id') id) {
  //   // // ('data Deelte', id)
  //   return this.service.delete(id);

  // }
}
