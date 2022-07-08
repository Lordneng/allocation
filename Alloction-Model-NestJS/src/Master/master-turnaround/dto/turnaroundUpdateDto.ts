import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, Validate, ValidateNested } from "class-validator"
import { CheckUpdateTurnaroundDate } from "../validateFillter/CheckUpdateTurnaroundDate"

export class TurnaroundUpdateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty()
    turnaroundTypeId: string;

    @ApiProperty()
    turnaroundTypeName: string;

    @ApiProperty()
    startTurnaroundDate: Date;

    @ApiProperty({required: true})
    @Validate(CheckUpdateTurnaroundDate)
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

    @ApiProperty()
    remark: string;

    @ApiProperty()
    createByUserId: string;

    @ApiProperty()
    createBy: String;

    @ApiProperty()
    updateByUserId: string;

    @ApiProperty()
    updateBy: String;

}