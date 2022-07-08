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
  import { MasterSupplierService } from './master-suppliers.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MasterSupplier } from './entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('master-supplier')
  export class MasterSupplierController {
    constructor(private service: MasterSupplierService) { }
  
    @Get()
    @ApiBearerAuth()
    get(@Param() params) {
      return this.service.getList(params);
    }
  
  
    @Post()
    @ApiBearerAuth()
    @ApiBody({ type: MasterSupplier })
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
    @ApiBody({ type: MasterSupplier })
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
  
    @Delete(':id')
    delete(@Param('id') id) {
      // // ('data Deelte', id)
      return this.service.delete(id);
  
    }
  }