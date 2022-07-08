import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";
import { IsNotEmpty, Validate } from "class-validator";
import { IsSignatureAlreadyExist } from "../validateFillter/IsSignatureAlreadyExist";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class Signature extends CreatedEntity<number> {

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "firstName ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    @Validate(IsSignatureAlreadyExist)
    firstName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "lastName ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    lastName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "positionName ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: 200 })
    positionName: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "signatureImg ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true, length: "MAX" })
    signatureImg: string;
}
