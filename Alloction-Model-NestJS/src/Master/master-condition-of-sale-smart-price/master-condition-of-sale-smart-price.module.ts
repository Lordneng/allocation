import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterConditionOfSaleSmartPriceController } from './master-condition-of-sale-smart-price.controller';
import { MasterConditionOfSaleSmartPriceService } from './master-condition-of-sale-smart-price.service';
import { MasterConditionOfSaleSmartPriceProvider, OptimizationVolumnActualProvider } from './master-condition-of-sale-smart-price.provider';
import { MasterContract } from '../master-contract/entity';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterConditionOfSaleSmartPriceController],
    providers: [...MasterConditionOfSaleSmartPriceProvider, ...OptimizationVolumnActualProvider, MasterConditionOfSaleSmartPriceService, MasterContract],
    exports: [MasterConditionOfSaleSmartPriceService, MasterContract],
})
export class MasterConditionOfSaleSmartPriceModule { }
