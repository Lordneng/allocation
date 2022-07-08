import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { UserGroupList } from './entity/master-user-group-list.entity';

export const masterUserGroupListProvider = TypeORMProvider
    .create<UserGroupList>(TOKENS.ProjectRepositoryToken, UserGroupList);