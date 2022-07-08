import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterConditionOfSaleSmartPricePrice } from './entity/master-condition-of-sale-smart-price.entity';
import { OptimizationVolumnActual } from '../../optimization/entity';

export const MasterConditionOfSaleSmartPriceProvider = TypeORMProvider
    .create<MasterConditionOfSaleSmartPricePrice>(TOKENS.ProjectRepositoryToken, MasterConditionOfSaleSmartPricePrice,);

export const OptimizationVolumnActualProvider = TypeORMProvider
    .create<OptimizationVolumnActual>(TOKENS.ProjectRepositoryToken, OptimizationVolumnActual,);