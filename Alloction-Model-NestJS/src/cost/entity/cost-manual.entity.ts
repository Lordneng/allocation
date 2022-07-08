import { CreatedEntity } from "../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class CostManual extends CreatedEntity<number>{
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable:true  })
    @Generated("uuid")
    costId: string;

    @Column({ nullable: true, length: 200 })
    cost: string

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    product: string

    @Column("float", { nullable: true })
    value: number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    yearValue: number

    @Column({ nullable: true })
    monthValue: number
}