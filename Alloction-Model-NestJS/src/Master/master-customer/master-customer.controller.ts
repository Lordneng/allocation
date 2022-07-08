import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards, Request,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { MasterCustomerService } from './master-customer.service';
import { CustomerCreateDto } from './dto/customerCreateDto';
import { CustomerUpdateDto } from './dto/customerUpdateDto';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MasterCustomer, MasterCustomerPlant } from './entity';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class MasterCustomerController {
  constructor(private service: MasterCustomerService) { }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [MasterCustomer], description: 'Get customer list.' })
  get() {
    return this.service.getList();
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: MasterCustomer, description: 'Get customer detail.' })
  getById(@Param('id') id) {
    return this.service.getById(id);
  }

  @Get('plant/:customerId')
  @ApiBearerAuth()
  @ApiParam({ name: 'customerId', type: String })
  @ApiResponse({ status: 200, type: MasterCustomerPlant, description: 'Get customer plant detail.' })
  getCustomer(@Param('customerId') customerId) {
    return this.service.getPlantList(customerId);
  }

  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() data: CustomerCreateDto) {
    try {

      this.service.checkCustomerPlantNameEmpty(data.plants);
      this.service.IsCustomerPlantNameAlreadyExist(data.plants);

      if (req.user) {
        _.each(data.plants, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        data.createByUserId = req.user.userId;
        data.createBy = req.user.fullName;
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;

        return this.service.create(data);
      }
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  
  }

  @ApiBearerAuth()
  @Put()
  update(@Request() req, @Body() data: CustomerUpdateDto) {
    try {
      
      this.service.checkCustomerPlantNameEmpty(data.plants);
      this.service.UpdateCustomerNameAlreadyExist(data.plants);

      if (req.user) {
        _.each(data.plants, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        data.createByUserId = req.user.userId;
        data.createBy = req.user.fullName;
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;
      }
  
      return this.service.update(data);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id) {
    return this.service.delete(id);
  }
}
