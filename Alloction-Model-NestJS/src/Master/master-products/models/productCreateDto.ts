

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { ProductCodeIsExist } from "../validateFillters/productCodeIsExist";

export class ProductCreateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Validate(ProductCodeIsExist)
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