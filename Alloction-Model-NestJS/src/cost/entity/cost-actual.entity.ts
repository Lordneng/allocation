
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class CostActual extends CreatedEntity<number>{

    @Column({ nullable: true })
    @Generated("uuid")
    costId: string;

    @Column({ nullable: true, length: 200 })
    cost: string

    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true, length: 200 })
    remark: string;
}