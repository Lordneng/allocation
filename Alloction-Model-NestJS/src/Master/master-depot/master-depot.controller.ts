import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    UseGuards, 
    Request,
    Query,
    Delete
  } from '@nestjs/common'
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import * as _ from 'lodash';
  import { MasterDepotService } from './master-depot.service';
  import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MasterDepot } from './entity';
  
  @UseGuards(JwtAuthGuard)
  @Controller('master-depot')
  export class MasterDepotController {
    constructor(private service: MasterDepotService) { }
  
    @Get()
    get() {
      return this.service.getList();
    }
  
    @Get('active')
    getActive(@Query('status') status) {
      return this.service.getActive(status);
    }
  
    @Get(":depotId")
    @ApiBearerAuth()
    @ApiParam({ name: 'depotId', type: String })
    @ApiResponse({ status: 200, type: MasterDepot, description: 'Get depot detail.' })
    getById(@Param('depotId') productId) {
      return this.service.getOne(productId);
    }
  
  
    @Post()
    @ApiBearerAuth()
    create(@Request() req, @Body() data: any) {
      if (req.user) {
        data.createBy = req.user.fullName;
        data.updateBy = req.user.fullName;
      }
      
      return this.service.save(data);
    }
  
  
    @Put()
    @ApiBearerAuth()
    update(@Request() req, @Body() data: any) {
  
      if (req.user) {
        data.product.createBy = req.user.fullName;
        data.product.updateBy = req.user.fullName;
      }
      
      return this.service.save(data);
    }
  
  
    @Delete(':id')
    delete(@Param('id') id) {
      // // ('data Deelte', id)
      return this.service.delete(id);
  
    }
  }