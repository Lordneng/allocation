import { TOKENS } from '../constants';
import { TypeORMProvider } from '../common/providers';
import { Volume } from './entity/volumes.entity';
import { VolumeVersion } from './entity/volumes-version.entity';

export const VolumesProvider = TypeORMProvider
    .create<Volume>(TOKENS.ProjectRepositoryToken, Volume);
    
export const VolumeVersionsProvider = TypeORMProvider
.create<VolumeVersion>(TOKENS.ProjectRepositoryTokenVersion, VolumeVersion);
