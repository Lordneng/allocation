import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterWorkInProcessController } from './master-work-in-process.controller';
import { MasterWorkInProcessService } from './master-work-in-process.service';
import { masterWorkInProcessProvider } from './master-work-in-process.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterWorkInProcessController],
    providers: [...masterWorkInProcessProvider, MasterWorkInProcessService],
    exports: [MasterWorkInProcessService]
})
export class MasterWorkInProcessModule {}