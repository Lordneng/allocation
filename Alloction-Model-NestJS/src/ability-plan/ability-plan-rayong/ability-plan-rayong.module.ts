import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { AbilityPlanRayongController } from './ability-plan-rayong.controller';
import { AbilityPlanRayongService } from './ability-plan-rayong.service';
import { AbilityPlanRayongDailyProvider, AbilityPlanRayongMasterProvider, AbilityPlanRayongProvider, 
    AbilityPlanRayongVersionProvider, 
 } from './ability-plan-rayong.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [AbilityPlanRayongController],
    providers: [...AbilityPlanRayongProvider, 
        ...AbilityPlanRayongVersionProvider, 
        ...AbilityPlanRayongDailyProvider,
        ...AbilityPlanRayongMasterProvider,
        AbilityPlanRayongService],
    exports: [AbilityPlanRayongService],
})
export class AbilityPlanRayongModule { }
