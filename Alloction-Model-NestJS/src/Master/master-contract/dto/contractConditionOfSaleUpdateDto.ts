import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { IsSubstituedProductNameNull } from "../validateFillter/IsSubstituedProductNameNull";
import { IsSubstituedProductRateNull } from "../validateFillter/IsSubstituedProductRateNull";
import { IsSupplierNameNull } from "../validateFillter/IsSupplierNameNull";
import { IsTierMaxVolumnNull } from "../validateFillter/IsTierMaxVolumnNull";
import { IsTierMinVolumnNull } from "../validateFillter/IsTierMinVolumnNull";
import { IsTierNameNull } from "../validateFillter/IsTierNameNull";
import { IsTierTypeNull } from "../validateFillter/IsTierTypeNull";
import { IsUnitNull } from "../validateFillter/IsUnitNull";

export class ContractConditionOfSaleUpdateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    id: string

    @ApiProperty()
    contractId: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty()
    customerContractPlantId: string;

    @ApiProperty()
    customerPlantId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "เงื่อนไขขาย ห้ามว่าง" })
    conditionsOfSaleId: string;

    @ApiProperty()
    conditionsOfSaleName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "source ห้ามว่าง" })
    sourceId: string;

    @ApiProperty()
    sourceName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "delivery ห้ามว่าง" })
    deliveryId: string;

    @ApiProperty({ required: true })
    deliveryName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: "demand name ห้ามว่าง" })
    demandName: string;

    @ApiProperty({ required: true })
    // @IsNotEmpty({ message: "selling price formula ห้ามว่าง" })
    sellingPriceFormula: string;

    @ApiProperty()
    startSellingPriceFomulaDate: Date

    @ApiProperty()
    endSellingPriceFomulaDate: Date

    @ApiProperty()
    tierNo: Number

    @ApiProperty()
    @Validate(IsTierTypeNull)
    tierTypeId: string;

    @ApiProperty()
    @Validate(IsTierNameNull)
    tierTypeName: string;

    @ApiProperty()
    @Validate(IsTierMinVolumnNull)
    minVolumeTier: Number

    @ApiProperty()
    @Validate(IsTierMaxVolumnNull)
    maxVolumeTier: Number

    @ApiProperty()
    isMinVolumeTierNoLimit: boolean

    @ApiProperty()
    isMaxVolumeTierNoLimit: boolean

    @ApiProperty()
    unitId: string;

    @ApiProperty()
    @Validate(IsUnitNull)
    unitName: string;

    @ApiProperty()
    substituedProductId: string;

    @ApiProperty()
    @Validate(IsSubstituedProductNameNull)
    substituedProductName: string;

    @ApiProperty()
    @Validate(IsSubstituedProductRateNull)
    substituedRate: Number

    @ApiProperty()
    supplierId: string;

    @ApiProperty()
    @Validate(IsSupplierNameNull)
    supplierName: string;

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