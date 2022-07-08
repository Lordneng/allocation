import { ApiProperty } from "@nestjs/swagger"

export class M7DemandPlanVersionDto  {

    @ApiProperty()
    id: string

    @ApiProperty()
    year: number

    @ApiProperty()
    month: number

    @ApiProperty()
    version: number

    @ApiProperty()
    versionName: string

    @ApiProperty()
    filePath: string
    
    @ApiProperty()
    fileName: string

    @ApiProperty()
    fileNameUser: string

    @ApiProperty()
    abilityPlanKhmVersionId: string;

    @ApiProperty()
    abilityRefineryVersionId: string;

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