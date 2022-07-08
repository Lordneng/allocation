import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { MenuLevel1, MenuLevel2, MenuLevel3 } from './entity';

export const MenuLevel1Provider = TypeORMProvider
    .create<MenuLevel1>(TOKENS.ProjectMenuLevel1RepositoryToken,MenuLevel1);

export const MenuLevel2Provider = TypeORMProvider
    .create<MenuLevel2>(TOKENS.ProjectMenuLevel2RepositoryToken,MenuLevel2);

export const MenuLevel3Provider = TypeORMProvider
    .create<MenuLevel3>(TOKENS.ProjectMenuLevel3RepositoryToken,MenuLevel3);