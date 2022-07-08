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
import { MasterSourceDemandDeliveryService } from './master-source-demand-delivery.service';


@UseGuards(JwtAuthGuard)
@Controller('master-source-demand-delivery')
export class MasterSourceDemandDeliveryController {
  constructor(private service: MasterSourceDemandDeliveryService) { }

  @Get()
  get(@Param() params) {
    // // ('data get list', params)
    return this.service.getList(params);
  }

  // @Get(':id')
  // getByid(@Param() params) {
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

  // @Delete()
  // delete(@Body() data: any) {
  //   // // ('data Deelte', data)
  //   return this.service.delete(data);
  // }
}
