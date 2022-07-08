import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { VolumeConstrainKt, VolumeConstrainKtHistory } from './entity/volume-constrain-kt.entity';
import { VolumeConstrainKtVersion } from './entity/volume-constrain-kt-version.entity';
import { VolumeConstrainKtForm, VolumeConstrainKtFormHistory } from './entity/volume-constrain-kt-form.entity';

export const VolumeConstrainKtProvider = TypeORMProvider
    .create<VolumeConstrainKt>(TOKENS.ProjectRepositoryToken, VolumeConstrainKt);
export const VolumeConstrainKtHistoryProvider = TypeORMProvider
    .create<VolumeConstrainKtHistory>(TOKENS.ProjectRepositoryTokenHistory, VolumeConstrainKtHistory);


export const VolumeConstrainKtVersionProvider = TypeORMProvider
    .create<VolumeConstrainKtVersion>(TOKENS.ProjectRepositoryTokenVersion, VolumeConstrainKtVersion);

export const VolumeConstrainKtFormProvider = TypeORMProvider
    .create<VolumeConstrainKtForm>(TOKENS.ProjectRepositoryTokenForm, VolumeConstrainKtForm);
export const VolumeConstrainKtFormHistoryProvider = TypeORMProvider
    .create<VolumeConstrainKtFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, VolumeConstrainKtFormHistory);
