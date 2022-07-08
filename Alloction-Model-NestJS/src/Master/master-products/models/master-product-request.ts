import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmptyObject, IsObject, ValidateNested, ValidatePromise, ValidationArguments } from "class-validator";
import { MasterProduct, MasterProductFullCostFormula, MasterProductGrade } from "../entity";

export class MasterProductRequest {

    @IsObject()
    @IsNotEmptyObject()
    @ApiProperty({type:MasterProduct})
    @ValidateNested() 
    @Type(() => MasterProduct)
    product : MasterProduct

    @ApiProperty({type: [MasterProductGrade] })
    @IsArray()
    @ValidateNested() 
    @Type(() => MasterProductGrade)
    grades: MasterProductGrade[]

    @ApiProperty({type: [MasterProductFullCostFormula]})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MasterProductFullCostFormula)
    formulas: MasterProductFullCostFormula[]
}