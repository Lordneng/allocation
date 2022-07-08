import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty } from "class-validator";

export class RefinerySupplierRequest {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    year: number

    @ApiProperty({ required: true })
    @IsNotEmpty()
    month: number

    @ApiProperty({ required: true })
    version: number;

    @ApiProperty({ type: [String], required: true })
    @IsArray()
    @ArrayNotEmpty({message: "suppiler ห้ามเป็นว่าง"})
    supplier: string[]
    
}