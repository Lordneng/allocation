import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { SellingPrice } from './entity/selling-prices.entity';
import { SellingPriceVersion } from './entity/selling-prices-version.entity';

export const SellingPriceProvider = TypeORMProvider
    .create<SellingPrice>(TOKENS.ProjectRepositoryToken, SellingPrice);

export const SellingPriceVersionProvider = TypeORMProvider
    .create<SellingPriceVersion>(TOKENS.ProjectRepositoryTokenVersion, SellingPriceVersion);
