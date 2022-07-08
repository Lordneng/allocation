import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, Validate, ValidateNested, ValidatePromise, ValidationArguments } from "class-validator";
import { IsCustomerCodeAlreadyExist } from "../validateFillter/IsCustomerCodeAlreadyExist";
import { IsCustomerNameAlreadyExist } from "../validateFillter/IsCustomerNameAlreadyExist";
import { CustomerPlantCreateDto } from "./customerPlantCreateDto";


export class CustomerCreateDto {

    @ApiProperty({ required: true })
    @Validate(IsCustomerCodeAlreadyExist)
    @IsNotEmpty()
    code: string

    @ApiProperty({ required: true })
    @Validate(IsCustomerNameAlreadyExist)
    @IsNotEmpty()
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

    @ApiProperty({ type: [CustomerPlantCreateDto], required: true })
    @ValidateNested({each: true})
    @Type(() => CustomerPlantCreateDto)
    @IsArray()
    @ArrayNotEmpty({message: "Customer Plant ห้ามเป็นว่าง"})
    plants: CustomerPlantCreateDto[]

    @ApiProperty({ required: false })
    rowOrder: Number;

    @ApiProperty({ required: false })
    remark: string;

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;
    
}