import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterUnitController } from './master-unit.controller'
import { MasterUnitService } from './master-unit.service'
import { masterUnitsProvider } from './master-unit.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterUnitController],
    providers: [...masterUnitsProvider, MasterUnitService],
    exports: [MasterUnitService]
})
export class MasterUnitModule { }
