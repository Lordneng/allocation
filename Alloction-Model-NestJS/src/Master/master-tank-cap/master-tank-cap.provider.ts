import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterTankCap } from './entity/master-tank-cap.entity';

export const masterTankCapProvider = TypeORMProvider
    .create<MasterTankCap>(TOKENS.ProjectRepositoryToken,MasterTankCap);
