
import { Entity, Column } from "typeorm"
import { CreatedEntity } from "../../common/data/models"

@Entity()
export class FullCost extends CreatedEntity<number>{

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    month: Number

    @Column({ nullable: true, length: 200 })
    productVersion: String

    @Column({ nullable: true, length: 200 })
    product: String

    @Column({ nullable: true, length: 200 })
    unit: String

    @Column({ nullable: true, length: 200 })
    source: String

    @Column({ nullable: true, length: 200 })
    demand: String

    @Column({ nullable: true, length: 200 })
    deliveryPoint: String

    @Column("float", { nullable: true })
    M1: Number
    @Column("float", { nullable: true })
    M2: Number
    @Column("float", { nullable: true })
    M3: Number
    @Column("float", { nullable: true })
    M4: Number
    @Column("float", { nullable: true })
    M5: Number
    @Column("float", { nullable: true })
    M6: Number
    @Column("float", { nullable: true })
    M7: Number
    @Column("float", { nullable: true })
    M8: Number
    @Column("float", { nullable: true })
    M9: Number
    @Column("float", { nullable: true })
    M10: Number
    @Column("float", { nullable: true })
    M11: Number
    @Column("float", { nullable: true })
    M12: Number

    @Column("float", { nullable: true })
    calculateM1: Number
    @Column("float", { nullable: true })
    calculateM2: Number
    @Column("float", { nullable: true })
    calculateM3: Number
    @Column("float", { nullable: true })
    calculateM4: Number
    @Column("float", { nullable: true })
    calculateM5: Number
    @Column("float", { nullable: true })
    calculateM6: Number
    @Column("float", { nullable: true })
    calculateM7: Number
    @Column("float", { nullable: true })
    calculateM8: Number
    @Column("float", { nullable: true })
    calculateM9: Number
    @Column("float", { nullable: true })
    calculateM10: Number
    @Column("float", { nullable: true })
    calculateM11: Number
    @Column("float", { nullable: true })
    calculateM12: Number
    @Column({ nullable: true })

    isManualM1: boolean
    @Column({ nullable: true })
    isManualM2: Number
    @Column({ nullable: true })
    isManualM3: Number
    @Column({ nullable: true })
    isManualM4: Number
    @Column({ nullable: true })
    isManualM5: Number
    @Column({ nullable: true })
    isManualM6: Number
    @Column({ nullable: true })
    isManualM7: Number
    @Column({ nullable: true })
    isManualM8: Number
    @Column({ nullable: true })
    isManualM9: Number
    @Column({ nullable: true })
    isManualM10: Number
    @Column({ nullable: true })
    isManualM11: Number
    @Column({ nullable: true })
    isManualM12: Number

    @Column({ nullable: true, length: 200 })
    formulaM1: String
    @Column({ nullable: true, length: 200 })
    formulaM2: String
    @Column({ nullable: true, length: 200 })
    formulaM3: String
    @Column({ nullable: true, length: 200 })
    formulaM4: String
    @Column({ nullable: true, length: 200 })
    formulaM5: String
    @Column({ nullable: true, length: 200 })
    formulaM6: String
    @Column({ nullable: true, length: 200 })
    formulaM7: String
    @Column({ nullable: true, length: 200 })
    formulaM8: String
    @Column({ nullable: true, length: 200 })
    formulaM9: String
    @Column({ nullable: true, length: 200 })
    formulaM10: String
    @Column({ nullable: true, length: 200 })
    formulaM11: String
    @Column({ nullable: true, length: 200 })
    formulaM12: String

    @Column({ nullable: true })
    costVersion: Number

    @Column({ nullable: true })
    priceVersion: Number

    @Column({ nullable: true })
    priceOldVersion: Number

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    filePath: String

    @Column({ nullable: true })
    rowOrder: Number

    @Column({ nullable: true, length: 200 })
    createBy: String

    @Column({ nullable: true })
    createDate: Date

    @Column({ nullable: true, length: 200 })
    updateBy: String

    @Column({ nullable: true })
    updateDate: Date
}