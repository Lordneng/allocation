import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { AbilityPlanKhmController } from './ability-plan-khm.controller';
import { AbilityPlanKhmService } from './ability-plan-khm.service';
import { AbilityPlanKhmProvider, AbilityPlanKhmVersionsProvider, AbilityPlanKhmManualsProvider, AbilityPlanKhmHistoryProvider, MasterAbilityPlanKhmProvider } from './ability-plan-khm.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [AbilityPlanKhmController],
    providers: [...AbilityPlanKhmProvider, 
        ...AbilityPlanKhmVersionsProvider, 
        ...AbilityPlanKhmManualsProvider, 
        ...AbilityPlanKhmHistoryProvider,
        ...MasterAbilityPlanKhmProvider,
        AbilityPlanKhmService],
    exports: [AbilityPlanKhmService],
})
export class AbilityPlanKhmModule { }
