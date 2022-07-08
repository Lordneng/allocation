import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";

export class CalmarginReportDto {

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
    sellingPriceFormula: string;

    @ApiProperty()
    sellingPriceFormulaText: string;

    @ApiProperty()
    startSellingPriceFomulaDate: Date;

    @ApiProperty()
    endSellingPriceFomulaDate: Date;

    @ApiProperty()
    supplierId: string;

    @ApiProperty()
    supplierName: string;

    @ApiProperty()
    fullcostFormula: string

    @ApiProperty()
    fullcostFormulaText: string

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
    fullCostValue: number;

    @ApiProperty()
    sellingPriceValue: number;

    @ApiProperty()
    marginPerUnitValue: number;

    @ApiProperty()
    contractConditionOfSaleId: string;

}