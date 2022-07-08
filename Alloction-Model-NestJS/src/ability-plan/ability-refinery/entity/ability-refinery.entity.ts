import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class AbilityRefinery extends CreatedEntity<number> {
    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable:true  })
    @Generated("uuid")
    supplierId: string;
    
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    productCode: string;

    @Column({ nullable: true, length: 200 })
    supplier: string;

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number
  
    @Column("float", { nullable: true })
    value: Number
}

@Entity()
export class AbilityRefineryHistory extends AbilityRefinery {

}