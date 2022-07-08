import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator"
import { M7DemandPlanDto } from "./m7DemandPlanDto"
import { M7DemandPlanVersionDto } from "./m7DemandPlanVersionDto"
import { M7DemandValueDto } from "./m7DemandValueDto"
import { M7DemandValueManualDto } from "./m7DemandValueManualDto"

export class M7DemandPlanRequestDto  {

    @IsArray()
    @ArrayNotEmpty({message: "plant ห้ามว่าง"})
    @ApiProperty({type:[M7DemandPlanDto], required: true})
    @ValidateNested() 
    @Type(() => M7DemandPlanDto)
    demandPlan : M7DemandPlanDto[]

    @IsArray()
    @ApiProperty({type:[M7DemandValueDto]})
    @ValidateNested({ each: true }) 
    @Type(() => M7DemandValueDto)
    demandPlanValue : M7DemandValueDto[]

    @IsArray()
    @ApiProperty({type:[M7DemandValueManualDto]})
    @ValidateNested({ each: true }) 
    @Type(() => M7DemandValueManualDto)
    demandPlanManual : M7DemandValueManualDto[]

    @IsObject()
    @IsNotEmptyObject()
    @ApiProperty({type:M7DemandPlanVersionDto})
    @ValidateNested() 
    @Type(() => M7DemandPlanVersionDto)
    version : M7DemandPlanVersionDto
}