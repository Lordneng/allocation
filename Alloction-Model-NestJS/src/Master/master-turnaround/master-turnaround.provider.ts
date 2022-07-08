import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { Turnaround } from './entity/';

export const turnaroundProvider = TypeORMProvider
    .create<Turnaround>(TOKENS.ProjectRepositoryTokenNew, Turnaround);