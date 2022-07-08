import { ApiProperty } from "@nestjs/swagger"

export class M7DemandValueManualDto  {

    @ApiProperty()
    id: string

    @ApiProperty()
    year: number

    @ApiProperty()
    month: number

    @ApiProperty()
    yearValue: number

    @ApiProperty()
    monthValue: number

    @ApiProperty()
    version: number

    @ApiProperty()
    value: number

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    unitId: string;

    @ApiProperty()
    unitName: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    sourceId: string;

    @ApiProperty()
    sourceName: string;

    @ApiProperty()
    deliveryId: string;

    @ApiProperty()
    deliveryName: string;

    @ApiProperty()
    demandName: string;

    @ApiProperty()
    contractId: string;

    @ApiProperty()
    contractConditionOfSaleId: string;

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