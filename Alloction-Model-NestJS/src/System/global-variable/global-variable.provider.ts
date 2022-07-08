import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { GlobalVariable } from './entity/global-variable.entity';

export const GlobalVariableProvider = TypeORMProvider
    .create<GlobalVariable>(TOKENS.ProjectRepositoryToken, GlobalVariable);