import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterTierType  } from './entity';

export const masterTierTypeProvider = TypeORMProvider
    .create<MasterTierType>(TOKENS.ProjectRepositoryToken, MasterTierType);