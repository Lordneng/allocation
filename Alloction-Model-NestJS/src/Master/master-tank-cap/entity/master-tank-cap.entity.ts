import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column } from "typeorm";


@Entity()
export class MasterTankCap extends CreatedEntity<number> {

    @Column({ nullable: true, length: 200 })
    productionPlant: string;

    @Column({ nullable: true, length: 200 })
    productName: string;

    @Column({ nullable: true, length: 200 })
    productCostName: string;

    @Column({ nullable: true,length: 200 })
    unit: string

    @Column({ nullable: true })
    modelId: Number

    @Column({ nullable: true, length: 200 })
    tankCapType: string

}