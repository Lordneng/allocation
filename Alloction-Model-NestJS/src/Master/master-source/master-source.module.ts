import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterSourceController } from './master-source.controller'
import { MasterSourceService } from './master-source.service'
import { masterContractsProvider } from './master-source.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterSourceController],
    providers: [...masterContractsProvider,MasterSourceService],
    exports: [MasterSourceService]
})
export class MasterSourceModule {}
