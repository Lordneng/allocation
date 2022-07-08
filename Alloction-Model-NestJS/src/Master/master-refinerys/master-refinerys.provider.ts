import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterRefinery } from './entity/master-refinery.entity';

export const masterRefinerysProvider = TypeORMProvider
    .create<MasterRefinery>(TOKENS.ProjectRepositoryToken, MasterRefinery);
