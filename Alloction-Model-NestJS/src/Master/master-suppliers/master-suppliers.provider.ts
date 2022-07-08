import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterSupplier } from './entity/master-supplier.entity';

export const masterSupplierProvider = TypeORMProvider
    .create<MasterSupplier>(TOKENS.ProjectRepositoryToken, MasterSupplier);