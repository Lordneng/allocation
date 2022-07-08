import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { AbilityPlanKhm, AbilityPlanKhmHistory } from './entity/ability-plan-khm.entity';
import { AbilityPlanKhmVersion } from './entity/ability-plan-khm-version.entity';
import { AbilityPlanKhmManual } from './entity/ability-plan-khm-manual.entity';
import { MasterAbilityPlanKhm } from './entity';

export const AbilityPlanKhmProvider = TypeORMProvider
    .create<AbilityPlanKhm>(TOKENS.ProjectRepositoryToken, AbilityPlanKhm);

export const AbilityPlanKhmHistoryProvider = TypeORMProvider
    .create<AbilityPlanKhmHistory>(TOKENS.ProjectRepositoryTokenHistory, AbilityPlanKhmHistory);

export const AbilityPlanKhmVersionsProvider = TypeORMProvider
    .create<AbilityPlanKhmVersion>(TOKENS.ProjectRepositoryTokenVersion, AbilityPlanKhmVersion);

export const AbilityPlanKhmManualsProvider = TypeORMProvider
    .create<AbilityPlanKhmManual>(TOKENS.ProjectRepositoryTokenManual, AbilityPlanKhmManual);

export const MasterAbilityPlanKhmProvider = TypeORMProvider
    .create<MasterAbilityPlanKhm>(TOKENS.ProjectRepositoryTokenMaster, MasterAbilityPlanKhm);
