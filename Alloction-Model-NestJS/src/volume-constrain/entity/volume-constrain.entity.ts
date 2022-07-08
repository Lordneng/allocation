import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class VolumeConstrain extends CreatedEntity<number> {
    @Column({ nullable:true,length: 200 })
    product: string;

    @Column({ nullable:true,length: 200 })
    unit: string;

    @Column({ nullable:true,length: 200 })
    source: string;

    @Column({ nullable:true,length: 200 })
    demand: string;

    @Column({ nullable:true,length: 200 })
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
    
    @Column({nullable:true,default: true})
    isCalculate: boolean;

    @Column({ nullable: true })
    dayValue: Number
    
    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

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