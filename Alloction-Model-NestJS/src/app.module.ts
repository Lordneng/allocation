import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostsModule } from './cost/costs.module';
import { TankCapModule } from './tank-cap/tank-cap.module';
import { MasterCostsModule } from './Master/master-costs/master-costs.module';
import { MasterProductsModule } from './Master/master-products/master-products.module';
import { MasterSourceDemandDeliveryModule } from './Master/master-source-demand-delivery/master-source-demand-delivery.module';
import { ReferencePricesModule } from './reference-prices/reference-prices.module';
import { MarginPerUnitsModule } from './margin-per-units/margin-per-units.module';
import { MarginsModule } from './margins/margins.module';
import { RevenuesModule } from './revenues/revenues.module';
import { SellingPricesModule } from './selling-prices/selling-prices.module';
import { VolumesModule } from './volumes/volumes.module';
import { UsersModule } from './System/users/users.module';
import { MasterReferencePricesModule } from './Master/master-reference-prices/master-reference-prices.module';
import { VolumeConstrainModule } from './volume-constrain/volume-constrain.module';
import { VolumeConstrainKtsModule } from './volume-constrain-kt/volume-constrain-kt.module';
import { VolumeConstrainMeterModule } from './volume-constrain-meter/volume-constrain-meter.module';
import { AuthModule } from './auth/auth.module';
import { AbilityPlanKhmModule } from './ability-plan/ability-plan-khm/ability-plan-khm.module';
import { AbilityRefineryModule } from './ability-plan/ability-refinery/ability-refinery.module';
import { AbilityPlanRayongModule } from './ability-plan/ability-plan-rayong/ability-plan-rayong.module';
import { SellingPricesManualModule } from './selling-price-manual/selling-prices-manual.module';
import { MasterContractModule } from './Master/master-contract/master-contract.module';
import { MasterTurnaroundModule } from './Master/master-turnaround/master-turnaround.module';
import { MasterTurnaroundTypeModule } from './Master/master-turnaround-type/master-turnaround-type.modules';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MasterReferenceSmartPricesModule } from './Master/master-reference-smart-prices/master-reference-smart-prices.module';
import { AbilityPentaneModule } from './ability-plan/ability-pentane/ability-pentane.module';
import { MasterTankCapModule } from './Master/master-tank-cap/master-tank-cap.module';
import { LRByLegalModule } from './lr-by-legal/lr-by-legal.module';
import { FullCostsModule } from './full-costs/full-costs.module';
import { FullCostsManualsModule } from './full-cost-manuals/full-cost-manuals.module';
import { DepotManagementMeterModule } from './depot-management/depot-management.module';
import { MasterCustomerModule } from './Master/master-customer/master-customer.module';
import { MasterPlantModule } from './Master/master-plant/master-plant.module';
import { MasterSourceModule } from './Master/master-source/master-source.module';
import { MasterDeliveryPointModule } from './Master/master-delivery-point/master-delivery-point.module';
import { SignatureModule } from './System/signature/signature.module';
import { MasterCostProductsTypesModule } from './Master/master-product-cost-types/master-product-cost-types.module';
import { MasterUnitModule } from './Master/master-unit/master-unit.module';
import { ProductionPlantModule } from './production-plant/production-plant.module';
import { MasterProductionPlantsModule } from './Master/master-production-plant/master-production-plants.module';
import { UserGroupModule } from './System/user-group/user-group.module';
import { UserGroupListModule } from './System/user-group_list/user-group-list.module';
import { MenusModule } from './System/menus/menus.module';
import { PermisionsModule } from './System/permissions/permissions.module';
import { MasterSupplierModule } from './Master/master-suppliers/master-suppliers.module';
import { MasterDepotModule } from './Master/master-depot/master-depot.module';
import { MasterContractTypeModule } from './Master/master-contract-type/master-contract-type.modules';
import { MasterConditionOfSaleModule } from './Master/master-condition-of-sale/master-condition-of-sale.module';
import { MasterTierTypeModule } from './Master/master-tier-type/master-tier-type.module';
import { CalMarginModule } from './cal-margin/cal-margin.modules';
import { M7DemandPlanModule } from './m7-demand-plan/m7-demand-plan.module';
import { MasterCustomerTypeModule } from './Master/master-customer-type/master-customer-type.module';
import { MasterRefineryModule } from './Master/master-refinerys/master-refinerys.module';
import { InventoryControlModule } from './inventory-control/inventory-control.module';
import { OptimizationsModule } from './optimization/optimizations.module';
import { GlobalVariableModule } from './System/global-variable/global-variable.module';
import { EthanePlanningReportModule } from './reports/ethane-planning/ethane-planning-report.module';
import { SystemModeModule } from './System/system-mode/system-mode.module';
import { SummaryReportModule } from './reports/summary/summary-report.module';
import { LpgRollingReportModule } from './reports/lpg-rolling/lpg-rolling.module';
import { MasterCostsSmartPriceModule } from './Master/master-costs-smart-price/master-costs-smart-price.module';
import { MasterConditionOfSaleSmartPriceModule } from './Master/master-condition-of-sale-smart-price/master-condition-of-sale-smart-price.module';

//import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [//ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CostsModule,
    TankCapModule,
    MasterCostsModule,
    MasterProductsModule,
    MasterSourceDemandDeliveryModule,
    ReferencePricesModule,
    FullCostsModule,
    FullCostsManualsModule,
    MarginPerUnitsModule,
    MarginsModule,
    RevenuesModule,
    SellingPricesModule,
    VolumesModule,
    UsersModule,
    MasterReferencePricesModule,
    VolumeConstrainModule,
    VolumeConstrainKtsModule,
    VolumeConstrainMeterModule,
    AbilityPentaneModule,
    AbilityPlanKhmModule,
    AbilityPlanRayongModule,
    AbilityRefineryModule,
    SellingPricesManualModule,
    MasterContractModule,
    MasterTurnaroundModule,
    MasterTurnaroundTypeModule,
    MasterReferenceSmartPricesModule,
    MasterTankCapModule,
    MasterUnitModule,
    ProductionPlantModule,
    LRByLegalModule,
    DepotManagementMeterModule,
    MasterCustomerModule,
    MasterPlantModule,
    MasterSourceModule,
    MasterDeliveryPointModule,
    SignatureModule,
    MasterCostProductsTypesModule,
    MasterProductionPlantsModule,
    UserGroupModule,
    UserGroupListModule,
    MenusModule,
    MasterSupplierModule,
    MasterDepotModule,
    MasterContractTypeModule,
    MasterConditionOfSaleModule,
    MasterTierTypeModule,
    PermisionsModule,
    CalMarginModule,
    M7DemandPlanModule,
    MasterCustomerTypeModule,
    MasterRefineryModule,
    InventoryControlModule,
    OptimizationsModule,
    GlobalVariableModule,
    EthanePlanningReportModule,
    SystemModeModule,
    SummaryReportModule,
    LpgRollingReportModule,
    MasterCostsSmartPriceModule,
    MasterConditionOfSaleSmartPriceModule
  ],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule { }
