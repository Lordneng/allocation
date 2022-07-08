import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterTurnaroundController } from './master-turnaround-type.controller';
import { masterTurnaroundTypeProvider } from './master-turnaround-type.provider';
import { MasterTurnaroundTypeService } from './master-turnaround-type.service';



@Module({
    imports: [DatabaseModule],
    controllers: [MasterTurnaroundController],
    providers: [...masterTurnaroundTypeProvider ,MasterTurnaroundTypeService],
    exports:[MasterTurnaroundTypeService]
})
export class MasterTurnaroundTypeModule {}