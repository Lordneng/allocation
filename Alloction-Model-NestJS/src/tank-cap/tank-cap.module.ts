import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { TankCapController } from './tank-cap.controller';
import { TankCapService } from './tank-cap.service';
import { TankCapFormHistoryProvider, TankCapFormProvider, TankCapHistoryProvider, TankCapProvider, TankCapVersionProvider } from './tank-cap.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [TankCapController],
    providers: [...TankCapProvider, 
        ...TankCapVersionProvider,
        ...TankCapFormProvider,
        ...TankCapHistoryProvider,
        ...TankCapFormHistoryProvider,
        TankCapService],
    exports: [TankCapService],
})
export class TankCapModule { }
