import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { AbilityPlanRayong, AbilityPlanRayongDaily, AbilityPlanRayongVersion, MasterAbilityPlanRayong } from './entity';

export const AbilityPlanRayongProvider = TypeORMProvider
    .create<AbilityPlanRayong>(TOKENS.ProjectRepositoryToken, AbilityPlanRayong);

export const AbilityPlanRayongDailyProvider = TypeORMProvider
    .create<AbilityPlanRayongDaily>(TOKENS.ProjectRepositoryTokenManual, AbilityPlanRayongDaily);

export const AbilityPlanRayongVersionProvider = TypeORMProvider
    .create<AbilityPlanRayongVersion>(TOKENS.ProjectRepositoryTokenVersion, AbilityPlanRayongVersion);

export const AbilityPlanRayongMasterProvider = TypeORMProvider
    .create<MasterAbilityPlanRayong>(TOKENS.ProjectRepositoryTokenMaster, MasterAbilityPlanRayong);
