import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, Validate } from "class-validator";
import { UpdateCustomerCodeAlreadyExist } from "../validateFillter/UpdateCustomerCodeAlreadyExist";
import { UpdateCustomerNameAlreadyExist } from "../validateFillter/UpdateCustomerNameAlreadyExist";
import { CustomerPlantUpdateDto } from "./customerPlantUpdateDto";

export class CustomerUpdateDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Validate(UpdateCustomerCodeAlreadyExist)
    code: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Validate(UpdateCustomerNameAlreadyExist)
    name: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    shortName: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    customerTypeCode: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    customerTypeName: string

    @ApiProperty({ required: true })
    activeStatus: String;

    @IsArray()
    @ApiProperty({type: [CustomerPlantUpdateDto] ,  required: true })
    @Type(() => CustomerPlantUpdateDto)
    @ArrayNotEmpty({message: "Customer Plant ห้ามเป็นว่าง"})
    plants: CustomerPlantUpdateDto[]

    @ApiProperty({ required: false })
    rowOrder: Number;

    @ApiProperty({ required: false })
    remark: string;

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;
}