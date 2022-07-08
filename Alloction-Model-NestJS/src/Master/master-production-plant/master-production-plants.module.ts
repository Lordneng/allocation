import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterProductionPlantsController } from './master-production-plants.controller';
import { masterProductionPlantsProvider } from './master-production-plants.provider';
import { MasterProductionPlantsService } from './master-production-plants.service';

@Module({
    imports: [DatabaseModule],
    controllers: [MasterProductionPlantsController],
    providers: [...masterProductionPlantsProvider,MasterProductionPlantsService],
    exports: [MasterProductionPlantsService]
})
export class MasterProductionPlantsModule {}