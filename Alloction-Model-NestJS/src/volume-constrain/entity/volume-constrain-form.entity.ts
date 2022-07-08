import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

@Entity()
export class VolumeConstrainForm extends CreatedEntity<number> {

    // @ApiProperty({ required: true })
    // @IsNotEmpty({ message: "เกรดผลิตภัณฑ์ ห้ามเป็นค่าว่าง" })
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true, length: 200 })
    source: string;

    @Column({ nullable: true, length: 200 })
    demand: string;

    @Column({ nullable: true, length: 200 })
    deliveryPoint: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column("float", { nullable: true })
    min: Number

    @Column("float", { nullable: true })
    max: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, default: true })
    isCalculate: boolean;

    @Column({ nullable: true })
    isAll: boolean

    @Column({ nullable: true })
    isNullMin: boolean

    @Column({ nullable: true })
    isNullMax: boolean

    @Column({ nullable: true, length: 200 })
    contractNumber: string;
    
    @Column({ nullable: true })
    @Generated("uuid")
    contractConditionOfSaleId: string;
}