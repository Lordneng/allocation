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
import { SummaryReportService } from './summary-report.service';
  
// @UseGuards(JwtAuthGuard)
@Controller('summary-report')
export class SummaryReportController {
constructor(
  private service: SummaryReportService
  ) { }

  @Get()
  get(@Query('optimizationVersionId') optimizationVersionId: string) {
      
    return this.service.getList(optimizationVersionId);
  }
}