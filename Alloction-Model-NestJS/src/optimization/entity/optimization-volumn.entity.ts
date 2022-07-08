
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class OptimizationVolumn extends CreatedEntity<number>{

    @Column({ nullable: true })
    @Generated("uuid")
    contractConditionOfSaleId: string;

    @Column({ nullable: true, length: 200 })
    productName: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true, length: 200 })
    sourceName: string;

    @Column({ nullable: true, length: 200 })
    demandName: string;

    @Column({ nullable: true, length: 200 })
    deliveryName: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true })
    version: Number

    @Column({ default: false })
    isWithOutDemandAI: boolean;


    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

    @Column("float", { nullable: true })
    value: Number


}