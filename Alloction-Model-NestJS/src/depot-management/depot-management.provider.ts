import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { DepotManagementMeter, DepotManagementMeterHistory } from './entity/depot-management.entity';
import { DepotManagementMeterVersion } from './entity/depot-management-version.entity';
import { DepotManagementMeterForm, DepotManagementMeterFormHistory } from './entity/depot-management-form.entity';

export const DepotManagementMeterProvider = TypeORMProvider
    .create<DepotManagementMeter>(TOKENS.ProjectRepositoryToken, DepotManagementMeter);
    
export const DepotManagementMeterHistoryProvider = TypeORMProvider
    .create<DepotManagementMeterHistory>(TOKENS.ProjectRepositoryTokenHistory, DepotManagementMeterHistory);

export const DepotManagementMeterVersionProvider = TypeORMProvider
    .create<DepotManagementMeterVersion>(TOKENS.ProjectRepositoryTokenVersion, DepotManagementMeterVersion);

export const DepotManagementMeterFormProvider = TypeORMProvider
    .create<DepotManagementMeterForm>(TOKENS.ProjectRepositoryTokenForm, DepotManagementMeterForm);
export const DepotManagementMeterFormHistoryProvider = TypeORMProvider
    .create<DepotManagementMeterFormHistory>(TOKENS.ProjectRepositoryTokenFormHistory, DepotManagementMeterFormHistory);
