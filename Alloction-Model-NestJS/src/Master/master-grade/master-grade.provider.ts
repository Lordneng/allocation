import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MasterGrade } from './entity/master-grade.entity';

export const masterGradeProvider = TypeORMProvider
    .create<MasterGrade>(TOKENS.ProjectRepositoryToken, MasterGrade);