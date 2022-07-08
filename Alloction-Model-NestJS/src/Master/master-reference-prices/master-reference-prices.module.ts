import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterReferencePricesController } from './master-reference-prices.controller';
import { MasterReferencePricesService } from './master-reference-prices.service';
import { MasterReferencePricesProvider } from './master-reference-prices.provider';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterReferencePricesController],
    providers: [...MasterReferencePricesProvider ,MasterReferencePricesService],
    exports:[MasterReferencePricesService],
})
export class MasterReferencePricesModule { }
