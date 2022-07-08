import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterProduct, MasterProductFullCostFormula, MasterProductGrade } from './entity';

export const masterProductsProvider = TypeORMProvider
    .create<MasterProduct>(TOKENS.ProjectRepositoryToken,MasterProduct);

export const masterProductFormulaProvider = TypeORMProvider
    .create<MasterProductFullCostFormula>(TOKENS.ProjectRepositoryTokenNew, MasterProductFullCostFormula);

export const masterProductGradeProvider = TypeORMProvider
    .create<MasterProductGrade>(TOKENS.ProjectRepositoryTokenForm, MasterProductGrade);