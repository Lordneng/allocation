import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { CheckCreateTurnaroundDate } from './validateFillter/CheckCreateTurnaroundDate';
import { CheckUpdateTurnaroundDate } from './validateFillter/CheckUpdateTurnaroundDate';
import { MasterTurnaroundController } from './master-turnaround.controller';
import { MasterTurnaroundService } from './master-turnaround.service';
import { turnaroundProvider } from './master-turnaround.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MasterTurnaroundController],
  providers: [
    ...turnaroundProvider,
    CheckCreateTurnaroundDate,
    CheckUpdateTurnaroundDate,
    MasterTurnaroundService,
  ],
  exports: [MasterTurnaroundService],
})
export class MasterTurnaroundModule {}
