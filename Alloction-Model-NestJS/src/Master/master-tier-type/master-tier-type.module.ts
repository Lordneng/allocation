import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterTierTypeController  } from './master-tier-type.controller';
import { masterTierTypeProvider } from './master-tier-type.provider';
import { MasterTierTypeService } from './master-tier-type.service';



@Module({
    imports: [DatabaseModule],
    controllers: [MasterTierTypeController],
    providers: [...masterTierTypeProvider , MasterTierTypeService],
    exports:[MasterTierTypeService]
})
export class MasterTierTypeModule {}