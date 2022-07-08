import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class AbilityRefineryForm extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;

    @Column({ nullable: true })
    isCalculate: boolean

    @Column({ nullable: true })
    value: Number

    @Column({ nullable: true })
    dayValue: Number
}