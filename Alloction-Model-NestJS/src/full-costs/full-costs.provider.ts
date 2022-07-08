import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import { FullCost, FullCostVersion } from './entity'

export const FullCostsProvider = TypeORMProvider
    .create<FullCost>(TOKENS.ProjectRepositoryToken, FullCost);

export const FullCostVersionsProvider = TypeORMProvider
    .create<FullCostVersion>(TOKENS.ProjectRepositoryTokenVersion, FullCostVersion);
