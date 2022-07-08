import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MasterCostProductTypes extends CreatedEntity<number> {

    @Column({ nullable: true, length: 200 })
    value: string;

    @Column({ nullable: true, length: 200 })
    name: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true, length: 200 })
    remark: string;

    @Column({ nullable: true, length: 200 })
    activeStatus: string;

}
