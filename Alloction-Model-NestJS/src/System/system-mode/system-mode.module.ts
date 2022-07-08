import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { SystemModeController } from './system-mode.controller';
import { SystemModeProvider } from './system-mode.provider';
import { SystemModeService } from './system-mode.service';


@Module({
    imports: [DatabaseModule],
    controllers: [SystemModeController],
    providers: [
        ...SystemModeProvider
        , SystemModeService
    ],
    exports: [SystemModeService]
})
export class SystemModeModule { }