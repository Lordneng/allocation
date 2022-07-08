import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { InventoryBalance, InventoryMovement } from './entity';

export const inventoryBalanceProvider = TypeORMProvider
    .create<InventoryBalance>(TOKENS.ProjectRepositoryToken, InventoryBalance);

    export const inventoryMovementProvider = TypeORMProvider
    .create<InventoryMovement>(TOKENS.ProjectRepositoryTokenNew, InventoryMovement);