import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { InventoryControlController } from './inventory-control.controller';
import { inventoryMovementProvider, inventoryBalanceProvider } from './inventory-control.provider';
import { InventoryControlService } from './inventory-control.service';


@Module({
    imports: [DatabaseModule],
    controllers: [InventoryControlController],
    providers: [...inventoryMovementProvider, ...inventoryBalanceProvider, InventoryControlService],
    exports: [InventoryControlService]
})

export class InventoryControlModule { }