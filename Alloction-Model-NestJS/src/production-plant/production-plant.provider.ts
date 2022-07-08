import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { ProductionPlant } from './entity/production-plant.entity';

export const productionPlantProvider = TypeORMProvider
    .create<ProductionPlant>(TOKENS.ProjectRepositoryToken, ProductionPlant);