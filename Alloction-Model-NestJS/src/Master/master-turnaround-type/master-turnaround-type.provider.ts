import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterTurnaroundType  } from './entity';

export const masterTurnaroundTypeProvider = TypeORMProvider
    .create<MasterTurnaroundType>(TOKENS.ProjectRepositoryToken, MasterTurnaroundType);