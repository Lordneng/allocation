import { Module } from '@nestjs/common';
import { FullCostManualsController } from './full-cost-manuals.controller';
import { DatabaseModule } from '../common/providers'
import { FullCostManualsProvider, FullCostManualsVersionProvider } from './full-costs-manuals.provider';
import { FullCostManualsService } from './full-cost-manuals.service'

@Module({
    imports: [DatabaseModule],
    controllers: [FullCostManualsController],
    providers: [...FullCostManualsProvider, ...FullCostManualsVersionProvider, FullCostManualsService],
    exports: [FullCostManualsService]
})
export class FullCostsManualsModule { }