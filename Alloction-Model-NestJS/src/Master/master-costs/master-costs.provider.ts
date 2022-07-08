import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterCost } from './entity/master-cost.entity';

export const masterCostsProvider = TypeORMProvider
    .create<MasterCost>(TOKENS.ProjectRepositoryToken,MasterCost);
