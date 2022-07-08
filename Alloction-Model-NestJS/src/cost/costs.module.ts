import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers'
import { CostsController } from './costs.controller'
import { CostsService } from './costs.service'
import { costActualProvider, costManualsProvider, costsProvider, costVersionsProvider } from './costs.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [CostsController],
    providers: [...costsProvider, ...costVersionsProvider, ...costManualsProvider, ...costActualProvider, CostsService],
    exports: [CostsService]
})
export class CostsModule { }
