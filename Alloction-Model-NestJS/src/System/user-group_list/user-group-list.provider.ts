import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { UserGroupList } from './entity/user-group-list.entity';

export const UserGroupListProvider = TypeORMProvider
    .create<UserGroupList>(TOKENS.ProjectRepositoryToken, UserGroupList);