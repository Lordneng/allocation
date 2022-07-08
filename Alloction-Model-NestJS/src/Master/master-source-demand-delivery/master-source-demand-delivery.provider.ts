import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterSourceDemandDelivery } from './entity/master-source-demand-delivery.entity';

export const MasterSourceDemandDeliverysProvider = TypeORMProvider
    .create<MasterSourceDemandDelivery>(TOKENS.ProjectRepositoryToken,MasterSourceDemandDelivery);
