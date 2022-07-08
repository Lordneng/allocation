import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { VolumeConstrainMeter, VolumeConstrainMeterHistory } from './entity/volume-constrain-meter.entity';
import { VolumeConstrainMeterVersion } from './entity/volume-constrain-meter-version.entity';
import { VolumeConstrainMeterForm, VolumeConstrainMeterFormHistory } from './entity/volume-constrain-meter-form.entity';

export const VolumeConstrainMeterProvider = TypeORMProvider
    .create<VolumeConstrainMeter>(TOKENS.ProjectRepositoryToken, VolumeConstrainMeter);
export const VolumeConstrainMeterHistoryProvider = TypeORMProvider
    .create<VolumeConstrainMeterHistory>(TOKENS.ProjectRepositoryTokenHistory, VolumeConstrainMeterHistory);

export const VolumeConstrainMeterVersionProvider = TypeORMProvider
    .create<VolumeConstrainMeterVersion>(TOKENS.ProjectRepositoryTokenVersion, VolumeConstrainMeterVersion);

export const VolumeConstrainMeterFormProvider = TypeORMProvider
    .create<VolumeConstrainMeterForm>(TOKENS.ProjectRepositoryTokenForm, VolumeConstrainMeterForm);
export const VolumeConstrainMeterFormHistoryProvider = TypeORMProvider
    .create<VolumeConstrainMeterFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, VolumeConstrainMeterFormHistory);
