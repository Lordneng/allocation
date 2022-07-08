import { ApiProperty } from "@nestjs/swagger"
import { SummaryDataDto } from "./summaryDataDto"


export class SummaryReportResponseDto {
    @ApiProperty()
    year: number;

    @ApiProperty()
    month: number;
    
    @ApiProperty()
    volumeKT : SummaryDataDto[];

    @ApiProperty()
    revenue : SummaryDataDto[];

    @ApiProperty()
    margin : SummaryDataDto[];
}