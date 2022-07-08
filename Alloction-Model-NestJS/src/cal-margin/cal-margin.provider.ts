import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'

import { CalMarginVersion } from './entity/cal-margin-version.entity';
import { SellingPricesManual } from '../selling-price-manual/entity';
import { FullCostManual } from '../full-cost-manuals/entity';

export const SellingPriceManualCallMarginProvider = TypeORMProvider
    .create<SellingPricesManual>(TOKENS.ProjectRepositoryTokenNew, SellingPricesManual);

export const FullCostManualCallMarginProvider = TypeORMProvider
    .create<FullCostManual>(TOKENS.ProjectRepositoryTokenForm, FullCostManual);

export const CalMarginVersionProvider = TypeORMProvider
    .create<CalMarginVersion>(TOKENS.ProjectRepositoryTokenVersion, CalMarginVersion);