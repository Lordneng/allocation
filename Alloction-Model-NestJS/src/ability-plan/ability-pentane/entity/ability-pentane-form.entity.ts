import { CreatedEntity } from "../../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class AbilityPentaneForm extends CreatedEntity<number> {
    
    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;
    
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    productCode: string;

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;

    @Column({ nullable: true })
    isCalculate: boolean

    @Column("float", { nullable: true })
    value: Number

    @Column({ nullable: true })
    dayValue: Number

    @Column({ nullable: true })
    tierCode: string

    @Column({ nullable: true })
    tierName: string

    @Column({ nullable: true })
    isAll: boolean
}

@Entity()
export class AbilityPentaneFormHistory extends AbilityPentaneForm {

}