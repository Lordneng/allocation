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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { MasterContractService } from './master-contract.service'
import { ContractCreateDto } from './dto/contractCreateDto';
import { ContractUpdateDto } from './dto/contractUpdateDto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Contract, ContractConditionOfSale, ContractCustomerPlant, ContractCustomerProductGrade } from './entity';

@UseGuards(JwtAuthGuard)
@Controller('contract')
export class MasterContractController {
  constructor(private service: MasterContractService) { }

  @Get()
  get(@Query('year') year, @Query('customerId') customerId, @Query('productId') productId) {
    const params : any = { year: year, customerId: customerId, productId: productId}
    return this.service.getList(params);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Contract, description: 'Get contract detail.' })
  getById(@Param('id') id) {
    return this.service.getById(id);
  }

  @Get('plant/:contractId')
  @ApiBearerAuth()
  @ApiParam({ name: 'contractId', type: String })
  @ApiResponse({ status: 200, type: [ContractCustomerPlant], description: 'Get contract customer plant detail.' })
  getContractCustomerPlant(@Param('contractId') contractId) {
    return this.service.getCustomerPlantList(contractId);
  }

  @Get('gen/:year/:month')
  @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: [ContractCustomerPlant], description: 'Get contract gen product detail.' })
  getContractGen(@Param('year') year: number, @Param('month') month: number) {
    return this.service.getGen(month, year);
  }

  @Get('genM7/:year/:month')
  @ApiBearerAuth()
  // @ApiResponse({ status: 200, type: [ContractCustomerPlant], description: 'Get contract gen product detail.' })
  getContractGenM7(@Param('year') year: number, @Param('month') month: number) {
    return this.service.getGenM7(month, year);
  }

  @Post('cal-margin')
  @ApiBearerAuth()
  getCalmarginContract(){
    return this.service.listCalMarginData();
  }

  @Get('condition/:contractId')
  @ApiBearerAuth()
  @ApiParam({ name: 'contractId', type: String })
  @ApiResponse({ status: 200, type: [ContractConditionOfSale], description: 'Get contract condition of sale detail.' })
  getContractCustomerConditionOfSale(@Param('contractId') contractId) {
    return this.service.getCustomerConditionOfSaleList(contractId);
  }

  @Get('grade/:contractId')
  @ApiBearerAuth()
  @ApiParam({ name: 'contractId', type: String })
  @ApiResponse({ status: 200, type: [ContractCustomerProductGrade], description: 'Get contract customer product grade detail.' })
  getContractCustomerProductGrade(@Param('contractId') contractId) {
    return this.service.getCustomerProductGradeList(contractId);
  }

  @Post()
  @ApiBearerAuth()
  create(@Request() req, @Body() data: ContractCreateDto) {
    try {

      this.service.checkCustomerPlantEmpty(data.customerPlants);
      
      if (req.user) {
        _.each(data.customerPlants, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        _.each(data.customerProductGrades, (item) => {
          item.createByUserId = req.user.userId;
          item.createBy = req.user.fullName;
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        _.each(data.customerConditions, (item) => {
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
      return this.service.create(data);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  }


  @Put()
  @ApiBearerAuth()
  update(@Request() req, @Body() data: ContractUpdateDto) {
    try {

      this.service.checkCustomerPlantEmpty(data.customerPlants);

      if (req.user) {
        _.each(data.customerPlants, (item) => {
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        _.each(data.customerProductGrades, (item) => {
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        _.each(data.customerConditions, (item) => {
          item.updateByUserId = req.user.userId;
          item.updateBy = req.user.fullName;
        })
  
        data.updateByUserId = req.user.userId;
        data.updateBy = req.user.fullName;
      }
      return this.service.update(data);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  delete(@Param('id') id) {
    try {
      this.service.checkValueBeforDelete(id);
      
      return this.service.delete(id);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND);
    }
  }
}
