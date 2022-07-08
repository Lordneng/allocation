import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { MarginsController } from './margins.controller';
import { MarginsService } from './margins.service';
import { MarginsProvider, MarginVersionsProvider } from './margins.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [MarginsController],
    providers: [...MarginsProvider, ...MarginVersionsProvider , MarginsService],
    exports: [MarginsService],
})
export class MarginsModule { }
