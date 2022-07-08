import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import { ProductFullCostFormulaUpdateDto } from "./ProductFullCostFormulaUpdateDto";
import { ProductGradeUpdateDto } from "./productGradeUpdateDto";
import { ProductUpdateDto } from "./productUpdateDto";

export class ProductRequestUpdateDto {

    @IsObject()
    @IsNotEmptyObject()
    @ApiProperty({type:ProductUpdateDto})
    @ValidateNested() 
    @Type(() => ProductUpdateDto)
    product : ProductUpdateDto

    @ApiProperty({type: [ProductGradeUpdateDto] })
    @IsArray()
    @ValidateNested() 
    @Type(() => ProductGradeUpdateDto)
    grades: ProductGradeUpdateDto[]

    @ApiProperty({type: [ProductFullCostFormulaUpdateDto]})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductFullCostFormulaUpdateDto)
    formulas: ProductFullCostFormulaUpdateDto[]
}