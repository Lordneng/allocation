import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";

@Entity()
export class ReferencePriceManual extends CreatedEntity<number>{
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true, length: 200 })
    cost: string

    @Column({ nullable: true, length: 200 })
    product: string

    @Column("numeric", { nullable: true })
    value: number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    yearValue: number

    @Column({ nullable: true })
    monthValue: number
}