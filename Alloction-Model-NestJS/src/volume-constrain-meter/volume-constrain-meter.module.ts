import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { VolumeConstrainMeterController } from './volume-constrain-meter.controller';
import { VolumeConstrainMeterService } from './volume-constrain-meter.service';
import { VolumeConstrainMeterProvider, VolumeConstrainMeterVersionProvider, VolumeConstrainMeterFormProvider, VolumeConstrainMeterFormHistoryProvider, VolumeConstrainMeterHistoryProvider } from './volume-constrain-meter.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [VolumeConstrainMeterController],
    providers: [...VolumeConstrainMeterProvider, ...VolumeConstrainMeterVersionProvider, ...VolumeConstrainMeterFormProvider,...VolumeConstrainMeterFormHistoryProvider,...VolumeConstrainMeterHistoryProvider, VolumeConstrainMeterService],
    exports: [VolumeConstrainMeterService],
})
export class VolumeConstrainMeterModule { }
