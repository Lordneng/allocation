import { CreatedEntity } from "../../../common/data/models/entity";
import { Entity, ViewEntity, Column } from "typeorm";

@Entity()
export class MasterReferenceSmartPrice extends CreatedEntity<number> {
    @Column({ nullable: true })
    trans_date: Date;

    @Column({ nullable: true,length: 200 })
    ref_price_name: string;

    @Column({ nullable: true,length: 200 })
    input_name: string;

    @Column({ nullable: true,length: 200 })
    unit: string;

    @Column({ nullable: true,length: 200 })
    type: string;

    @Column("float", { nullable: true })
    actual_price: Number

    @Column("float", { nullable: true })
    rolling_price: Number;

    @Column({ nullable: true })
    insert_date: Date;
}