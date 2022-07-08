import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterCostsSmartPriceController } from './master-costs-smart-price.controller';
import { masterCostsSmartPriceProvider } from './master-costs-smart-price.provider';
import { MasterCostsSmartPriceService } from './master-costs-smart-price.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterCostsSmartPriceController],
    providers: [...masterCostsSmartPriceProvider, MasterCostsSmartPriceService],
    exports: [MasterCostsSmartPriceService]
})
export class MasterCostsSmartPriceModule { }