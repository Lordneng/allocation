import { ApiProperty } from "@nestjs/swagger";
import { EthanePlanningDto } from "./ethanePlanningDto";

export class monthlyReportDto {
    @ApiProperty()
    plan: EthanePlanningDto[];

    @ApiProperty()
    estimate: EthanePlanningDto[];

    @ApiProperty()
    month: EthanePlanningDto[];

    @ApiProperty()
    remark: String;
}