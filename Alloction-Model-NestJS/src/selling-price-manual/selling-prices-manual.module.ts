import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { SellingPricesManualController } from './selling-prices-manual.controller';
import { SellingPricesManualService } from './selling-prices-manual.service';
import { SellingPricesManualProvider, SellingPricesManualVersionProvider } from './selling-prices-manual.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [SellingPricesManualController],
    providers: [...SellingPricesManualProvider, ...SellingPricesManualVersionProvider , SellingPricesManualService],
    exports: [SellingPricesManualService],
})
export class SellingPricesManualModule { }