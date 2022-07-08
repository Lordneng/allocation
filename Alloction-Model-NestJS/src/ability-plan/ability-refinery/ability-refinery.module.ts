import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { AbilityRefineryController } from './ability-refinery.controller';
import { AbilityRefineryService } from './ability-refinery.service';
import { AbilityRefineryProvider, AbilityRefineryVersionProvider, AbilityRefineryFormProvider, AbilityRefineryNewProvider, AbilityRefineryHistoryProvider } from './ability-refinery.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [AbilityRefineryController],
    providers: [...AbilityRefineryProvider, 
        ...AbilityRefineryFormProvider,
        ...AbilityRefineryVersionProvider,
        ...AbilityRefineryNewProvider, 
        ...AbilityRefineryHistoryProvider,
        AbilityRefineryService
    ],
    exports: [AbilityRefineryService],
})
export class AbilityRefineryModule { }
