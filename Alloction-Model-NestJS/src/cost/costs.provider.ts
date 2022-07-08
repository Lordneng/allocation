import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import { Cost } from './entity/cost.entity'
import { CostVersion } from './entity/cost-version.entity'
import { CostManual, CostActual } from './entity';



export const costsProvider = TypeORMProvider
    .create<Cost>(TOKENS.ProjectRepositoryToken, Cost);

export const costVersionsProvider = TypeORMProvider
    .create<CostVersion>(TOKENS.ProjectRepositoryTokenVersion, CostVersion);

export const costManualsProvider = TypeORMProvider
    .create<CostManual>(TOKENS.ProjectRepositoryTokenManual, CostManual);

export const costActualProvider = TypeORMProvider
    .create<CostActual>(TOKENS.ProjectRepositoryTokenActual, CostActual);