import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterDeliveryPointController } from './master-delivery-point.controller'
import { MasterDeliveryPointService } from './master-delivery-point.service'
import { masterContractsProvider } from './master-delivery-point.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterDeliveryPointController],
    providers: [...masterContractsProvider,MasterDeliveryPointService],
    exports: [MasterDeliveryPointService]
})
export class MasterDeliveryPointModule {}
