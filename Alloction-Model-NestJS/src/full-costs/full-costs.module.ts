import { Module } from '@nestjs/common';
import { FullCostsController } from './full-costs.controller';
import { DatabaseModule } from '../common/providers'
import { FullCostsService } from './full-costs.service'
import { FullCostsProvider, FullCostVersionsProvider } from './full-costs.provider';
import { CostsModule } from '../cost/costs.module';
import { FullCostsManualsModule } from '../full-cost-manuals/full-cost-manuals.module';
import { MasterSourceDemandDeliveryModule } from '../Master/master-source-demand-delivery/master-source-demand-delivery.module';
import { ReferencePricesModule } from '../reference-prices/reference-prices.module';
import { AbilityPentaneModule } from '../ability-plan/ability-pentane/ability-pentane.module';


@Module({
    imports: [DatabaseModule, CostsModule, ReferencePricesModule, MasterSourceDemandDeliveryModule, FullCostsManualsModule, AbilityPentaneModule],
    controllers: [FullCostsController],
    providers: [...FullCostsProvider, ...FullCostVersionsProvider, FullCostsService],
    exports: [FullCostsService]
})
export class FullCostsModule { }
