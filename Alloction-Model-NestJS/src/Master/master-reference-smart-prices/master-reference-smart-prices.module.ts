import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterReferenceSmartPricesController } from './master-reference-smart-prices.controller';
import { MasterReferenceSmartPricesService } from './master-reference-smart-prices.service';
import { MasterReferenceSmartPricesProvider } from './master-reference-smart-prices.provider';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterReferenceSmartPricesController],
    providers: [...MasterReferenceSmartPricesProvider ,MasterReferenceSmartPricesService],
    exports:[MasterReferenceSmartPricesService],
})
export class MasterReferenceSmartPricesModule { }
