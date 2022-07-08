import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { AbilityPentaneController } from './ability-pentane.controller';
import { AbilityPentaneService } from './ability-pentane.service';
import { AbilityPentaneFormHistoryProvider, AbilityPentaneFormProvider, AbilityPentaneHistoryProvider, AbilityPentaneProvider, AbilityPentaneVersionProvider } from './ability-pentane.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [AbilityPentaneController],
    providers: [...AbilityPentaneProvider, 
        ...AbilityPentaneVersionProvider,
        ...AbilityPentaneFormProvider,
        ...AbilityPentaneHistoryProvider,
        ...AbilityPentaneFormHistoryProvider,
        AbilityPentaneService],
    exports: [AbilityPentaneService],
})
export class AbilityPentaneModule { }
