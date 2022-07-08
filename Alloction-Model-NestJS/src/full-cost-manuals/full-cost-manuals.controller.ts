import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Query,
  Delete,
  Request,
} from '@nestjs/common';
import { FullCostManualsService } from './full-cost-manuals.service';
import * as _ from 'lodash';


@Controller('full-cost-manuals')
export class FullCostManualsController {
  constructor(private service: FullCostManualsService) { }

  // @Get(':year')
  // get(@Param() params) {
  //   // // ('data get list', params)
  //   return this.service.getList(params);
  // }

  @Get()
  async get(@Query('year') year, @Query('month') month) {
    const params = { year: year, month: month }
    return this.service.getList(params)
  }

  // @Get(':id')
  // getByid(@Param() params) {
  //   // // ('data get One', params)
  //   return this.service.getOne(params);
  // }


  @Post()
  create(@Body() data: any) {

    // // ('data Create', data)
    return this.service.create(data);
  }

  @Put()
  update(@Body() data: any) {

    // // ('data Update', data)
    return this.service.update(data);
    // this.Costervice.updateCost(Cost);
  }

  @Delete()
  delete(@Body() data: any) {
    // // ('data Deelte', data)
    return this.service.delete(data);
  }

  @Get('version')
  getVersion(@Query('year') year, @Query('isApply') isApply) {
    const params = { year: year, isApply: isApply }
    return this.service.getVersion(params)
  }

  @Post("version")
  saveVersion(@Request() req, @Body() data: any) {
    if (req.user) {
      _.each(data, (item) => {
        item.updateDate = new Date();
        item.updateBy = req.user.fullName;
      })
    }

    return this.service.createVersion(data);
  }

}
