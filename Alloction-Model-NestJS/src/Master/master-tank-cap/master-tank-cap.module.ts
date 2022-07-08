import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterTankCapController } from './master-tank-cap.controller';
import { masterTankCapProvider } from './master-tank-cap.provider';
import { MasterTankCapService } from './master-tank-cap.service';


@Module({
    imports: [DatabaseModule],
    controllers: [MasterTankCapController],
    providers: [...masterTankCapProvider ,MasterTankCapService],
    exports:[MasterTankCapService]
})
export class MasterTankCapModule {}