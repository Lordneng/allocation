import { ApiProperty } from "@nestjs/swagger"

export class M7DemandPlanDto  {

    @ApiProperty()
    id: string

    @ApiProperty()
    year: number

    @ApiProperty()
    month: number

    @ApiProperty()
    yearValue: number

    @ApiProperty()
    monthValue: number
 
    @ApiProperty()
    version: Number

    @ApiProperty({ required: true })
    brpPttepValue: Number

    @ApiProperty()
    brpPttepRemark: string

    @ApiProperty({ required: true })
    ptttankValue: Number

    @ApiProperty()
    ptttankRemark: string

    @ApiProperty({ required: true })
    mtPtttankRefineryValue: Number

    @ApiProperty()
    mtPtttankRefineryRemark: string

    @ApiProperty({ required: true })
    propaneValue: Number

    @ApiProperty()
    propaneRemark: string

    @ApiProperty({ required: true })
    importForExportValue: Number

    @ApiProperty()
    importForExportRemark: string

    @ApiProperty({ required: true })
    spotOdorlessLpgValue: Number

    @ApiProperty()
    spotOdorlessLpgRemark: string

    @ApiProperty()
    unitId: string;

    @ApiProperty()
    unitName: string;

    @ApiProperty({ required: true })
    total: Number

    @ApiProperty({ required: true })
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