import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ContractCustomerProductGradeUpdateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty()
    contractId: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty()
    customerPlantId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productGradId: string;

    @ApiProperty()
    productGradName: string;

    @ApiProperty()
    contractConditionOfSaleId: string;

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