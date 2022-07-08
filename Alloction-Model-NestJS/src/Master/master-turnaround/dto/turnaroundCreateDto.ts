import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, Validate, ValidateNested } from "class-validator"
import { CheckCreateTurnaroundDate } from "../validateFillter/CheckCreateTurnaroundDate"

export class TurnaroundCreateDto {

    @ApiProperty()
    turnaroundTypeId: string;

    @ApiProperty()
    turnaroundTypeName: string;

    @ApiProperty()
    startTurnaroundDate: Date;

    @ApiProperty({required: true})
    @Validate(CheckCreateTurnaroundDate)
    @IsNotEmpty({message: "end date ห้ามว่าง"})
    endTurnaroundDate: Date;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    plantId: string;

    @ApiProperty()
    plantName: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    duration: Number

    @ApiProperty()
    percent: Number

    @ApiProperty()
    activeStatus: String;

    remark: string;

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;

}