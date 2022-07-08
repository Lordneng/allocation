import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterPlantController } from './master-plant.controller'
import { MasterPlantService } from './master-plant.service'
import { masterContractsProvider } from './master-plant.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterPlantController],
    providers: [...masterContractsProvider, MasterPlantService],
    exports: [MasterPlantService]
})
export class MasterPlantModule { }
