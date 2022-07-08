
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class OptimizationC3LpgRevision extends CreatedEntity<number>{

    @Column({ nullable: true })
    @Generated("uuid")
    optimizationC3LpgId: string;

    @Column({ nullable: true, length: 200 })
    productionGroup: string;

    @Column({ nullable:true  })
    production: string;

    @Column({ nullable: true, length: 200 })
    customerType: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true, length: 200 })
    source: string;

    @Column({ nullable: true, length: 200 })
    demand: string;

    @Column({ nullable: true, length: 200 })
    deliveryPoint: string;

    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true, length: 200 })
    remark: string;

    @Column({ nullable: true })
    workDay: Number

    @Column("float", { nullable: true })
    calculator: Number

    @Column({ nullable: true })
    isManual: boolean

    @Column("float", { nullable: true })
    valueManual: Number

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;
    
    @Column({ default: false })
    isWithOutDemandAI: boolean;
}