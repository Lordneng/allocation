import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class AbilityPlanKhmManual extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    productVersion: string;

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    isApply: boolean
}