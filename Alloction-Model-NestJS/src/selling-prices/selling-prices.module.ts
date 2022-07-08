import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { SellingPricesController } from './selling-prices.controller';
import { SellingPricesService } from './selling-prices.service';
import { CostsModule } from '../cost/costs.module';
//import { FullCostManualsModule } from '../full-cost-manuals/full-cost-manuals.module';
import { MasterSourceDemandDeliveryModule } from '../Master/master-source-demand-delivery/master-source-demand-delivery.module';
import { ReferencePricesModule } from '../reference-prices/reference-prices.module';
import { SellingPriceProvider, SellingPriceVersionProvider } from './selling-prices.provider';
import { AbilityPentaneModule } from '../ability-plan/ability-pentane/ability-pentane.module';

@Module({
    imports: [DatabaseModule, CostsModule, ReferencePricesModule, MasterSourceDemandDeliveryModule, AbilityPentaneModule],
    controllers: [SellingPricesController],
    providers: [...SellingPriceProvider, ...SellingPriceVersionProvider, SellingPricesService],
    exports: [SellingPricesService],
})
export class SellingPricesModule { }
