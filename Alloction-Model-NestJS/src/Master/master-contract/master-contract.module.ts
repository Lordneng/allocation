import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterContractController } from './master-contract.controller'
import { MasterContractService } from './master-contract.service'
import { contractConditionOfSalesProvider, 
    contractCustomerPlantsProvider, 
    contractCustomerProductGradesProvider, 
    contractRunningNumberProvider, 
    contractsProvider, 
    masterContractsProvider 
} from './master-contract.provider'
import { CheckCreateContractDate } from './validateFillter/CheckCreateContractDate'
import { CheckUpdateContractDate } from './validateFillter/CheckUpdateContractDate'
import { UpdateContractCodeAlreadyExist } from './validateFillter/UpdateContractCodeAlreadyExist'
import { IsSubstituedProductNameNull } from './validateFillter/IsSubstituedProductNameNull'
import { IsSubstituedProductRateNull } from './validateFillter/IsSubstituedProductRateNull'
import { IsSupplierNameNull } from './validateFillter/IsSupplierNameNull'
import { IsTierMaxVolumnNull } from './validateFillter/IsTierMaxVolumnNull'
import { IsTierMinVolumnNull } from './validateFillter/IsTierMinVolumnNull'
import { IsTierTypeNull } from './validateFillter/IsTierTypeNull'
import { IsUnitNull } from './validateFillter/IsUnitNull'
import { IsContractCodeAlreadyExist } from './validateFillter/IsContractCodeAlready'
import { CheckContractAlreadyExist } from './validateFillter/CheckContractAlreadyExist'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterContractController],
    providers: [...masterContractsProvider,
        ...contractConditionOfSalesProvider,
        ...contractsProvider,
        ...contractCustomerPlantsProvider,
        ...contractCustomerProductGradesProvider,
        ...contractRunningNumberProvider,
        CheckContractAlreadyExist,
        CheckCreateContractDate,
        CheckUpdateContractDate,
        UpdateContractCodeAlreadyExist,
        IsContractCodeAlreadyExist,
        IsSubstituedProductNameNull,
        IsSubstituedProductRateNull,
        IsSupplierNameNull,
        IsTierMaxVolumnNull,
        IsTierMinVolumnNull,
        IsTierTypeNull,
        IsUnitNull,
        MasterContractService],
    exports: [MasterContractService]
})
export class MasterContractModule {}
