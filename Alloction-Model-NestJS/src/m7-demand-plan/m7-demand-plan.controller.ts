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
  import { M7DemandPlanService } from './m7-demand-plan.service'
  import { M7DemandPlanRequestDto } from './dto/m7DemandPlanRequestDto';
  import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
  
@UseGuards(JwtAuthGuard)
@Controller('m7-demand-plan')
export class M7DemandPlanController {
    constructor(private service: M7DemandPlanService) { }
  
    @ApiBearerAuth()
    @ApiQuery({ name: 'year', type: Number })
    @ApiQuery({ name: 'month', type: Number })
    @ApiQuery({ name: 'version', type: Number })
    @Get()
    get(@Query('year') year:number, @Query('month') month:number, @Query('version') version:number ) {
        const params : any = { year: year, month: month, version: version }
        return this.service.getList(params);
    }

    @ApiBearerAuth()
    @ApiQuery({ name: 'year', type: Number })
    @ApiQuery({ name: 'month', type: Number })
    @ApiQuery({ name: 'version', type: Number })

    @Get('manual')
    getDemandManual(@Query('year') year: number , @Query('month') month: number, @Query('version') version: number ) {
      const params : any = { year: year, month: month, version: version }
        return this.service.getManualList(params);
    }
  
    @ApiBearerAuth()
    @ApiQuery({ name: 'year', type: Number })
    @ApiQuery({ name: 'month', type: Number })
    @ApiQuery({ name: 'version', type: Number })
    @Get('value')
    getContractGen(@Query('year') year: number, @Query('month') month: number, @Query('version') version: number) {
      const params : any = { year: year, month: month, version: version }
        return this.service.getValueList(params);
    }
  
    @ApiBearerAuth()
    @Post()
    create(@Request() req, @Body() data: M7DemandPlanRequestDto) {
      try {
  
        this.service.checkDemandPlanEmpty(data.demandPlan);
        
        if (req.user) {
          _.each(data.demandPlan, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
    
          _.each(data.demandPlanManual, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
    
          _.each(data.demandPlan, (item) => {
            item.createByUserId = req.user.userId;
            item.createBy = req.user.fullName;
            item.updateByUserId = req.user.userId;
            item.updateBy = req.user.fullName;
          })
    
          data.version.createByUserId = req.user.userId;
          data.version.createBy = req.user.fullName;
          data.version.updateByUserId = req.user.userId;
          data.version.updateBy = req.user.fullName;
        }
        return this.service.saveTrans(data.demandPlan, data.demandPlanManual, data.demandPlanValue, data.version);
      } catch (error) {
        throw new HttpException(error.response, HttpStatus.NOT_FOUND);
      }
    }
  
    @ApiBearerAuth()
    @Put()
    update(@Request() req, @Body() data: M7DemandPlanRequestDto) {
      try {
  
        this.service.checkDemandPlanEmpty(data.demandPlan);
  
        if (req.user) {
            _.each(data.demandPlan, (item) => {
              item.updateByUserId = req.user.userId;
              item.updateBy = req.user.fullName;
            })
      
            _.each(data.demandPlanManual, (item) => {
              item.updateByUserId = req.user.userId;
              item.updateBy = req.user.fullName;
            })
      
            _.each(data.demandPlan, (item) => {
              item.updateByUserId = req.user.userId;
              item.updateBy = req.user.fullName;
            })
      
            data.version.updateByUserId = req.user.userId;
            data.version.updateBy = req.user.fullName;
          }

          return this.service.saveTrans(data.demandPlan, data.demandPlanManual, data.demandPlanValue, data.version);
      } catch (error) {
        throw new HttpException(error.response, HttpStatus.NOT_FOUND);
      }
    }
  
    @ApiBearerAuth()
    @Delete(':id')
    delete(@Param('id') id) {
      try {
        //this.service.checkValueBeforDelete(id);
        
        return this.service.delete(id);
      } catch (error) {
        throw new HttpException(error.response, HttpStatus.NOT_FOUND);
      }
    }

    @ApiBearerAuth()
    @Get('version')
    getMonthVersion(@Query('year') year: number,  @Query('month') month: number) {
      const params = { year: year, month: month }
      return this.service.getMonthVersion(params)
    }
}