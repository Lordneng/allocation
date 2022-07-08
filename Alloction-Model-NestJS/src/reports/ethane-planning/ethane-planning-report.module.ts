import { Module } from '@nestjs/common';
import { OptimizationsModule } from '../../optimization/optimizations.module';
import { AbilityPlanRayongModule } from '../../ability-plan/ability-plan-rayong/ability-plan-rayong.module';
import { DatabaseModule } from '../../common/providers';
import { EthanePlanningReportController } from './ethane-planning-report.controller';
import { EthanePlanningReportService } from './ethane-planning-report.service';


@Module({
    imports: [DatabaseModule,
        AbilityPlanRayongModule,
        OptimizationsModule
    ],
    controllers: [EthanePlanningReportController],
    providers: [EthanePlanningReportService],
    exports: [EthanePlanningReportService],
})
export class EthanePlanningReportModule { }