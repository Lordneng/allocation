import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterReferencePrice } from './entity/master-reference-prices.entity';

export const MasterReferencePricesProvider = TypeORMProvider
    .create<MasterReferencePrice>(TOKENS.ProjectRepositoryToken,MasterReferencePrice);
