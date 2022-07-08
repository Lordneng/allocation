import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    UseGuards, Request, Query, HttpException, HttpStatus,
  } from '@nestjs/common'
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import * as _ from 'lodash';

  import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryControlService } from './inventory-control.service';
import { InventoryBalance } from './entity/inventory-balance.entity';
  
@UseGuards(JwtAuthGuard)
@Controller('inventory-control')
export class InventoryControlController {
    constructor(private service: InventoryControlService) { }
  
    @Get()
    @ApiBearerAuth()
    get(@Param() params) {
      return this.service.getList(params);
    }
  
    @Post()
    @ApiBearerAuth()
    create(@Request() req, @Body() data: InventoryBalance) {

        // (req.user)
      if (req.user) {

        data.createByUserId = req.user.userId;
        data.createBy = req.user.fullName;
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;
  
      }
      //return this.service.create(data);
    }
  
    @Put()
    @ApiBearerAuth()
    update(@Request() req, @Body() data: InventoryBalance) {
      if (req.user) {
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;
      }
  
      return this.service.update(data);
    }
  
    @Delete(':id')
    @ApiBearerAuth()
    delete(@Param('id') id) {
      return this.service.delete(id);
    }
}