import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterPlant } from './entity/master-plant.entity';

export const masterContractsProvider = TypeORMProvider
    .create<MasterPlant>(TOKENS.ProjectRepositoryToken, MasterPlant);