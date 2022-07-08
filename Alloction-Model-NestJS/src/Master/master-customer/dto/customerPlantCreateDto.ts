import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { IsCustomerPlantNameAlreadyExist } from "../validateFillter/IsCustomerPlantNameAlreadyExist";


export class CustomerPlantCreateDto {

    id: string;
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    code: string

    @ApiProperty({ required: true })
    @Validate(IsCustomerPlantNameAlreadyExist)
    name: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
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