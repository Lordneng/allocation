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
import { MasterTankCapService } from './master-tank-cap.service';
import * as _ from 'lodash';
// import { MasterCost } from './models/master-cost';

//@UseGuards(JwtAuthGuard)
@Controller('master-tank-cap')
export class MasterTankCapController {
  constructor(private service: MasterTankCapService) { }

  @Get()
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
  delete(@Param('id') id) {
    // // ('data Deelte', id)
    return this.service.delete(id);

  }
}
