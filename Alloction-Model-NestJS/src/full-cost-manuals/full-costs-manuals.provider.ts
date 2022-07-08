import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import { FullCostManual } from './entity/full-cost-manual.entity'
import { FullCostManualVersion } from './entity/full-cost-manual-version.entity';

export const FullCostManualsProvider = TypeORMProvider
    .create<FullCostManual>(TOKENS.ProjectRepositoryTokenManual, FullCostManual);

export const FullCostManualsVersionProvider = TypeORMProvider
    .create<FullCostManualVersion>(TOKENS.ProjectRepositoryTokenVersion, FullCostManualVersion);