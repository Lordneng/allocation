import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { UserGroup } from './entity/master-user-group.entity';

export const masterUserGroupProvider = TypeORMProvider
    .create<UserGroup>(TOKENS.ProjectRepositoryToken, UserGroup);