import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterCostProductsTypesController } from './master-product-cost-types.controller';
import { MasterCostProductsTypesService } from './master-product-cost-types.service';
import { masterProductsProvider } from './master-products.provider';
// import { MasterProductSchema } from './schema/master-product.schema';

@Module({
    imports: [DatabaseModule],
    controllers: [MasterCostProductsTypesController],
    providers: [...masterProductsProvider ,MasterCostProductsTypesService],
    exports:[MasterCostProductsTypesService],
})
export class MasterCostProductsTypesModule {}
