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
import { MasterReferencePricesService } from './master-reference-prices.service';


// @UseGuards(JwtAuthGuard)
@Controller('master-reference-prices')
export class MasterReferencePricesController {
  constructor(private service: MasterReferencePricesService) { }

  @Get()
  get(@Param() params) {
    // // ('data get list', params)
    return this.service.getList(params);
  }

  @Get('reference-price-parameters')
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
