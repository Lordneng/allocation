import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterContractController } from './master-contract-type.controller';
import { masterContractTypeProvider } from './master-contract-type.provider';
import { MasterContractTypeService } from './master-contract-type.service';



@Module({
    imports: [DatabaseModule],
    controllers: [MasterContractController],
    providers: [...masterContractTypeProvider ,MasterContractTypeService],
    exports:[MasterContractTypeService]
})
export class MasterContractTypeModule {}