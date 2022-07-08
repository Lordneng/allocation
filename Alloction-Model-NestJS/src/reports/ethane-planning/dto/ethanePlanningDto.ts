import { ApiProperty } from "@nestjs/swagger";

export class EthanePlanningDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;
    
    @ApiProperty()
    product: string;

    @ApiProperty()
    productionPlantId: string;

    @ApiProperty()
    productionPlant: string;
    
    @ApiProperty()
    year: Number

    @ApiProperty()
    month: Number

    @ApiProperty()
    version: Number

    @ApiProperty()
    yearValue: Number

    @ApiProperty()
    monthValue: Number

    @ApiProperty()
    value: Number

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