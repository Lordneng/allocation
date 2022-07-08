import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/providers';
import { MarginPerUnitsController } from './margin-per-units.controller';
import { MarginPerUnitsService } from './margin-per-units.service';
import { MarginPerUnitProvider, MarginPerUnitVersionProvider } from './margin-per-units.provider';


@Module({
    imports: [DatabaseModule],
    controllers: [MarginPerUnitsController],
    providers: [...MarginPerUnitProvider, ...MarginPerUnitVersionProvider , MarginPerUnitsService],
    exports:[MarginPerUnitsService]
})
export class MarginPerUnitsModule { }
