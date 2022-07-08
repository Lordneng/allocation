import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { M7DemandPlanController } from './m7-demand-plan.controller';
import { M7DemandPlanProvider, M7DemandPlanVersionProvider, M7DemandValueManualProvider, M7DemandValueProvider } from './m7-demand-plan.provider';
import { M7DemandPlanService } from './m7-demand-plan.service';

@Module({
    imports: [DatabaseModule],
    controllers: [M7DemandPlanController],
    providers: [...M7DemandPlanProvider,
    ...M7DemandValueManualProvider,
    ...M7DemandValueProvider,
    ...M7DemandPlanVersionProvider,
    M7DemandPlanService
    ],
    exports: [M7DemandPlanService]
})

export class M7DemandPlanModule { }