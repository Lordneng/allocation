import { Module } from '@nestjs/common';
import { LRByLegalModule } from '../lr-by-legal/lr-by-legal.module';
import { AbilityPentaneModule } from '../ability-plan/ability-pentane/ability-pentane.module';
import { AbilityPlanKhmModule } from '../ability-plan/ability-plan-khm/ability-plan-khm.module';
import { AbilityPlanRayongModule } from '../ability-plan/ability-plan-rayong/ability-plan-rayong.module';
import { AbilityRefineryModule } from '../ability-plan/ability-refinery/ability-refinery.module';
import { CalMarginModule } from '../cal-margin/cal-margin.modules';
import { DatabaseModule } from '../common/providers'
import { DepotManagementMeterModule } from '../depot-management/depot-management.module';
import { MarginPerUnitsModule } from '../margin-per-units/margin-per-units.module';
import { MasterContractModule } from '../Master/master-contract/master-contract.module';
import { MasterDepotModule } from '../Master/master-depot/master-depot.module';
import { MasterProductsModule } from '../Master/master-products/master-products.module';
import { MasterRefineryModule } from '../Master/master-refinerys/master-refinerys.module';
import { MasterSupplierModule } from '../Master/master-suppliers/master-suppliers.module';
import { MasterTankCapModule } from '../Master/master-tank-cap/master-tank-cap.module';
import { TankCapModule } from '../tank-cap/tank-cap.module';
import { VolumeConstrainModule } from '../volume-constrain/volume-constrain.module';
import { OptimizationsController } from './optimizations.controller';
import {
    optimizationVersionsProvider,
    optimizationsC2Provider,
    optimizationC2RevisionsProvider,
    optimizationsC3LpgProvider,
    optimizationC3LpgRevisionProvider,
    optimizationsCo2Provider,
    optimizationCo2RevisionProvider,
    optimizationsNglProvider,
    optimizationNglRevisionProvider,
    optimizationsPantaneProvider,
    optimizationPantaneRevisionProvider,
    optimizationsLrMonthlyProvider,
    optimizationLrMonthlyRevisionProvider,
    optimizationsVolumnProvider,
    optimizationVolumnActualProvider
} from './optimizations.provider';
import { OptimizationsService } from './optimizations.service';

@Module({
    imports: [
        DatabaseModule,
        MasterProductsModule,
        VolumeConstrainModule,
        CalMarginModule,
        MarginPerUnitsModule,
        MasterContractModule,
        TankCapModule,
        DepotManagementMeterModule,
        AbilityPlanRayongModule,
        MasterTankCapModule,
        MasterDepotModule,
        AbilityPentaneModule,
        AbilityRefineryModule,
        AbilityPlanKhmModule,
        MasterSupplierModule,
        LRByLegalModule
    ],
    controllers: [OptimizationsController],
    providers: [
        ...optimizationsC2Provider,
        ...optimizationC2RevisionsProvider,
        ...optimizationsC3LpgProvider,
        ...optimizationC3LpgRevisionProvider,
        ...optimizationsCo2Provider,
        ...optimizationCo2RevisionProvider,
        ...optimizationsNglProvider,
        ...optimizationNglRevisionProvider,
        ...optimizationsPantaneProvider,
        ...optimizationPantaneRevisionProvider,
        ...optimizationVersionsProvider,
        ...optimizationsLrMonthlyProvider,
        ...optimizationLrMonthlyRevisionProvider,
        ...optimizationsVolumnProvider,
        ...optimizationVolumnActualProvider,
        OptimizationsService],
    exports: [OptimizationsService]
})
export class OptimizationsModule { }
