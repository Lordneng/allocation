import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterWorkInProcess } from './entity/master-work-in-process.entity';

export const masterWorkInProcessProvider = TypeORMProvider
    .create<MasterWorkInProcess>(TOKENS.ProjectRepositoryToken, MasterWorkInProcess);