import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TankCapService } from './tank-cap.service';
import * as _ from 'lodash';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('tank-cap')
export class TankCapController {
  constructor(private service: TankCapService) { }

  @Get()
  get(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getList(params);
  }

  @Get('cal-margin')
  getCalMargin(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getListToCalMargin(params);
  }

  @Get('tank-monthly')
  getAbility(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getListAbility(params);
  }

  @Get('history')
  getHistory(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getListHistory(params);
  }
  @Get("form")
  getForm(@Query('year') year, @Query('month') month, @Query('version') version) {
    const params = { year: year, month: month, version: version }
    return this.service.getForm(params);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    if (req.user) {
      if (_.isArray(data.Data)) {
        _.each(data.Data, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.Data.createBy = req.user.fullName;
        data.Data.updateDate = new Date();
        data.Data.updateBy = req.user.fullName;
      }

      if (_.isArray(data.FormData)) {
        _.each(data.FormData, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.FormData.createBy = req.user.fullName;
        data.FormData.updateDate = new Date();
        data.FormData.updateBy = req.user.fullName;
      }

      if (_.isArray(data.VersionData)) {
        _.each(data.VersionData, (item) => {
          item.createBy = req.user.fullName;
          item.updateDate = new Date();
          item.updateBy = req.user.fullName;
        })
      } else {
        data.VersionData.createBy = req.user.fullName;
        data.VersionData.updateDate = new Date();
        data.VersionData.updateBy = req.user.fullName;
      }

    }
    // return this.service.save(data);
    return this.service.saveTransections(data.Data, data.FormData, data.VersionData);
  }

  @Put()
  update(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.save(data)
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('month') month, @Query('isApply') isApply) {
    const params = { year: year, month: month, isApply: isApply }
    return this.service.getVersion(params)
  }

  @Get('version/month')
  getMonthMaxVersion(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getMonthMaxVersion(params)
  }

  @Post("version")
  saveVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }

    return this.service.saveVersion(data);
  }

  @Post("form")
  saveForm(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }
    return this.service.SaveForm(data);
  }
  @ApiBearerAuth()
  @Get('versionByYear')
  getVersionByYear(@Query('year') year) {
    const params = { year: year }
    return this.service.getVersionByYear(params)
  }

  @ApiBearerAuth()
  @Get('version/id')
  getVersionbyID(@Query('id') id) {
    return this.service.getVersionById2(id)
  }
}
