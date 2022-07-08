import { Module } from '@nestjs/common';
import { OptimizationsModule } from '../../optimization/optimizations.module';
import { AbilityPlanRayongModule } from '../../ability-plan/ability-plan-rayong/ability-plan-rayong.module';
import { DatabaseModule } from '../../common/providers';
import { LpgRollingReportController } from './lpg-rolling.controller';
import { LpgRollingReportService } from './lpg-rolling.service';
import { AbilityPlanKhmModule } from '../../ability-plan/ability-plan-khm/ability-plan-khm.module';
import { AbilityRefineryModule } from '../../ability-plan/ability-refinery/ability-refinery.module';
import { AbilityPentaneModule } from '../../ability-plan/ability-pentane/ability-pentane.module';


@Module({
    imports: [DatabaseModule,
        AbilityPlanRayongModule,
        AbilityPlanKhmModule,
        AbilityRefineryModule,
        AbilityPentaneModule,
        OptimizationsModule
    ],
    controllers: [LpgRollingReportController],
    providers: [LpgRollingReportService],
    exports: [LpgRollingReportService],
})
export class LpgRollingReportModule { }