import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { ProductCodeIsExist } from "../validateFillters/productCodeIsExist";
import { ProductNameIsExist } from "../validateFillters/productNameIsExist";

@Entity()
export class MasterProduct extends CreatedEntity<number> {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Validate(ProductCodeIsExist)
    @Column({ nullable: true, length: 200 })
    productCode: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    // @Validate(ProductNameIsExist)
    @Column({ nullable: true, length: 200 })
    productName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Column({ nullable: true, length: 200 })
    productShortName: string;


    @Column({ nullable: true })
    modelId: Number

    @Column({ nullable: true })
    tankCapModelId: Number
}