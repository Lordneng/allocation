import { ApiProperty } from "@nestjs/swagger"
import { EthanePlanningDailyDto } from "./ethanePlanningDailyDto";
import { monthlyReportDto } from "./monthlyReportDto"

export class EthanePlanningReportResponseDto {

    @ApiProperty()
    monthly: monthlyReportDto;

    @ApiProperty()
    daily: EthanePlanningDailyDto[];
}