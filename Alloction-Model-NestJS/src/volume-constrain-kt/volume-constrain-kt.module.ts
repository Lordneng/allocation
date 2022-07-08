import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { VolumeConstrainKtsController } from './volume-constrain-kt.controller';
import { VolumeConstrainKtService } from './volume-constrain-kt.service';
import { VolumeConstrainKtProvider, VolumeConstrainKtVersionProvider, VolumeConstrainKtFormProvider, VolumeConstrainKtFormHistoryProvider, VolumeConstrainKtHistoryProvider } from './volume-constrain-kt.provider';

@Module({
    imports: [DatabaseModule],
    controllers: [VolumeConstrainKtsController],
    providers: [...VolumeConstrainKtProvider, ...VolumeConstrainKtVersionProvider, ...VolumeConstrainKtFormProvider,...VolumeConstrainKtHistoryProvider,...VolumeConstrainKtFormHistoryProvider , VolumeConstrainKtService],
    exports: [VolumeConstrainKtService],
})
export class VolumeConstrainKtsModule { }
