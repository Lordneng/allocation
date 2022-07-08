import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ContractCustomerPlantCreateDto {

    @ApiProperty()
    contractId: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty()
    customerPlantId: string;

    @ApiProperty({required: true})
    customerPlantName: string;

    @ApiProperty()
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