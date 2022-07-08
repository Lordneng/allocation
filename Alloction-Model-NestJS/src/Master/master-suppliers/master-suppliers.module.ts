import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterSupplierController } from './master-suppliers.controller'
import { MasterSupplierService } from './master-suppliers.service'
import { masterSupplierProvider } from './master-suppliers.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterSupplierController],
    providers: [...masterSupplierProvider, MasterSupplierService],
    exports: [MasterSupplierService]
})
export class MasterSupplierModule { }