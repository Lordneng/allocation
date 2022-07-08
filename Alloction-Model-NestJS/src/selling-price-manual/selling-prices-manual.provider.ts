import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { SellingPricesManual } from './entity/selling-price-manual.entity';
import { SellingPricesManualVersion } from './entity/selling-price-manual-version.entity';

export const SellingPricesManualProvider = TypeORMProvider
    .create<SellingPricesManual>(TOKENS.ProjectRepositoryToken, SellingPricesManual);

export const SellingPricesManualVersionProvider = TypeORMProvider
    .create<SellingPricesManualVersion>(TOKENS.ProjectRepositoryTokenVersion, SellingPricesManualVersion);