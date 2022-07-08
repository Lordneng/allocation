import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterDeliveryPoint } from './entity/master-delivery-point.entity';

export const masterContractsProvider = TypeORMProvider
    .create<MasterDeliveryPoint>(TOKENS.ProjectRepositoryToken, MasterDeliveryPoint);