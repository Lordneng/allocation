import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterCostSmartPrice } from './entity/master-cost-smart-price.entity';

export const masterCostsSmartPriceProvider = TypeORMProvider
    .create<MasterCostSmartPrice>(TOKENS.ProjectRepositoryToken, MasterCostSmartPrice);
