import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { Permission } from './entity';

export const PermissionsProvider = TypeORMProvider
    .create<Permission>(TOKENS.ProjectRepositoryToken, Permission);