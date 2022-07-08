import { ApiProperty } from "@nestjs/swagger"


export class SummaryDataDto {

    @ApiProperty()
    contractId: string;

    @ApiProperty()
    contractNumber: string;

    @ApiProperty()
    contractTypeId: string;

    @ApiProperty()
    contractTypeName: string;

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
    customerContractPlantId: string;

    @ApiProperty()
    customerPlantId: string;

    @ApiProperty()
    customerPlantName: string;

    @ApiProperty()
    conditionsOfSaleId: string;

    @ApiProperty()
    conditionsOfSaleName: string;

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
    transportationTypeCode: string;

    @ApiProperty()
    transportationTypeName: string;

    @ApiProperty()
    supplierId: string;

    @ApiProperty()
    supplierName: string;

    @ApiProperty()
    productGradId: string;

    @ApiProperty()
    productGradCode: string;

    @ApiProperty()
    productGradeName: string;

    @ApiProperty()
    yearValue: number;

    @ApiProperty()
    monthValue: number;

    @ApiProperty()
    value: number;

    @ApiProperty()
    contractConditionOfSaleId: string;
}