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
  import { MasterWorkInProcessService } from './master-work-in-process.service';
  import { MasterWorkInProcess } from './entity/master-work-in-process.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
  
@UseGuards(JwtAuthGuard)
@Controller('master-work-in-process')
export class MasterWorkInProcessController {
    constructor(private service: MasterWorkInProcessService) { }
  
    @Get()
    @ApiBearerAuth()
    get(@Param() params) {
      return this.service.getList(params);
    }
  
    @Post()
    @ApiBearerAuth()
    create(@Request() req, @Body() data: MasterWorkInProcess) {

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
    update(@Request() req, @Body() data: MasterWorkInProcess) {
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