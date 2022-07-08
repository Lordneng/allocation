import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, Validate } from "class-validator";

export class userUpdateDto {

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Username ห้ามเป็นค่าว่าง"})
    userName: string;

    @ApiProperty()
    password: string;
    @ApiProperty({ required: true })
    isVendor: number;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "First Name ห้ามเป็นค่าว่าง"})
    firstName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Last Name ห้ามเป็นค่าว่าง"})
    lastName: string;

    @ApiProperty()
    birthDay: Date;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    unitCode: string;

    @ApiProperty()
    unitName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Email ห้ามเป็นค่าว่าง"})
    email: string;

    @ApiProperty()
    emailSupvisor: string;

    @ApiProperty()
    positionCode: string;

    @ApiProperty()
    positionName: string;

    @IsArray()
    @ApiProperty({ required: true })
    userGroupDropdown: string[]

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