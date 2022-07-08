import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";

@Entity()
export class MasterCostSmartPrice extends CreatedEntity<number> {
    @Column({ nullable: true })
    transation_date: Date;

    @Column({ nullable: true, length: 200 })
    gsp_cost_name: string;

    @Column({ nullable: true, length: 200 })
    name: string;

    @Column("float", { nullable: true })
    actual: Number

    @Column("float", { nullable: true })
    rolling: Number;

    @Column({ nullable: true })
    insert_date: Date;
}