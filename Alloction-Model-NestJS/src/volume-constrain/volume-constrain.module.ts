import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { VolumeConstrainController } from './volume-constrain.controller';
import { VolumeConstrainService } from './volume-constrain.service';
import { VolumeConstrainProvider, VolumeConstrainVersionProvider, VolumeConstrainFormProvider } from './volume-constrain.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [VolumeConstrainController],
    providers: [...VolumeConstrainProvider, ...VolumeConstrainVersionProvider, ...VolumeConstrainFormProvider , VolumeConstrainService],
    exports: [VolumeConstrainService],
})
export class VolumeConstrainModule { }
