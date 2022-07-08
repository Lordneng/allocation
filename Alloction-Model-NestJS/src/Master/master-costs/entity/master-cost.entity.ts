import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MasterCost extends CreatedEntity<number> {
    @Column({ nullable: true, length: 200 })
    productName: string;

    @Column({ nullable: true, length: 200 })
    productCostName: string;

    @Column({ nullable: true,length: 200 })
    unit: string

    @Column({ nullable: true,length: 200 })
    parameterName: string;

    @Column({ nullable: true, length: 200 })
    productCostNameSmartPrice: string;
}