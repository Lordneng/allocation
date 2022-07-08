import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { MasterProductsController } from './master-products.controller';
import { MasterProductsService } from './master-products.service';
import { masterProductFormulaProvider, masterProductGradeProvider, masterProductsProvider } from './master-products.provider';
import { ProductCodeIsExist } from './validateFillters/productCodeIsExist';
import { ProductFormularValidateConstraint } from './validateFillters/productFormularValidateConstraint';
import { ProductNameIsExist } from './validateFillters/productNameIsExist';
import { IsProductIdAlreadyExist } from './validateFillters/isProductIdAlreadyExist';
import { UpdateProductFormula } from './validateFillters/updateProductFormula';
import { CheckFormulaDuplicate } from './validateFillters/checkFormulaDuplicate';
import { UpdateProductCodeExist } from './validateFillters/updateProductCodeExist';
// import { MasterProductSchema } from './schema/master-product.schema';

@Module({
    imports: [DatabaseModule],
    controllers: [MasterProductsController],
    providers: [...masterProductsProvider,
        ...masterProductFormulaProvider,
        ...masterProductGradeProvider,
        CheckFormulaDuplicate,
        IsProductIdAlreadyExist,
        UpdateProductFormula,
        UpdateProductCodeExist,
        ProductCodeIsExist,
        ProductFormularValidateConstraint,
        ProductNameIsExist,
        MasterProductsService],
    exports:[MasterProductsService],
})
export class MasterProductsModule {}
