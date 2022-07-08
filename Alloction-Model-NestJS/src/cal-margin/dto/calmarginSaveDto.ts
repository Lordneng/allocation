import { ApiProperty } from "@nestjs/swagger";
import { SellingPricesManual } from "../../selling-price-manual/entity";
import { FullCostManual } from "../../full-cost-manuals/entity";

export class CalmarginSaveDto {

    @ApiProperty()
    costProductTypeId: string;

    @ApiProperty()
    costVersionId: string;

    @ApiProperty()
    referencePriceVersionId: string;

    @ApiProperty()
    version: Number

    @ApiProperty()
    versionName: string

    @ApiProperty()
    year: Number

    @ApiProperty()
    month: Number

    createByUserId: string;

    createBy: String;

    updateByUserId: string;

    updateBy: String;

    @ApiProperty({type: [FullCostManual]})
    fullCostManuals : FullCostManual[];

    @ApiProperty({type: [SellingPricesManual]})
    sellingPricesManuals : SellingPricesManual[];
}