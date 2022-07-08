import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { TankCapForm, TankCapVersion , TankCap, TankCapHistory, TankCapFormHistory } from './entity';

export const TankCapProvider = TypeORMProvider
    .create<TankCap>(TOKENS.ProjectRepositoryToken, TankCap);

export const TankCapHistoryProvider = TypeORMProvider
    .create<TankCapHistory>(TOKENS.ProjectRepositoryTokenHistory, TankCapHistory);

export const TankCapVersionProvider = TypeORMProvider
    .create<TankCapVersion>(TOKENS.ProjectRepositoryTokenVersion, TankCapVersion);

export const TankCapFormProvider = TypeORMProvider
    .create<TankCapForm>(TOKENS.ProjectRepositoryTokenForm, TankCapForm);

export const TankCapFormHistoryProvider = TypeORMProvider
    .create<TankCapFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, TankCapFormHistory);
