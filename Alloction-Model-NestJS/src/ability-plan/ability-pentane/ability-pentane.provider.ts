import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { AbilityPentaneForm, AbilityPentaneVersion , AbilityPentane, AbilityPentaneHistory, AbilityPentaneFormHistory } from './entity';

export const AbilityPentaneProvider = TypeORMProvider
    .create<AbilityPentane>(TOKENS.ProjectRepositoryToken, AbilityPentane);

export const AbilityPentaneHistoryProvider = TypeORMProvider
    .create<AbilityPentaneHistory>(TOKENS.ProjectRepositoryTokenHistory, AbilityPentaneHistory);

export const AbilityPentaneVersionProvider = TypeORMProvider
    .create<AbilityPentaneVersion>(TOKENS.ProjectRepositoryTokenVersion, AbilityPentaneVersion);

export const AbilityPentaneFormProvider = TypeORMProvider
    .create<AbilityPentaneForm>(TOKENS.ProjectRepositoryTokenForm, AbilityPentaneForm);

export const AbilityPentaneFormHistoryProvider = TypeORMProvider
    .create<AbilityPentaneFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, AbilityPentaneFormHistory);
