import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { VolumesController } from './volumes.controller';
import { VolumesService } from './volumes.service';
import { VolumesProvider, VolumeVersionsProvider } from './volumes.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [VolumesController],
    providers: [...VolumesProvider, ...VolumeVersionsProvider , VolumesService],
    exports: [VolumesService],
})
export class VolumesModule { }
