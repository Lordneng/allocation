
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class ProductGradeUpdateDto {

    @ApiProperty()
    id: string
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    productId: string

    @ApiProperty({ required: true })
    productGrade: string

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