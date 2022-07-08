import { CreatedEntity } from "../../../common/data/models"
import { Entity, Column } from "typeorm"

@Entity()
export class GlobalVariable extends CreatedEntity<number>{

    @Column({ nullable: true, length: 200 })
    variable: string

    @Column({ nullable: true, length: 200 })
    value: string

    @Column({ nullable: true, length: "MAX" })
    remark: string

}