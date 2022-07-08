import { CreatedEntity } from "../../../common/data/models/entity";
import { Entity, ViewEntity, Column } from "typeorm";

@Entity()
export class MasterConditionOfSaleSmartPricePrice extends CreatedEntity<number> {
    @Column({ nullable: true })
    transation_date: Date;

    @Column({ nullable: true, length: 200 })
    product_grp_name: string;

    @Column({ nullable: true, length: 200 })
    product_name: string;

    @Column({ nullable: true, length: 200 })
    customer_name: string;

    @Column({ nullable: true, length: 200 })
    actual_selling_price: string;

    @Column("float", { nullable: true })
    actual_volume: Number

    @Column({ nullable: true })
    insert_date: Date;
}