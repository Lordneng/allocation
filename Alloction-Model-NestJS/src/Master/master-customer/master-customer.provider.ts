import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterCustomer, MasterCustomerPlant } from './entity/';

export const masterCustomerProvider = TypeORMProvider
    .create<MasterCustomer>(TOKENS.ProjectRepositoryToken, MasterCustomer);

export const masterCustomerPlantProvider = TypeORMProvider
    .create<MasterCustomerPlant>(TOKENS.ProjectRepositoryTokenNew, MasterCustomerPlant);