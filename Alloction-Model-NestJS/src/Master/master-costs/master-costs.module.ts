import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterCostsController } from './master-costs.controller';
import { masterCostsProvider } from './master-costs.provider';
import { MasterCostsService } from './master-costs.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterCostsController],
    providers: [...masterCostsProvider ,MasterCostsService],
    exports:[MasterCostsService]
})
export class MasterCostsModule {}