import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class TankCapForm extends CreatedEntity<number> {
    
    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;
    
    @Column({ nullable: true, length: 200 })
    product: string;

    @Column({ nullable: true, length: 200 })
    productionPlant: string;

    @Column({ nullable: true, length: 200 })
    unit: string;

    @Column({ nullable: true })
    year: Number;

    @Column({ nullable: true })
    month: Number;

    @Column({ nullable: true })
    version: Number;

    @Column("float", { nullable: true })
    value: Number

    @Column("float", { nullable: true })
    capacity: Number

    @Column({ nullable: true})
    remark: string;

    @Column({ nullable: true })
    isAll: boolean
    
    @Column({ nullable: true })
    modelId: Number

    @Column({ nullable: true, length: 200 })
    tankCapType: string
}

@Entity()
export class TankCapFormHistory extends TankCapForm {

}