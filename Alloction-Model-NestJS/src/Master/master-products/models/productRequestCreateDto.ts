import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmptyObject, IsObject, ValidateNested, Validate } from "class-validator";
import { CheckFormulaDuplicate } from "../validateFillters/checkFormulaDuplicate";
import { ProductCreateDto } from "./productCreateDto";
import { ProductFullCostFormulaCreateDto } from "./productFullCostFormulaCreateDto";
import { ProductGradeCreateDto } from "./productGradeCreateDto";

export class ProductRequestCreateDto {

    @IsObject()
    @IsNotEmptyObject()
    @ApiProperty({type:ProductCreateDto})
    @ValidateNested() 
    @Type(() => ProductCreateDto)
    product : ProductCreateDto

    @ApiProperty({type: [ProductGradeCreateDto] })
    @IsArray()
    @ValidateNested() 
    @Type(() => ProductGradeCreateDto)
    grades: ProductGradeCreateDto[]

    @ApiProperty({type: [ProductFullCostFormulaCreateDto]})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductFullCostFormulaCreateDto)
    formulas: ProductFullCostFormulaCreateDto[]
}