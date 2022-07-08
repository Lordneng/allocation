import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { Signature } from './entity';

export const SignatureProvider = TypeORMProvider
    .create<Signature>(TOKENS.ProjectRepositoryToken,Signature);
