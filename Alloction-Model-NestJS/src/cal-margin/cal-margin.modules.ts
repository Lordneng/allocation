import { Module } from '@nestjs/common';
import { MasterCostsModule } from '../Master/master-costs/master-costs.module';
import { MasterReferencePricesModule } from '../Master/master-reference-prices/master-reference-prices.module';
import { DatabaseModule } from '../common/providers';
import { CalMarginController } from './cal-margin.controller';
import { CalMarginVersionProvider, FullCostManualCallMarginProvider, SellingPriceManualCallMarginProvider, } from './cal-margin.provider';
import { CalMarginService } from './cal-margin.service';
import { CostsModule } from '../cost/costs.module';
import { ReferencePricesModule } from '../reference-prices/reference-prices.module';
import { MasterCostProductsTypesModule } from '../Master/master-product-cost-types/master-product-cost-types.module';

@Module({
    imports: [DatabaseModule,
        MasterCostsModule,
        MasterReferencePricesModule,
        MasterCostProductsTypesModule,
        CostsModule,
        ReferencePricesModule
    ],
    controllers: [CalMarginController],
    providers: [...SellingPriceManualCallMarginProvider, 
        ...FullCostManualCallMarginProvider,
        ...CalMarginVersionProvider,
        CalMarginService],
    exports: [CalMarginService],
})
export class CalMarginModule { }