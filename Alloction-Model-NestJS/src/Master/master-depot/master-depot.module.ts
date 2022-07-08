import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterDepotController } from './master-depot.controller';
import { MasterDepotService } from './master-depot.service';
import { masterDepotsProvider } from './master-depot.provider';
// import { MasterProductSchema } from './schema/master-product.schema';

@Module({
    imports: [DatabaseModule],
    controllers: [MasterDepotController],
    providers: [...masterDepotsProvider,
        MasterDepotService],
    exports:[MasterDepotService],
})
export class MasterDepotModule {}