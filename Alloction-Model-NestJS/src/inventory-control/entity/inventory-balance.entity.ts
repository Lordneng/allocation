
import { Entity, Column, Generated } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class InventoryBalance extends CreatedEntity<number>{

    @Column({ nullable:true })
    endOfMonthDate: Date;

    @Column({ nullable:true, default: null  })
    @Generated("uuid")
    productId: string;

    @Column({ nullable: true, length: 200 })
    productCode: string;

    @Column("float", { nullable: true })
    forecastHistoricalEndInventoryQty: Number

    @Column({ nullable: true, length: 50 })
    forecastHistoricalEndInventoryUnitCode: string

    @Column("float", { nullable: true })
    actualHistoricalEndInventoryQty: Number

    @Column({ nullable: true, length: 50 })
    actualHistoricalEndInventoryUnitCode: string

    @Column("float", { nullable: true })
    forecastEndInventoryQty: Number

    @Column({ nullable: true, length: 50 })
    forecastEndInventoryUnitCode: string

    @Column("float", { nullable: true })
    balanceEndInventoryQty: Number

    @Column({ nullable: true, length: 50 })
    balanceEndInventoryUnitCode: string

    @Column({ nullable:true, default: null })
    @Generated("uuid")
    optimizationVersionId: string;

    @Column({ nullable: true, length: 200 })
    optimizationVersionName: string;
}