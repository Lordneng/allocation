import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterCostProductTypes } from './entity/master-product-cost-types.entity';

export const masterProductsProvider = TypeORMProvider
    .create<MasterCostProductTypes>(TOKENS.ProjectRepositoryToken,MasterCostProductTypes);
