import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterConditionOfSaleController } from './master-condition-of-sale.controller';
import { masterConditionOfSaleProvider } from './master-condition-of-sale.provider';
import { MasterConditionOfSaleService } from './master-condition-of-sale.service';




@Module({
    imports: [DatabaseModule],
    controllers: [MasterConditionOfSaleController],
    providers: [...masterConditionOfSaleProvider , MasterConditionOfSaleService],
    exports:[MasterConditionOfSaleService]
})
export class MasterConditionOfSaleModule {}