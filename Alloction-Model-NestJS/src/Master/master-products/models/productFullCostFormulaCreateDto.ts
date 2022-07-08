
import { ApiProperty } from "@nestjs/swagger";
import { ProductFormularValidateConstraint } from "../validateFillters/productFormularValidateConstraint";
import { IsNotEmpty, Validate } from "class-validator";


export class ProductFullCostFormulaCreateDto   {
    
    @ApiProperty()
    id: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    productId: string;
    
    @ApiProperty({ required: true })
    productGradeId: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    sourceId: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    deliveryPointId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    fullcostFormula: string;

    @ApiProperty({ required: true })
    activeStatus: String;

    @ApiProperty({ required: false })
    rowOrder: Number;

    @ApiProperty({ required: false })
    remark: string;

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;

}