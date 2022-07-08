import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterContractType  } from './entity';

export const masterContractTypeProvider = TypeORMProvider
    .create<MasterContractType>(TOKENS.ProjectRepositoryToken, MasterContractType);