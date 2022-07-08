import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column, Generated } from "typeorm"

@Entity()
export class Contract extends CreatedEntity<number>{

    @Column({ nullable: true, length: 200 })
    code: string

    @Column({ nullable: true, length: 200 })
    name: string

    @Column({ nullable: true, length: 200 })
    shortName: string

    @Column({ nullable: true, length: 500 })
    contractNumber: string

    @Column({ nullable: true })
    @Generated("uuid")
    contractTypeId: string;

    @Column({ nullable: true, length: 200 })
    contractTypeName: string;

    @Column({ nullable: true })
    startContractDate: Date;

    @Column({ nullable: true, })
    endContractDate: Date;

    @Column({ nullable: true })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    productName: string;

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    minVolumn: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    maxVolumn: Number

    @Column({ default: false })
    isMinVolumnNoLimit: boolean

    @Column({ default: false })
    isMaxVolumnNoLimit: boolean

    @Column({ nullable: true })
    @Generated("uuid")
    unitId: string;

    @Column({ nullable: true, length: 200 })
    unitName: string;

    @Column({ nullable: true })
    @Generated("uuid")
    customerId: string;

    @Column({ nullable: true, length: 200 })
    customerName: string;

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    totalActualVolumn: Number

    @Column({ nullable: true })
    @Column("float", { nullable: true })
    totalForecastVolumn: Number

}