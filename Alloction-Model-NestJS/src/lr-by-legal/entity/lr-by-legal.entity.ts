import { CreatedEntity } from "../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class LRByLegal extends CreatedEntity<number> {
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

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    remarkMonth: string;
}

@Entity()
export class LRByLegalHistory extends LRByLegal {

}