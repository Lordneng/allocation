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
import { MasterTurnaroundService } from './master-turnaround.service'
import { TurnaroundCreateDto } from './dto/turnaroundCreateDto';
import { TurnaroundUpdateDto } from './dto/turnaroundUpdateDto';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Turnaround } from './entity';

@UseGuards(JwtAuthGuard)
@Controller('turnaround')
export class MasterTurnaroundController {
  constructor(private service: MasterTurnaroundService) { }

  @Get()
  get(@Query('year') year, @Query('customerId') customerId, @Query('productId') productId) {
    const params : any = { year: year, customerId: customerId, productId: productId}
    return this.service.getList(params);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Turnaround, description: 'Get turnaround detail.' })
  getById(@Param('id') id) {
    return this.service.getById(id);
  }

  @Get('to-volume-constrain/:year/:month')
  @ApiBearerAuth()
  getCalMargin(@Param('year') year: number, @Param('month') month: number) {
    const params = { year: year, month: month }
    return this.service.getturnaroundvolume(params);
  }
  
  @Post()
  create(@Request() req, @Body() data: TurnaroundCreateDto) {
    if (req.user) {
      data.createByUserId = req.user.userId;
      data.createBy = req.user.fullName;
      // data.updateByUserId = req.user.userId;
      // data.updateBy = req.user.fullName;
    }

    return this.service.create(data);
  }


  @Put()
  update(@Request() req, @Body() data: TurnaroundUpdateDto) {
    if (req.user) {
      data.updateByUserId = req.user.userId;
      data.updateBy = req.user.fullName;
    }

    return this.service.update(data);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.service.delete(id);
  }
}
