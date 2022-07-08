import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../common/providers'
import { MasterGrageController } from './master-grade.controller'
import { MasterGradeService } from './master-grade.service'
import { masterGradeProvider } from './master-grade.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [MasterGrageController],
    providers: [...masterGradeProvider, MasterGradeService],
    exports: [MasterGradeService]
})
export class MasterGradeModule { }
