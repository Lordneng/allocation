
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class InventoryMovement extends CreatedEntity<number>{
    @Column({ nullable:true })
    endOfMonthDate: Date;

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true })
    monthValue: number

    @Column({ nullable: true })
    yearValue: Number

    @Column({ nullable:true  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    productCode: string;

    @Column({ nullable: true })
    movementType: Number;

    @Column({ nullable: true, length: 200 })
    movementName: string;

    @Column({ nullable: true, length: 200 })
    workInProgressCode: string;

    @Column({ nullable: true, length: 200 })
    workInProgressName: string;

    @Column("float", { nullable: true })
    workInProgressTotalQty: Number

    @Column({ nullable: true, length: 50 })
    workInProgressUnitCode: string

    @Column("float", { nullable: true })
    forecastDemandTotalQty: Number

    @Column({ nullable: true, length: 50 })
    forecastDemandUnitCode: string

    @Column("float", { nullable: true })
    actualDemandTotalQty: Number

    @Column({ nullable: true, length: 50 })
    actualDemandUnitCode: string

    @Column({ nullable: true, length: 50 })
    closeStockStatus: string

    @Column({ nullable:true, default: null })
    @Generated("uuid")
    abilityKhmVersionId: string;

    @Column({ nullable: true, length: 200 })
    abilityKhmVersionName: string;

    @Column({ nullable:true, default: null })
    @Generated("uuid")
    abilityRYVersionId: string;

    @Column({ nullable: true, length: 200 })
    abilityRYVersionName: string;

    @Column({ nullable:true, default: null })
    @Generated("uuid")
    abilityRefineryVersionId: string;

    @Column({ nullable: true, length: 200 })
    abilityRefineryVersionName: string;

    @Column({ nullable:true, default: null })
    @Generated("uuid")
    optimizationVersionId: string;

    @Column({ nullable: true, length: 200 })
    optimizationVersionName: string;
}