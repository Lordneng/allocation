import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterSourceDemandDeliveryController } from './master-source-demand-delivery.controller';
import { MasterSourceDemandDeliveryService } from './master-source-demand-delivery.service';
import { MasterSourceDemandDeliverysProvider } from './master-source-demand-delivery.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [MasterSourceDemandDeliveryController],
    providers: [...MasterSourceDemandDeliverysProvider ,MasterSourceDemandDeliveryService],
    exports: [MasterSourceDemandDeliveryService],
})
export class MasterSourceDemandDeliveryModule { }
