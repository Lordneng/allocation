import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { User } from './entity';

export const UsersProvider = TypeORMProvider
    .create<User>(TOKENS.ProjectRepositoryToken,User);
