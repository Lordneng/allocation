import { TOKENS } from '../constants'
import { TypeORMProvider } from '../common/providers'
import {
    OptimizationC2,
    OptimizationC2Revision,
    OptimizationC3Lpg,
    OptimizationC3LpgRevision,
    OptimizationCo2,
    OptimizationCo2Revision,
    OptimizationNgl,
    OptimizationNglRevision,
    OptimizationPantane,
    OptimizationPantaneRevision,
    OptimizationVersion,
    OptimizationLrMonthly,
    OptimizationLrMonthlyRevision,
    OptimizationVolumn,
    OptimizationVolumnActual
} from './entity';


export const optimizationVersionsProvider = TypeORMProvider
    .create<OptimizationVersion>(TOKENS.ProjectRepositoryTokenVersion, OptimizationVersion);

export const optimizationsC2Provider = TypeORMProvider
    .create<OptimizationC2>(TOKENS.ProjectRepositoryTokenForm, OptimizationC2);

export const optimizationC2RevisionsProvider = TypeORMProvider
    .create<OptimizationC2Revision>(TOKENS.ProjectRepositoryTokenFormHistory, OptimizationC2Revision);

export const optimizationsC3LpgProvider = TypeORMProvider
    .create<OptimizationC3Lpg>(TOKENS.ProjectRepositoryC3LpgToken, OptimizationC3Lpg);

export const optimizationC3LpgRevisionProvider = TypeORMProvider
    .create<OptimizationC3LpgRevision>(TOKENS.ProjectRepositoryC3LpgRevisionToken, OptimizationC3LpgRevision);

export const optimizationsCo2Provider = TypeORMProvider
    .create<OptimizationCo2>(TOKENS.ProjectRepositoryCo2Token, OptimizationCo2);

export const optimizationCo2RevisionProvider = TypeORMProvider
    .create<OptimizationCo2Revision>(TOKENS.ProjectRepositoryCo2RevisionToken, OptimizationCo2Revision);

export const optimizationsNglProvider = TypeORMProvider
    .create<OptimizationNgl>(TOKENS.ProjectRepositoryNglToken, OptimizationNgl);

export const optimizationNglRevisionProvider = TypeORMProvider
    .create<OptimizationNglRevision>(TOKENS.ProjectRepositoryNglRevisionToken, OptimizationNglRevision);

export const optimizationsPantaneProvider = TypeORMProvider
    .create<OptimizationPantane>(TOKENS.ProjectRepositoryPantaneToken, OptimizationPantane);

export const optimizationPantaneRevisionProvider = TypeORMProvider
    .create<OptimizationPantaneRevision>(TOKENS.ProjectRepositoryPantaneRevisionToken, OptimizationPantaneRevision);

export const optimizationsLrMonthlyProvider = TypeORMProvider
    .create<OptimizationLrMonthly>(TOKENS.ProjectRepositoryLrMonthlyToken, OptimizationLrMonthly);

export const optimizationLrMonthlyRevisionProvider = TypeORMProvider
    .create<OptimizationLrMonthlyRevision>(TOKENS.ProjectRepositoryLrMonthlyRevisionToken, OptimizationLrMonthlyRevision);

export const optimizationsVolumnProvider = TypeORMProvider
    .create<OptimizationVolumn>(TOKENS.ProjectRepositoryVolumnToken, OptimizationVolumn);

export const optimizationVolumnActualProvider = TypeORMProvider
    .create<OptimizationVolumnActual>(TOKENS.ProjectRepositoryOptimizationVolumnActualToken, OptimizationVolumnActual);