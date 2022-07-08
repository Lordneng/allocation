import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

@Entity()
export class MasterProductGrade extends CreatedEntity<number>{
    
    @ApiProperty({ required: true })
    @Generated("uuid")
    @IsNotEmpty()
    @Column({ nullable: true })
    productId: string

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "รหัสเกรดผลิตภัณฑ์ ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true,length: 200 })
    productGradeCode: string;
    

    @ApiProperty({ required: true })
    @IsNotEmpty({message: "เกรดผลิตภัณฑ์ ห้ามเป็นค่าว่าง"})
    @Column({ nullable: true,length: 200 })
    productGrade: string;
}