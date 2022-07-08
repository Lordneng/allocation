import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterRefinerysController } from './master-refinerys.controller';
import { masterRefinerysProvider } from './master-refinerys.provider';
import { MasterRefinerysService } from './master-refinerys.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterRefinerysController],
    providers: [...masterRefinerysProvider,MasterRefinerysService],
    exports: [MasterRefinerysService]
})
export class MasterRefineryModule {}