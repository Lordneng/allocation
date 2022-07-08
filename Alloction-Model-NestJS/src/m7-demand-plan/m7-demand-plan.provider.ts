import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import { M7DemandPlan, 
    M7DemandPlanVersion,
    M7DemandValueManual,
    M7DemandValue
} from './entity'

export const M7DemandPlanProvider = TypeORMProvider
    .create<M7DemandPlan>(TOKENS.ProjectRepositoryToken, M7DemandPlan);

export const M7DemandValueManualProvider = TypeORMProvider
    .create<M7DemandValueManual>(TOKENS.ProjectRepositoryTokenManual, M7DemandValueManual);

export const M7DemandValueProvider = TypeORMProvider
    .create<M7DemandValue>(TOKENS.ProjectRepositoryTokenForm, M7DemandValue);

export const M7DemandPlanVersionProvider = TypeORMProvider
    .create<M7DemandPlanVersion>(TOKENS.ProjectRepositoryTokenVersion, M7DemandPlanVersion);