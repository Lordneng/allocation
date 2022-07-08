import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { MarginPerUnit } from './entity/margin-per-units.entity';
import { MarginPerUnitVersion } from './entity/margin-per-units-version.entity';

export const MarginPerUnitProvider = TypeORMProvider
    .create<MarginPerUnit>(TOKENS.ProjectRepositoryToken, MarginPerUnit);

export const MarginPerUnitVersionProvider = TypeORMProvider
    .create<MarginPerUnitVersion>(TOKENS.ProjectRepositoryTokenVersion, MarginPerUnitVersion);
