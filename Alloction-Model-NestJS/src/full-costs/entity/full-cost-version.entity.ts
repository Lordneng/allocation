import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class FullCostVersion extends CreatedEntity<number>{

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    year: Number

    @Column({ nullable: true })
    costVersion: Number

    @Column({ nullable: true })
    priceVersion: Number

    @Column({ nullable: true })
    priceOldVersion: Number

    @Column({ nullable: true, length: 200 })
    action: String

    @Column({ nullable: true, length: 200 })
    remark: String

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    versionName: String

    @Column({ nullable: true, length: 200 })
    filePath: String

    @Column({ nullable: true, length: 200 })
    fileName: String

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

    @Column({ nullable: true })
    isApply: boolean

    @Column({ nullable: true, length: 200 })
    tierCode: String
    
    @Column({ nullable: true, length: 200 })
    tierName: String
}