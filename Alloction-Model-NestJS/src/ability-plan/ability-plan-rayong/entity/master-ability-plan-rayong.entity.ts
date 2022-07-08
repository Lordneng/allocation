import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class MasterAbilityPlanRayong extends CreatedEntity<string> {

    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;
    
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true })
    @Generated("uuid")
    productionPlantId: string;

    @Column({ nullable: true, length: 200 })
    productionPlantCode: string;

    @Column({ nullable: true, length: 200 })
    productionPlant: string;

    @Column({ nullable: true })
    productionPlantRowOrder: number;

}