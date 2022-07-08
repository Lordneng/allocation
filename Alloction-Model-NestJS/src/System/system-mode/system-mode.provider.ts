import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { SystemMode } from './entity';

export const SystemModeProvider = TypeORMProvider
    .create<SystemMode>(TOKENS.ProjectSystemModeRepositoryToken, SystemMode);