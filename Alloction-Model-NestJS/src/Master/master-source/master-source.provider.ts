import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterSource } from './entity/master-source.entity';

export const masterContractsProvider = TypeORMProvider
    .create<MasterSource>(TOKENS.ProjectRepositoryToken, MasterSource);