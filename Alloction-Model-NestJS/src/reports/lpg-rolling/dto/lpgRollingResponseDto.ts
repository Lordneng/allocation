import { ApiProperty } from "@nestjs/swagger"
import { MergeAlloDto } from "./mergeAlloDto";
import { TotalSupplyDto } from "./totalSupplyDto";


export class LpgRollingReportResponseDto {

    totalSupply: TotalSupplyDto[];

    domesticDemand: MergeAlloDto[];

    rayongRemark: String;

    khmRemark: String;
}