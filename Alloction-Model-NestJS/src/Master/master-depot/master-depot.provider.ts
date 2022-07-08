import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterDepot } from './entity';

export const masterDepotsProvider = TypeORMProvider
    .create<MasterDepot>(TOKENS.ProjectRepositoryToken, MasterDepot);
