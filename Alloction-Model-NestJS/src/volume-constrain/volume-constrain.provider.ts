import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { VolumeConstrain } from './entity/volume-constrain.entity';
import { VolumeConstrainVersion } from './entity/volume-constrain-version.entity';
import { VolumeConstrainForm } from './entity/volume-constrain-form.entity';

export const VolumeConstrainProvider = TypeORMProvider
    .create<VolumeConstrain>(TOKENS.ProjectRepositoryToken, VolumeConstrain);
// export const VolumeConstrainKtHistoryProvider = TypeORMProvider
//     .create<VolumeConstrainKtHistory>(TOKENS.ProjectRepositoryTokenHistory, VolumeConstrainKtHistory);


export const VolumeConstrainVersionProvider = TypeORMProvider
    .create<VolumeConstrainVersion>(TOKENS.ProjectRepositoryTokenVersion, VolumeConstrainVersion);

export const VolumeConstrainFormProvider = TypeORMProvider
    .create<VolumeConstrainForm>(TOKENS.ProjectRepositoryTokenForm, VolumeConstrainForm);
// export const VolumeConstrainKtFormHistoryProvider = TypeORMProvider
//     .create<VolumeConstrainKtFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, VolumeConstrainKtFormHistory);
