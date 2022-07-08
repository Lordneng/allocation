import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { 
    AbilityRefineryForm, 
    AbilityRefineryNew, 
    AbilityRefineryVersion, 
    AbilityRefinery, 
    AbilityRefineryHistory
} from './entity';

export const AbilityRefineryProvider = TypeORMProvider
    .create<AbilityRefinery>(TOKENS.ProjectRepositoryToken, AbilityRefinery);

export const AbilityRefineryVersionProvider = TypeORMProvider
    .create<AbilityRefineryVersion>(TOKENS.ProjectRepositoryTokenVersion, AbilityRefineryVersion);

export const AbilityRefineryNewProvider = TypeORMProvider
    .create<AbilityRefineryNew>(TOKENS.ProjectRepositoryTokenNew, AbilityRefineryNew);

export const AbilityRefineryFormProvider = TypeORMProvider
    .create<AbilityRefineryForm>(TOKENS.ProjectRepositoryTokenForm, AbilityRefineryForm);

export const AbilityRefineryHistoryProvider = TypeORMProvider
    .create<AbilityRefineryHistory>(TOKENS.ProjectRepositoryTokenHistory, AbilityRefineryHistory);