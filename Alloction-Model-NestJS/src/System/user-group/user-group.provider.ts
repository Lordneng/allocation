import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { UserGroup } from './entity/user-group.entity';

export const UserGroupProvider = TypeORMProvider
    .create<UserGroup>(TOKENS.ProjectRepositoryToken, UserGroup);