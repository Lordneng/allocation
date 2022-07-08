import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterConditionOfSale  } from './entity';

export const masterConditionOfSaleProvider = TypeORMProvider
    .create<MasterConditionOfSale>(TOKENS.ProjectRepositoryToken, MasterConditionOfSale);