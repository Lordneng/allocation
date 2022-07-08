import { ApiProperty } from "@nestjs/swagger"


export class MergeAlloDto {

    source: string;

    demand: string;

    deliveryPoint: string;

    monthValue: Number;

    yearValue: Number
    
    value: Number
}