

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { IsProductIdAlreadyExist } from "../validateFillters/isProductIdAlreadyExist";
import { ProductCodeIsExist } from "../validateFillters/productCodeIsExist";
import { UpdateProductCodeExist } from "../validateFillters/updateProductCodeExist";

export class ProductUpdateDto {

    @ApiProperty({ required: true })
    @Validate(IsProductIdAlreadyExist)
    @IsNotEmpty()
    id: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Validate(UpdateProductCodeExist)
    productCode: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    // @Validate(ProductNameIsExist)
    productName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    productShortName: string;

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