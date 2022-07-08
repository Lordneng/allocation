import { ApiProperty } from "@nestjs/swagger"

export class TotalSupplyDto {

    @ApiProperty()
    productId: string;
    
    @ApiProperty()
    product: string;

    @ApiProperty()
    productionPlantId: string;

    @ApiProperty()
    productionPlant: string;

    @ApiProperty()
    yearValue: Number

    @ApiProperty()
    monthValue: Number

    @ApiProperty()
    value: Number
    
}