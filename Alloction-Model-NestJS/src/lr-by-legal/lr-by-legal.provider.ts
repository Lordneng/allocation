import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { LRByLegal, LRByLegalHistory } from './entity/lr-by-legal.entity';
import { LRByLegalVersion } from './entity/lr-by-legal-version.entity';
import { LRByLegalForm, LRByLegalFormHistory } from './entity/lr-by-legal-form.entity';

export const LRByLegalProvider = TypeORMProvider
    .create<LRByLegal>(TOKENS.ProjectRepositoryToken, LRByLegal);
export const LRByLegalHistoryProvider = TypeORMProvider
    .create<LRByLegalHistory>(TOKENS.ProjectRepositoryTokenHistory, LRByLegalHistory);

export const LRByLegalVersionProvider = TypeORMProvider
    .create<LRByLegalVersion>(TOKENS.ProjectRepositoryTokenVersion, LRByLegalVersion);

export const LRByLegalFormProvider = TypeORMProvider
    .create<LRByLegalForm>(TOKENS.ProjectRepositoryTokenForm, LRByLegalForm);
export const LRByLegalFormHistoryProvider = TypeORMProvider
    .create<LRByLegalFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, LRByLegalFormHistory);
