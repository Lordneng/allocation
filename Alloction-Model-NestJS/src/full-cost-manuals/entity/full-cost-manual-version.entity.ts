import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class FullCostManualVersion extends CreatedEntity<number>{

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true })
    year: Number

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

    @Column({ nullable: true })
    isApply: boolean

}