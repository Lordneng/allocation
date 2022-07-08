import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    UseGuards, 
    Request
  } from '@nestjs/common'
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import * as _ from 'lodash';
  import { MasterTurnaroundTypeService } from './master-turnaround-type.service';
  import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
  import { MasterTurnaroundType } from './entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('master-turnaround-type')
  export class MasterTurnaroundController {
    constructor(private service: MasterTurnaroundTypeService) { }
  
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type: [MasterTurnaroundType], description: 'Get customer list.' })
    get() {
      return this.service.getList();
    }
  
    @Get(":id")
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, type: MasterTurnaroundType, description: 'Get customer detail.' })
    getById(@Param('id') id) {
      return this.service.getById(id);
    }
  
    @Post()
    create(@Request() req, @Body() data: MasterTurnaroundType) {
      if (req.user) {
        data.createByUserId = req.user.userId;
        data.createBy = req.user.fullName;
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;
      }
  
      return this.service.create(data);
    }
  
    @Put()
    update(@Request() req, @Body() data: MasterTurnaroundType) {
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
  