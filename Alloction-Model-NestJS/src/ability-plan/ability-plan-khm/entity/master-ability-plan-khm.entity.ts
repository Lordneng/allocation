import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";

@Entity()
export class MasterAbilityPlanKhm extends CreatedEntity<number> {
    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;
    
    @Column({ nullable: true, length: 200 })
    product: string;

}
