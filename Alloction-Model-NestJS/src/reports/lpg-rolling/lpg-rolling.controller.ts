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
import { LpgRollingReportService } from './lpg-rolling.service';
  

@Controller('lpg-rolling-report')
export class LpgRollingReportController {
constructor(private service: LpgRollingReportService) { }
  @Get()
  get(@Query('optimizationVersionId') optimizationVersionId: string) {
      return this.service.getList(optimizationVersionId);
  }
}