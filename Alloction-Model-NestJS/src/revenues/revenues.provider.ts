import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { Revenue } from './entity/revenues.entity';
import { RevenueVersion } from './entity/revenues-version.entity';

export const RevenueProvider = TypeORMProvider
    .create<Revenue>(TOKENS.ProjectRepositoryToken, Revenue);

export const RevenueVersionProvider = TypeORMProvider
    .create<RevenueVersion>(TOKENS.ProjectRepositoryTokenVersion, RevenueVersion);
