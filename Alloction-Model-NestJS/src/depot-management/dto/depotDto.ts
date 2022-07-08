import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmptyObject, IsObject, ValidateNested, ValidatePromise, ValidationArguments } from "class-validator";
import { DepotManagementMeter, DepotManagementMeterForm, DepotManagementMeterVersion } from "../entity";

export class DepotDto {

    @ApiProperty({type: [DepotManagementMeter] })
    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => DepotManagementMeter)
    data: DepotManagementMeter[]

    @ApiProperty({type: [DepotManagementMeterForm]})
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DepotManagementMeterForm)
    form: DepotManagementMeterForm[]

    @IsArray()
    @ApiProperty({type:[DepotManagementMeterVersion]})
    @ValidateNested({ each: true }) 
    @Type(() => DepotManagementMeterVersion)
    version : DepotManagementMeterVersion[]
}