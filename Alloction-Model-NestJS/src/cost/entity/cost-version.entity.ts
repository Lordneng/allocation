import { CreatedEntity } from "../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class CostVersion extends CreatedEntity<number>{
    @Column({ nullable: true })
    year: number

    @Column({ nullable: true })
    month: number

    @Column({ nullable: true, length: 200 })
    filePath: string

    @Column({ nullable: true, length: 200 })
    fileName: string

    @Column({ nullable: true, length: 200 })
    fileNameUser: string

    @Column({ nullable: true })
    version: Number

    @Column({ nullable: true, length: 200 })
    versionName: string

    @Column({ nullable: true })
    isApply: boolean
}