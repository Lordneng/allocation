import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Validate } from "class-validator";
import { IsSignatureAlreadyExist } from "../validateFillter/IsSignatureAlreadyExist";

export class signatureUpdateDto {

    @ApiProperty({ required: true })
    @Validate(IsSignatureAlreadyExist)
    @IsNotEmpty({message: "First Name ห้ามเป็นค่าว่าง"})
    firstName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Last Name ห้ามเป็นค่าว่าง"})
    lastName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Position Name ห้ามเป็นค่าว่าง"})
    positionName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Image ห้ามเป็นค่าว่าง"})
    signatureImg: string;

    @ApiProperty({ required: false })
    rowOrder: Number;

    @ApiProperty({ required: false })
    remark: String;

    @ApiProperty({ required: false, maxLength: 200 })
    activeStatus: String;

    @ApiProperty()
    createByUserId: string;

    @ApiProperty({ required: false })
    createBy: String;

    @ApiProperty({ required: false })
    createDate: Date;

    @ApiProperty()
    updateByUserId: string;

    @ApiProperty()
    updateBy: String;

    @ApiProperty()
    updateDate: Date;
  
}