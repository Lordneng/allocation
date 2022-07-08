import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterProductionPlant } from './entity';

export const masterProductionPlantsProvider = TypeORMProvider
    .create<MasterProductionPlant>(TOKENS.ProjectRepositoryToken, MasterProductionPlant);
