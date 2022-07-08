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
  import * as _ from 'lodash';
  import { MasterCustomerTypeService } from './master-customer-type.service';
import { MasterCustomerType } from './entity/master-customer-type.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
  
@UseGuards(JwtAuthGuard)
@Controller('master-customer-type')
export class MasterCustomerTypeController {
    constructor(private service: MasterCustomerTypeService) { }
  
    @Get()
    @ApiBearerAuth()
    get(@Param() params) {
      return this.service.getList(params);
    }
  
    @Post()
    @ApiBearerAuth()
    create(@Request() req, @Body() data: MasterCustomerType) {

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
    update(@Request() req, @Body() data: MasterCustomerType) {
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