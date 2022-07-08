import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { GlobalVariableController } from './global-variable.controller'
import { GlobalVariableService } from './global-variable.service'
import { GlobalVariableProvider } from './global-variable.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [GlobalVariableController],
    providers: [...GlobalVariableProvider,GlobalVariableService],
    exports: [GlobalVariableService]
})
export class GlobalVariableModule {}
