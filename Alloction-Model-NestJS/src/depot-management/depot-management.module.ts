import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { DepotManagementMeterController } from './depot-management.controller';
import { DepotManagementMeterService } from './depot-management.service';
import { DepotManagementMeterProvider, DepotManagementMeterVersionProvider, DepotManagementMeterFormProvider, DepotManagementMeterFormHistoryProvider, DepotManagementMeterHistoryProvider } from './depot-management.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [DepotManagementMeterController],
    providers: [...DepotManagementMeterProvider, ...DepotManagementMeterVersionProvider, ...DepotManagementMeterFormProvider,...DepotManagementMeterFormHistoryProvider,...DepotManagementMeterHistoryProvider, DepotManagementMeterService],
    exports: [DepotManagementMeterService],
})
export class DepotManagementMeterModule { }
