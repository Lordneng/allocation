import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterReferenceSmartPrice } from './entity/master-reference-smart-prices.entity';

export const MasterReferenceSmartPricesProvider = TypeORMProvider
    .create<MasterReferenceSmartPrice>(TOKENS.ProjectRepositoryToken,MasterReferenceSmartPrice);
