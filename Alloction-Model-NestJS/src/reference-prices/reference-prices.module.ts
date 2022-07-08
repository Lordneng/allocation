import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { ReferencePricesController } from './reference-prices.controller';
import { ReferencePricesService } from './reference-prices.service';
import { ReferencePriceProvider, ReferenceVersionProvider,ReferenceManualProvider, ReferenceActualProvider } from './reference-prices.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [ReferencePricesController],
    providers: [...ReferencePriceProvider, ...ReferenceVersionProvider, ...ReferenceManualProvider, ...ReferenceActualProvider , ReferencePricesService],
    exports: [ReferencePricesService],
})
export class ReferencePricesModule { }
