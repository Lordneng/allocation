import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterCustomerController } from './master-customer.controller'
import { MasterCustomerService } from './master-customer.service'
import { masterCustomerProvider, masterCustomerPlantProvider } from './master-customer.provider'
import { IsCustomerCodeAlreadyExist } from './validateFillter/IsCustomerCodeAlreadyExist'
import { IsCustomerNameAlreadyExist } from './validateFillter/IsCustomerNameAlreadyExist'
import { IsCustomerPlantNameAlreadyExist } from './validateFillter/IsCustomerPlantNameAlreadyExist'
import { UpdateCustomerCodeAlreadyExist } from './validateFillter/UpdateCustomerCodeAlreadyExist'
import { UpdateCustomerNameAlreadyExist } from './validateFillter/UpdateCustomerNameAlreadyExist'
import { UpdateCustomerPlantNameAlreadyExist } from './validateFillter/UpdateCustomerPlantNameAlreadyExist'
import { IsCustomerIdAlreadyExist } from './validateFillter/IsCustomerIdAlreadyExist'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterCustomerController],
    providers: [...masterCustomerProvider, 
        ...masterCustomerPlantProvider, 
        IsCustomerIdAlreadyExist,
        IsCustomerCodeAlreadyExist,
        IsCustomerNameAlreadyExist,
        IsCustomerPlantNameAlreadyExist,
        UpdateCustomerCodeAlreadyExist,
        UpdateCustomerNameAlreadyExist,
        UpdateCustomerPlantNameAlreadyExist,
        MasterCustomerService],
    exports: [MasterCustomerService]
})
export class MasterCustomerModule { }
