import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterCustomerType } from './entity/master-customer-type.entity';

export const masterCustomerTypeProvider = TypeORMProvider
    .create<MasterCustomerType>(TOKENS.ProjectRepositoryToken, MasterCustomerType);