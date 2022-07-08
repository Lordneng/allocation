import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { Margin } from './entity/margins.entity';
import { MarginVersion } from './entity/margins-version.entity';

export const MarginsProvider = TypeORMProvider
    .create<Margin>(TOKENS.ProjectRepositoryToken, Margin);
    
export const MarginVersionsProvider = TypeORMProvider
.create<MarginVersion>(TOKENS.ProjectRepositoryTokenVersion, MarginVersion);
