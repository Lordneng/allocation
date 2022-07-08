import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";
import { IsNotEmpty, Validate } from "class-validator";
import { IsUserAlreadyExist } from "../validateFillter/IsUserAlreadyExist";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User extends CreatedEntity<number> {
    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Username ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    @Validate(IsUserAlreadyExist)
    userName: string;
    @Column({ nullable: true, length: 200 })
    password: string;
    
    @Column({ nullable: true, default: true })
    isVendor: number;
    @ApiProperty({ required: true })
    @IsNotEmpty({message: "First Name ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    firstName: string;
    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Last Name ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    lastName: string;
    @Column({ nullable: true })
    birthDay: Date;
    @Column({ nullable: true, length: 200 })
    phoneNumber: string;
    @Column({ nullable: true, length: 200 })
    unitCode: string;
    @Column({ nullable: true, length: 200 })
    unitName: string;
    @ApiProperty({ required: true })
    @IsNotEmpty({message: "Email ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    email: string;
    @Column({ nullable: true, length: 200 })
    emailSupvisor: string;
    @Column({ nullable: true, length: 200 })
    positionCode: string;
    @Column({ nullable: true, length: 200 })
    positionName: string;
}
