import { CreatedEntity } from "../../common/data/models";
import { Entity, Column, Generated } from "typeorm";


@Entity()
export class TankCap extends CreatedEntity<number> {

    @Column({ nullable:true  })
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

    @Column({ nullable: true })
    monthValue: Number;

    @Column({ nullable: true })
    yearValue: Number

    @Column("float", { nullable: true })
    value: Number

    @Column("float", { nullable: true })
    capacity: Number

    @Column({ nullable: true})
    remark: string;

    @Column({ nullable: true })
    modelId: Number

    @Column({ nullable: true, length: 200 })
    tankCapType: string
}

@Entity()
export class TankCapHistory extends TankCap {

}