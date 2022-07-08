import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterUnit } from './entity/master-unit.entity';


export const masterUnitsProvider = TypeORMProvider
    .create<MasterUnit>(TOKENS.ProjectRepositoryToken, MasterUnit);