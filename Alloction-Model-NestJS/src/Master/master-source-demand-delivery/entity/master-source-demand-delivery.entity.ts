import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MasterSourceDemandDelivery extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    value: string;

    @Column({ nullable: true, length: 200 })
    deliveryPoint: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true, length: 200 })
    remark: string;

    @Column({ nullable: true, length: 200 })
    activeStatus: string;

    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    source: string;

    @Column({ nullable: true, length: 200 })
    demand: string;

}