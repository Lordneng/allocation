import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { IsCustomerIdAlreadyExist } from "../validateFillter/IsCustomerIdAlreadyExist";
import { UpdateCustomerPlantNameAlreadyExist } from "../validateFillter/UpdateCustomerPlantNameAlreadyExist";


export class CustomerPlantUpdateDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    code: string

    @ApiProperty({ required: true })
    @Validate(UpdateCustomerPlantNameAlreadyExist)
    @IsNotEmpty()
    name: string

    @ApiProperty({ required: true })
    @Validate(IsCustomerIdAlreadyExist)
    @IsNotEmpty()
    customerId: string

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