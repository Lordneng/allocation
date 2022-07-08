import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    UseGuards, 
    Request, 
    Query,
  } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import * as _ from 'lodash';
import { EthanePlanningReportService } from './ethane-planning-report.service';
  
@UseGuards(JwtAuthGuard)
@Controller('ethane-planning-report')
export class EthanePlanningReportController {
constructor(private service: EthanePlanningReportService) { }

    @Get()
    get(@Query('year') year: number, 
    @Query('month') month: number, 
    @Query('estimateVersionId') estimateVersionId: string, 
    @Query('planVersionId') planVersionId: string) {
        return this.service.getList(estimateVersionId, planVersionId, month, year);
    }
}