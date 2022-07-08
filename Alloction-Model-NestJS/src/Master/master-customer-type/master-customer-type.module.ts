import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterCustomerTypeController } from './master-customer-type.controller';
import { masterCustomerTypeProvider } from './master-customer-type.provider';
import { MasterCustomerTypeService } from './master-customer-type.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterCustomerTypeController],
    providers: [...masterCustomerTypeProvider, MasterCustomerTypeService],
    exports: [MasterCustomerTypeService]
})
export class MasterCustomerTypeModule {}