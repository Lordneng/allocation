import { Module } from '@nestjs/common'
import { DatabaseModule } from '../common/providers'
import { ProductionPlantController } from './production-plant.controller'
import { ProductionPlantService } from './production-plant.service'
import {productionPlantProvider } from './production-plant.provider'


@Module({
    imports: [DatabaseModule],
    controllers: [ProductionPlantController],
    providers: [...productionPlantProvider, ProductionPlantService],
    exports: [ProductionPlantService]
})
export class ProductionPlantModule { }
