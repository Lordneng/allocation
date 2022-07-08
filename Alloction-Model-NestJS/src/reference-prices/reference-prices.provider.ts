import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import { ReferencePrice } from './entity/reference-prices.entity'
import { ReferencePriceVersion } from './entity/reference-prices-version.entity'
import { ReferencePriceManual } from './entity/reference-prices-manual.entity'
import { ReferencePriceActual } from './entity'

export const ReferencePriceProvider = TypeORMProvider
    .create<ReferencePrice>(TOKENS.ProjectRepositoryToken, ReferencePrice);

export const ReferenceVersionProvider = TypeORMProvider
    .create<ReferencePriceVersion>(TOKENS.ProjectRepositoryTokenVersion, ReferencePriceVersion);

export const ReferenceManualProvider = TypeORMProvider
    .create<ReferencePriceManual>(TOKENS.ProjectRepositoryTokenManual, ReferencePriceManual);

export const ReferenceActualProvider = TypeORMProvider
    .create<ReferencePriceActual>(TOKENS.ProjectRepositoryTokenActual, ReferencePriceActual);

