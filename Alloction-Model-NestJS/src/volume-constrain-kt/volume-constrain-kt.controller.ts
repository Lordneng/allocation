import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VolumeConstrainKtService } from './volume-constrain-kt.service';

@UseGuards(JwtAuthGuard)
@Controller('volume-constrain-kts')
export class VolumeConstrainKtsController {
  constructor(private service: VolumeConstrainKtService) {}

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version };
    return this.service.getList(params);
  }

  @Get('monthly-constrains')
  getContrin(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    //const params = { year: 2021, month: 10, version: 0 };
    return this.service.getListCstrains(params);
  }

  // @Get('history')
  // getListHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
  //   const params = { year: year, month: month, version: version }
  //   // // ('data get list', params)
  //   return this.service.getListHistory(params);
  // }
  @Post()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, item => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.create(data);
  }

  @Get('form')
  getForm(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    return this.service.getForm(params);
  }
  // @Get('form/history')
  // getFormGistory(@Query('year') year, @Query('month') month, @Query('version') version) {
  //   const params = { year: year, month: month, version: version }
  //   // // ('data get form', params)
  //   return this.service.getFormHistory(params);
  // }
  @Post('form')
  createForm(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, item => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createForm(data);
  }

  @Get('version')
  getVersion(
    @Query('year') year,
    @Query('month') month,
    @Query('version') version,
  ) {
    const params = { year: year, month: month, version: version };
    return this.service.getVersion(params);
  }
  @Post('version')
  createVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data)) {
        _.each(data, item => {
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        });
      } else {
        data.updateDate = new Date();
        data.updateBy = req.user.fullName;
      }
    }
    return this.service.createVersion(data);
  }
}
